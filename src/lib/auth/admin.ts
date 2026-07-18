import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const getCurrentAdmin = cache(async () => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.getClaims();

  const authUserId = data?.claims?.sub;

  if (error || typeof authUserId !== "string") {
    return null;
  }

  const profile = await prisma.profile.findFirst({
    where: {
      authUserId,
      role: "ADMIN",
    },
    select: {
      id: true,
      authUserId: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return profile;
});

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/login");
  }

  return admin;
}
