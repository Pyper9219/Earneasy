import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import ReferralTreeGraph from "@/components/dashboard/ReferralTreeGraph";
import type { ReferralNode } from "@/types/referral";

async function fetchTree(userId: string, cookieHeader: string) {
  const base =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/referrals/tree/${userId}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as { root: ReferralNode };
}

export default async function ReferralTreePage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/login");

  const cookieHeader = `session=${token}`;
  const data = await fetchTree(session.userId, cookieHeader);

  if (!data) {
    return <p className="text-slate-500">Unable to load your referral tree.</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Referral Tree</h1>
        <p className="text-slate-500 mt-1">
          Visualize your 3-level downline.
        </p>
      </header>
      <div className="bg-white rounded-2xl border p-6">
        <ReferralTreeGraph root={data.root} />
      </div>
    </div>
  );
}