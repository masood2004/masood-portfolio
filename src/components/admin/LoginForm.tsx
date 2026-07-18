"use client";

import Script from "next/script";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  loginSchema,
  type LoginFormData,
} from "@/lib/validations/admin";

declare global {
  interface Window {
    grecaptcha?: {
      ready(callback: () => void): void;

      execute(
        siteKey: string,
        options: {
          action: string;
        },
      ): Promise<string>;
    };
  }
}

const RECAPTCHA_ACTION = "admin_login";

export default function LoginForm() {
  const router = useRouter();

  const [serverError, setServerError] = useState("");
  const [recaptchaReady, setRecaptchaReady] =
    useState(false);
  const [recaptchaLoadFailed, setRecaptchaLoadFailed] =
    useState(false);
  const [blockedSeconds, setBlockedSeconds] =
    useState(0);

  const siteKey =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function createRecaptchaToken(): Promise<string> {
    if (!siteKey) {
      throw new Error(
        "Human verification is not configured.",
      );
    }

    if (!window.grecaptcha || !recaptchaReady) {
      throw new Error(
        "Human verification is still loading. Please try again.",
      );
    }

    return new Promise((resolve, reject) => {
      window.grecaptcha?.ready(() => {
        window.grecaptcha
          ?.execute(siteKey, {
            action: RECAPTCHA_ACTION,
          })
          .then(resolve)
          .catch(() => {
            reject(
              new Error(
                "Human verification failed to start.",
              ),
            );
          });
      });
    });
  }

  async function onSubmit(data: LoginFormData) {
    setServerError("");

    try {
      const recaptchaToken =
        await createRecaptchaToken();

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          recaptchaToken,
        }),
      });

      const result: {
        success?: boolean;
        code?: string;
        message?: string;
        retryAfterSeconds?: number;
      } = await response.json();

      if (!response.ok) {
        if (
          result.code === "TOO_MANY_ATTEMPTS" &&
          result.retryAfterSeconds
        ) {
          setBlockedSeconds(
            result.retryAfterSeconds,
          );
        }

        throw new Error(
          result.message || "Login was unsuccessful.",
        );
      }

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
    }
  }

  const inputClasses =
    "mt-2 w-full border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-neutral-400";

  const loginDisabled =
    isSubmitting ||
    !recaptchaReady ||
    recaptchaLoadFailed ||
    blockedSeconds > 0;

  return (
    <>
      {siteKey && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(
            siteKey,
          )}`}
          strategy="afterInteractive"
          onLoad={() => {
            setRecaptchaReady(true);
            setRecaptchaLoadFailed(false);
          }}
          onError={() => {
            setRecaptchaReady(false);
            setRecaptchaLoadFailed(true);
          }}
        />
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-busy={isSubmitting}
        className="w-full max-w-md border border-neutral-800 bg-neutral-900/50 p-7"
      >
        <h1 className="text-3xl font-bold text-white">
          Admin login
        </h1>

        <p className="mt-3 text-sm leading-6 text-neutral-400">
          Sign in with the Admin account created by the
          seed script.
        </p>

        <div className="mt-7">
          <label
            htmlFor="email"
            className="text-sm text-neutral-300"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className={inputClasses}
          />

          {errors.email && (
            <p className="mt-2 text-xs text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mt-5">
          <label
            htmlFor="password"
            className="text-sm text-neutral-300"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className={inputClasses}
          />

          {errors.password && (
            <p className="mt-2 text-xs text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loginDisabled}
          className="mt-7 w-full bg-white px-5 py-3 font-bold text-neutral-950 transition hover:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Verifying..."
            : blockedSeconds > 0
              ? "Login temporarily blocked"
              : !recaptchaReady
                ? "Loading verification..."
                : "Sign in"}
        </button>

        {recaptchaLoadFailed && (
          <p
            role="alert"
            className="mt-5 border border-red-900 bg-red-950/30 p-3 text-sm text-red-300"
          >
            Human verification could not be loaded. Please
            refresh the page and try again.
          </p>
        )}

        {serverError && (
          <p
            role="alert"
            aria-live="assertive"
            className="mt-5 border border-red-900 bg-red-950/30 p-3 text-sm text-red-300"
          >
            {serverError}
          </p>
        )}

        <p className="mt-5 text-xs leading-5 text-neutral-600">
          This login is protected by Google reCAPTCHA and
          IP-based request limiting.
        </p>
      </form>
    </>
  );
}