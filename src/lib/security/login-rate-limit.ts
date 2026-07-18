import "server-only";

import { prisma } from "@/lib/prisma";

const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MINUTES = 15;
const BLOCK_DURATION_MINUTES = 15;

type BlockResult =
  | {
      blocked: false;
    }
  | {
      blocked: true;
      retryAfterSeconds: number;
    };

function minutesFromNow(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

function secondsUntil(date: Date): number {
  return Math.max(1, Math.ceil((date.getTime() - Date.now()) / 1000));
}

export function getClientIp(request: Request): string {
  /*
   * Vercel provides the actual client IP through these headers.
   * x-vercel-forwarded-for is preferred on Vercel.
   */
  const forwardedIp =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip");

  const ipAddress = forwardedIp?.split(",")[0]?.trim() || "local-development";

  return ipAddress.slice(0, 64);
}

export async function checkLoginBlock(ipAddress: string): Promise<BlockResult> {
  const record = await prisma.loginAttempt.findUnique({
    where: {
      ipAddress,
    },
  });

  if (!record) {
    return {
      blocked: false,
    };
  }

  const now = new Date();

  if (record.blockedUntil && record.blockedUntil.getTime() > now.getTime()) {
    return {
      blocked: true,
      retryAfterSeconds: secondsUntil(record.blockedUntil),
    };
  }

  const windowStartedAt = new Date(
    now.getTime() - ATTEMPT_WINDOW_MINUTES * 60 * 1000,
  );

  /*
   * Clear expired blocks and old attempt counters.
   */
  if (
    record.blockedUntil ||
    record.lastAttemptAt.getTime() < windowStartedAt.getTime()
  ) {
    await prisma.loginAttempt.update({
      where: {
        ipAddress,
      },
      data: {
        attempts: 0,
        blockedUntil: null,
        lastAttemptAt: now,
      },
    });
  }

  return {
    blocked: false,
  };
}

export async function recordLoginFailure(
  ipAddress: string,
): Promise<BlockResult> {
  const existingRecord = await prisma.loginAttempt.findUnique({
    where: {
      ipAddress,
    },
  });

  const now = new Date();
  const windowStartedAt = new Date(
    now.getTime() - ATTEMPT_WINDOW_MINUTES * 60 * 1000,
  );

  let nextAttempts = 1;

  if (
    existingRecord &&
    existingRecord.lastAttemptAt.getTime() >= windowStartedAt.getTime()
  ) {
    nextAttempts = existingRecord.attempts + 1;
  }

  /*
   * The sixth failed attempt exceeds the permitted five attempts.
   */
  const shouldBlock = nextAttempts > MAX_FAILED_ATTEMPTS;

  const blockedUntil = shouldBlock
    ? minutesFromNow(BLOCK_DURATION_MINUTES)
    : null;

  await prisma.loginAttempt.upsert({
    where: {
      ipAddress,
    },
    update: {
      attempts: nextAttempts,
      lastAttemptAt: now,
      blockedUntil,
    },
    create: {
      ipAddress,
      attempts: nextAttempts,
      lastAttemptAt: now,
      blockedUntil,
    },
  });

  if (blockedUntil) {
    return {
      blocked: true,
      retryAfterSeconds: secondsUntil(blockedUntil),
    };
  }

  return {
    blocked: false,
  };
}

export async function clearLoginFailures(ipAddress: string): Promise<void> {
  await prisma.loginAttempt.deleteMany({
    where: {
      ipAddress,
    },
  });
}
