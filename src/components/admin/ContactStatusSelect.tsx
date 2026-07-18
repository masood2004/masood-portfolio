"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  contactStatuses,
  type ContactStatusValue,
} from "@/lib/validations/admin";

type ContactStatusSelectProps = {
  contactId: string;
  initialStatus: ContactStatusValue;
};

const labels: Record<ContactStatusValue, string> = {
  PENDING: "Pending",
  DONE: "Done",
  COMPLETED: "Completed",
  RESOLVED: "Resolved",
};

export default function ContactStatusSelect({
  contactId,
  initialStatus,
}: ContactStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState<ContactStatusValue>(initialStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function updateStatus(nextStatus: ContactStatusValue) {
    const previousStatus = status;

    setStatus(nextStatus);
    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/admin/contacts/${contactId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      const result: {
        success?: boolean;
        message?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Status update failed.");
      }

      router.refresh();
    } catch (error) {
      setStatus(previousStatus);

      setErrorMessage(
        error instanceof Error ? error.message : "Status update failed.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <select
        value={status}
        disabled={isSaving}
        onChange={(event) => {
          void updateStatus(event.target.value as ContactStatusValue);
        }}
        className="border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-neutral-400 disabled:opacity-60"
      >
        {contactStatuses.map((contactStatus) => (
          <option key={contactStatus} value={contactStatus}>
            {labels[contactStatus]}
          </option>
        ))}
      </select>

      {isSaving && <p className="mt-2 text-xs text-neutral-500">Saving...</p>}

      {errorMessage && (
        <p className="mt-2 max-w-44 text-xs text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}
