"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginFormData } from "@/lib/validations/admin";

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setServerError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: {
        success?: boolean;
        message?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login was unsuccessful.");
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-busy={isSubmitting}
      className="w-full max-w-md border border-neutral-800 bg-neutral-900/50 p-7"
    >
      <h1 className="text-3xl font-bold text-white">Admin login</h1>

      <p className="mt-3 text-sm leading-6 text-neutral-400">
        Sign in with the Admin account created by the seed script.
      </p>

      <div className="mt-7">
        <label htmlFor="email" className="text-sm text-neutral-300">
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
          <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="mt-5">
        <label htmlFor="password" className="text-sm text-neutral-300">
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
          <p className="mt-2 text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-7 w-full bg-white px-5 py-3 font-bold text-neutral-950 transition hover:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      {serverError && (
        <p
          role="alert"
          className="mt-5 border border-red-900 bg-red-950/30 p-3 text-sm text-red-300"
        >
          {serverError}
        </p>
      )}
    </form>
  );
}
