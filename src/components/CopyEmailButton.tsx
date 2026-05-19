"use client";

import { useState } from "react";

type CopyEmailButtonProps = {
  email: string;
};

export default function CopyEmailButton({ email }: CopyEmailButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded border border-neutral-700 px-4 py-2 text-sm text-neutral-200 transition hover:border-neutral-500 hover:text-white"
      aria-live="polite"
    >
      {isCopied ? "Email copied" : "Copy email"}
    </button>
  );
}
