"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type AdminSidebarProps = {
  name: string;
  email: string;
};

// Strictly type the links array so Next.js knows these are valid routes
const links: { href: Route; label: string }[] = [
  {
    href: "/admin",
    label: "Dashboard",
  },
  {
    href: "/admin/contacts",
    label: "Contact queries",
  },
];

export default function AdminSidebar({ name, email }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <aside className="flex min-h-screen w-full flex-col border-r border-neutral-800 bg-neutral-950 p-6 md:w-72">
      <div>
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          Portfolio administration
        </p>

        <p className="mt-4 font-bold text-white">{name}</p>
        <p className="mt-1 break-all text-xs text-neutral-500">{email}</p>
      </div>

      <nav className="mt-10 space-y-2">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block border px-4 py-3 text-sm transition ${
                active
                  ? "border-neutral-500 bg-neutral-800 text-white"
                  : "border-transparent text-neutral-400 hover:border-neutral-800 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-10">
        <Link
          href="/"
          className="block text-sm text-neutral-400 hover:text-white"
        >
          View portfolio
        </Link>

        <button
          type="button"
          onClick={logout}
          disabled={isLoggingOut}
          className="mt-5 w-full border border-neutral-700 px-4 py-3 text-left text-sm text-neutral-300 transition hover:border-neutral-500 hover:text-white disabled:opacity-50"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}
