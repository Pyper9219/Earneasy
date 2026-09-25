"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-500">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const refFromUrl = params.get("ref") || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    ref: refFromUrl,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Read cookie-based ref if URL param absent
  useEffect(() => {
    if (!refFromUrl) {
      const match = document.cookie.match(/(?:^|;\s*)earneasy_ref=([^;]+)/);
      if (match) setForm((f) => ({ ...f, ref: decodeURIComponent(match[1]) }));
    }
  }, [refFromUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="text-sm text-slate-500">
        Join EarnEasy and start earning today.
      </p>

      {form.ref && (
        <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm">
          🎉 You were invited with code <strong>{form.ref}</strong>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <Field
        label="Full name"
        value={form.name}
        onChange={(v) => setForm({ ...form, name: v })}
        required
      />
      <Field
        label="Email"
        type="email"
        value={form.email}
        onChange={(v) => setForm({ ...form, email: v })}
        required
      />
      <Field
        label="Phone (optional)"
        value={form.phone}
        onChange={(v) => setForm({ ...form, phone: v })}
      />
      <Field
        label="Password"
        type="password"
        value={form.password}
        onChange={(v) => setForm({ ...form, password: v })}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-sm text-center text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-600 font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  );
}