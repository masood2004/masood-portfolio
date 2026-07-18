import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-neutral-950 font-mono text-neutral-300 md:flex">
      <AdminSidebar name={admin.name} email={admin.email} />

      <main className="min-w-0 flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
