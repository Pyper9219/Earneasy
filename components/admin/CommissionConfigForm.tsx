"use client";

import { useState } from "react";
import type { CommissionConfigShape } from "@/types/commission";

export default function CommissionConfigForm({
  initial,
}: {
  initial: CommissionConfigShape;
}) {
  const [config, setConfig] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const sum = config.level1 + config.level2 + config.level3;
  const mismatch = sum !== config.totalPrice;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch("/api/admin/commission-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border p-6 space-y-5"
    >
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <NumberField
        label="Level 1 payout (KES)"
        value={config.level1}
        onChange={(v) => setConfig({ ...config, level1: v })}
      />
      <NumberField
        label="Level 2 payout (KES)"
        value={config.level2}
        onChange={(v) => setConfig({ ...config, level2: v })}
      />
      <NumberField
        label="Level 3 payout (KES)"
        value={config.level3}
        onChange={(v) => setConfig({ ...config, level3: v })}
      />
      <NumberField
        label="Client payment price (KES)"
        value={config.totalPrice}
        onChange={(v) => setConfig({ ...config, totalPrice: v })}
      />

      <div
        className={`p-3 rounded-lg text-sm ${
          mismatch
            ? "bg-amber-50 text-amber-700"
            : "bg-emerald-50 text-emerald-700"
        }`}
      >
        Levels sum: <strong>KES {sum}</strong> · Total price:{" "}
        <strong>KES {config.totalPrice}</strong>
        {mismatch && " — levels do not add up to the total price."}
      </div>

      <button
        type="submit"
        disabled={status === "saving"}
        className="w-full py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
      >
        {status === "saving"
          ? "Saving..."
          : status === "saved"
            ? "Saved ✓"
            : "Save configuration"}
      </button>
    </form>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 border rounded-lg"
      />
    </div>
  );
}