import "server-only";

const RECAPTCHA_ACTION = "admin_login";

type RecaptchaApiResponse = {
  success?: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
};

type RecaptchaVerificationResult =
  | {
      success: true;
      score: number;
    }
  | {
      success: false;
      reason: string;
    };

function getAllowedHostnames(): string[] {
  return (process.env.RECAPTCHA_ALLOWED_HOSTNAMES ?? "")
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean);
}

function getScoreThreshold(): number {
  const configuredThreshold = Number(
    process.env.RECAPTCHA_SCORE_THRESHOLD ?? "0.5",
  );

  if (
    Number.isNaN(configuredThreshold) ||
    configuredThreshold < 0 ||
    configuredThreshold > 1
  ) {
    return 0.5;
  }

  return configuredThreshold;
}

export async function verifyRecaptchaToken(
  token: string,
  remoteIp: string,
): Promise<RecaptchaVerificationResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY?.trim();

  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is not configured.");

    return {
      success: false,
      reason: "configuration_error",
    };
  }

  const formData = new URLSearchParams({
    secret: secretKey,
    response: token,
    remoteip: remoteIp,
  });

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        success: false,
        reason: "verification_service_error",
      };
    }

    const result = (await response.json()) as RecaptchaApiResponse;

    if (!result.success) {
      console.warn("reCAPTCHA verification rejected:", {
        errorCodes: result["error-codes"],
      });

      return {
        success: false,
        reason: "invalid_token",
      };
    }

    if (result.action !== RECAPTCHA_ACTION) {
      console.warn("Unexpected reCAPTCHA action:", {
        receivedAction: result.action,
      });

      return {
        success: false,
        reason: "action_mismatch",
      };
    }

    const score = result.score ?? 0;

    if (score < getScoreThreshold()) {
      console.warn("Low reCAPTCHA score:", {
        score,
      });

      return {
        success: false,
        reason: "low_score",
      };
    }

    const allowedHostnames = getAllowedHostnames();
    const responseHostname = result.hostname?.toLowerCase();

    if (
      allowedHostnames.length === 0 ||
      !responseHostname ||
      !allowedHostnames.includes(responseHostname)
    ) {
      console.warn("Unexpected reCAPTCHA hostname:", {
        hostname: result.hostname,
      });

      return {
        success: false,
        reason: "hostname_mismatch",
      };
    }

    return {
      success: true,
      score,
    };
  } catch (error) {
    console.error("reCAPTCHA verification request failed:", error);

    return {
      success: false,
      reason: "verification_request_failed",
    };
  }
}
