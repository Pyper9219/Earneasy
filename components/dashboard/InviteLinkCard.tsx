"use client";

import { useState } from "react";

export default function InviteLinkCard({
  code,
  link,
}: {
  code: string;
  link: string;
}) {
  const [copied, setCopied] = useState<"link" | "code" | null>(null);

  async function copy(value: string, kind: "link" | "code") {
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  }

  const shareText = `Join EarnEasy and start earning! Use my link: ${link}`;

  return (
    <div className="bg-white rounded-2xl border p-6 space-y-5">
      <div>
        <label className="text-sm text-slate-500">Your referral code</label>
        <div className="mt-1 flex items-center gap-2">
          <code className="flex-1 px-3 py-2 bg-slate-100 rounded-lg font-mono text-sm">
            {code}
          </code>
          <button
            onClick={() => copy(code, "code")}
            className="px-3 py-2 text-sm rounded-lg border hover:bg-slate-50"
          >
            {copied === "code" ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm text-slate-500">Your invite link</label>
        <div className="mt-1 flex items-center gap-2">
          <input
            readOnly
            value={link}
            className="flex-1 px-3 py-2 bg-slate-100 rounded-lg text-sm"
          />
          <button
            onClick={() => copy(link, "link")}
            className="px-3 py-2 text-sm rounded-lg border hover:bg-slate-50"
          >
            {copied === "link" ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600"
        >
          Share on WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 text-sm rounded-lg bg-sky-500 text-white hover:bg-sky-600"
        >
          Share on X
        </a>
      </div>
    </div>
  );
}