import Link from "next/link";

import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [totalContacts, pendingContacts, resolvedContacts, recentContacts] =
    await prisma.$transaction([
      prisma.contact.count(),

      prisma.contact.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.contact.count({
        where: {
          status: {
            in: ["DONE", "COMPLETED", "RESOLVED"],
          },
        },
      }),

      prisma.contact.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

  const statistics = [
    {
      label: "Total contacts",
      value: totalContacts,
    },
    {
      label: "Pending queries",
      value: pendingContacts,
    },
    {
      label: "Resolved / completed",
      value: resolvedContacts,
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Administration
          </p>

          <h1 className="mt-3 text-3xl font-bold text-white">Dashboard</h1>
        </div>

        <Link
          href="/admin/contacts"
          className="border border-neutral-700 px-4 py-3 text-sm text-neutral-300 hover:border-neutral-500 hover:text-white"
        >
          View all queries
        </Link>
      </div>

      <div className="mt-9 grid gap-5 md:grid-cols-3">
        {statistics.map((statistic) => (
          <article
            key={statistic.label}
            className="border border-neutral-800 bg-neutral-900/40 p-6"
          >
            <p className="text-sm text-neutral-500">{statistic.label}</p>

            <p className="mt-4 text-4xl font-bold text-white">
              {statistic.value}
            </p>
          </article>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-5 flex items-center gap-4">
          <h2 className="text-lg uppercase tracking-widest text-white">
            Recent contacts
          </h2>

          <div className="h-px flex-grow bg-neutral-800" />
        </div>

        {recentContacts.length === 0 ? (
          <p className="border border-neutral-800 p-6 text-neutral-500">
            No contact enquiries have been received yet.
          </p>
        ) : (
          <div className="space-y-3">
            {recentContacts.map((contact) => (
              <article
                key={contact.id}
                className="flex flex-col justify-between gap-4 border border-neutral-800 bg-neutral-900/30 p-5 md:flex-row md:items-center"
              >
                <div>
                  <p className="font-bold text-white">{contact.name}</p>

                  <p className="mt-1 text-sm text-neutral-500">
                    {contact.subject || "No subject"} · {contact.email}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-xs uppercase tracking-wider text-neutral-400">
                    {contact.status}
                  </p>

                  <p className="mt-1 text-xs text-neutral-600">
                    {contact.createdAt.toLocaleString("en-PK")}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
