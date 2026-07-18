import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  checkLoginBlock,
  clearLoginFailures,
  getClientIp,
  recordLoginFailure,
} from "@/lib/security/login-rate-limit";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginRequestSchema } from "@/lib/validations/admin";

export const runtime = "nodejs";

function blockedResponse(retryAfterSeconds: number) {
  const retryMinutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));

  return NextResponse.json(
    {
      success: false,
      code: "TOO_MANY_ATTEMPTS",
      message:
        `Too many unsuccessful login attempts. ` +
        `Please try again in approximately ${retryMinutes} minute${
          retryMinutes === 1 ? "" : "s"
        }.`,
      retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
      },
    },
  );
}

export async function POST(request: Request) {
  try {
    const ipAddress = getClientIp(request);

    const existingBlock = await checkLoginBlock(ipAddress);

    if (existingBlock.blocked) {
      return blockedResponse(existingBlock.retryAfterSeconds);
    }

    const requestBody: unknown = await request.json();

    const result = loginRequestSchema.safeParse(requestBody);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          code: "INVALID_REQUEST",
          message: "Please check your login information.",
          errors: result.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    /*
     * reCAPTCHA must pass before Supabase receives a
     * password-authentication request.
     */
    const recaptchaResult = await verifyRecaptchaToken(
      result.data.recaptchaToken,
      ipAddress,
    );

    if (!recaptchaResult.success) {
      const failure = await recordLoginFailure(ipAddress);

      if (failure.blocked) {
        return blockedResponse(failure.retryAfterSeconds);
      }

      return NextResponse.json(
        {
          success: false,
          code: "RECAPTCHA_FAILED",
          message:
            "Human verification failed. Please wait a moment and try again.",
        },
        {
          status: 403,
        },
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: result.data.email,
      password: result.data.password,
    });

    if (error || !data.user) {
      const failure = await recordLoginFailure(ipAddress);

      if (failure.blocked) {
        return blockedResponse(failure.retryAfterSeconds);
      }

      return NextResponse.json(
        {
          success: false,
          code: "INVALID_CREDENTIALS",
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

      const failure = await recordLoginFailure(ipAddress);

      if (failure.blocked) {
        return blockedResponse(failure.retryAfterSeconds);
      }

      return NextResponse.json(
        {
          success: false,
          code: "UNAUTHORISED_ACCOUNT",
          message: "Invalid email or password.",
        },
        {
          status: 403,
        },
      );
    }

    /*
     * A valid Admin login clears previous failed attempts.
     */
    await clearLoginFailures(ipAddress);

    return NextResponse.json({
      success: true,
      message: "Login successful.",
    });
  } catch (error) {
    console.error("Admin login failed:", error);

    return NextResponse.json(
      {
        success: false,
        code: "LOGIN_UNAVAILABLE",
        message: "Login is temporarily unavailable.",
      },
      {
        status: 500,
      },
    );
  }
}
