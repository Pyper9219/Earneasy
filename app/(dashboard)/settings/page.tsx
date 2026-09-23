import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";

export default async function SettingsPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/login");

  await connectDB();
  const user = await User.findById(session.userId)
    .select("name email phone referralCode hasPaid createdAt")
    .lean();

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-500 mt-1">Your account details.</p>
      </header>

      <div className="bg-white rounded-2xl border divide-y">
        <Row label="Name" value={user?.name ?? ""} />
        <Row label="Email" value={user?.email ?? ""} />
        <Row label="Phone" value={user?.phone ?? "—"} />
        <Row label="Referral Code" value={user?.referralCode ?? ""} mono />
        <Row
          label="Account Status"
          value={user?.hasPaid ? "Active (paid)" : "Unpaid"}
        />
        <Row
          label="Member Since"
          value={
            user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "—"
          }
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-medium ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}