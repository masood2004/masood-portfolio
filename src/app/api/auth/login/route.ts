import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const requestBody: unknown = await request.json();

    const result = loginSchema.safeParse(requestBody);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check your login information.",
          errors: result.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: result.data.email,
      password: result.data.password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
        },
      );
    }

    const profile = await prisma.profile.findFirst({
      where: {
        authUserId: data.user.id,
        role: "ADMIN",
      },
      select: {
        id: true,
      },
    });

    if (!profile) {
      await supabase.auth.signOut({
        scope: "local",
      });

      return NextResponse.json(
        {
          success: false,
          message: "This account is not authorised.",
        },
        {
          status: 403,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful.",
    });
  } catch (error) {
    console.error("Admin login failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Login is temporarily unavailable.",
      },
      {
        status: 500,
      },
    );
  }
}
