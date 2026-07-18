import "dotenv/config";

import { createClient } from "@supabase/supabase-js";

import { prisma } from "../src/lib/prisma";

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

async function seedAdmin() {
  const supabaseUrl = getRequiredEnvironmentVariable(
    "NEXT_PUBLIC_SUPABASE_URL",
  );

  const serviceRoleKey = getRequiredEnvironmentVariable(
    "SUPABASE_SERVICE_ROLE_KEY",
  );

  const adminName = getRequiredEnvironmentVariable("ADMIN_NAME");
  const adminEmail =
    getRequiredEnvironmentVariable("ADMIN_EMAIL").toLowerCase();
  const adminPassword = getRequiredEnvironmentVariable("ADMIN_PASSWORD");

  if (adminPassword.length < 12) {
    throw new Error("ADMIN_PASSWORD must contain at least 12 characters.");
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  const {
    data: { users },
    error: listUsersError,
  } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listUsersError) {
    throw listUsersError;
  }

  if (users.length > 1) {
    throw new Error(
      "More than one Supabase Auth user exists. Remove extra users before seeding.",
    );
  }

  let authUser = users.find((user) => user.email?.toLowerCase() === adminEmail);

  if (users.length === 1 && !authUser) {
    throw new Error(
      "A different Auth user already exists. The final project must contain only one Admin user.",
    );
  }

  if (!authUser) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        name: adminName,
        role: "ADMIN",
      },
    });

    if (error) {
      throw error;
    }

    authUser = data.user;
  } else {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      authUser.id,
      {
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          name: adminName,
          role: "ADMIN",
        },
      },
    );

    if (error) {
      throw error;
    }

    authUser = data.user;
  }

  const profiles = await prisma.profile.findMany({
    select: {
      id: true,
      authUserId: true,
      email: true,
    },
  });

  if (
    profiles.length > 1 ||
    (profiles.length === 1 && profiles[0].authUserId !== authUser.id)
  ) {
    throw new Error(
      "A conflicting profile exists. The final project must contain one Admin profile.",
    );
  }

  await prisma.profile.upsert({
    where: {
      authUserId: authUser.id,
    },
    update: {
      name: adminName,
      email: adminEmail,
      role: "ADMIN",
    },
    create: {
      authUserId: authUser.id,
      name: adminName,
      email: adminEmail,
      role: "ADMIN",
    },
  });

  console.log("Admin seed completed.");
  console.log(`Admin email: ${adminEmail}`);
  console.log(`Auth user ID: ${authUser.id}`);
}

seedAdmin()
  .catch((error) => {
    console.error("Admin seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
