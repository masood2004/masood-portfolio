import { redirect } from "next/navigation";

import LoginForm from "@/components/admin/LoginForm";
import { getCurrentAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-4xl items-center justify-center px-8 py-16">
      <LoginForm />
    </main>
  );
}
