import ContactStatusSelect from "@/components/admin/ContactStatusSelect";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import type { ContactStatusValue } from "@/lib/validations/admin";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  await requireAdmin();

  const contacts = await prisma.contact.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-neutral-500">
        Contact management
      </p>

      <h1 className="mt-3 text-3xl font-bold text-white">Contact queries</h1>

      <p className="mt-3 text-sm text-neutral-400">
        Review every portfolio enquiry and update its current status.
      </p>

      {contacts.length === 0 ? (
        <div className="mt-9 border border-neutral-800 p-7 text-neutral-500">
          No contact enquiries have been received.
        </div>
      ) : (
        <div className="mt-9 overflow-x-auto border border-neutral-800">
          <table className="min-w-[1100px] w-full border-collapse text-left">
            <thead className="bg-neutral-900">
              <tr className="border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500">
                <th className="p-4">Sender</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Message</th>
                <th className="p-4">Received</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b border-neutral-800 align-top"
                >
                  <td className="p-4">
                    <p className="font-bold text-white">{contact.name}</p>

                    <a
                      href={`mailto:${contact.email}`}
                      className="mt-2 block text-sm text-neutral-400 hover:text-white"
                    >
                      {contact.email}
                    </a>

                    {contact.phone && (
                      <p className="mt-1 text-xs text-neutral-500">
                        {contact.phone}
                      </p>
                    )}
                  </td>

                  <td className="max-w-52 p-4 text-sm text-neutral-300">
                    {contact.subject || "No subject"}
                  </td>

                  <td className="max-w-md whitespace-pre-wrap p-4 text-sm leading-6 text-neutral-400">
                    {contact.message}
                  </td>

                  <td className="p-4 text-xs text-neutral-500">
                    {contact.createdAt.toLocaleString("en-PK")}
                  </td>

                  <td className="p-4">
                    <ContactStatusSelect
                      contactId={contact.id}
                      initialStatus={contact.status as ContactStatusValue}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
