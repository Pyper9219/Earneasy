import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connect";
import { User, IUser } from "@/lib/db/models/User";
import InviteLinkCard from "@/components/dashboard/InviteLinkCard";

type InviteUser = Pick<IUser, "_id" | "referralCode">;

export default async function InvitePage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/login");

  await connectDB();
  const user = await User.findById(session.userId)
    .select("referralCode")
    .lean<InviteUser | null>();

  const host = headers().get("host") ?? "localhost:3000";
  const proto = process.env.NODE_ENV === "production" ? "https" : "http";
  const link = `${proto}://${host}/r/${user?.referralCode}`;

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Invite & Earn</h1>
        <p className="text-slate-500 mt-1">
          Share your unique link. You earn when they pay.
        </p>
      </header>

      <InviteLinkCard code={user?.referralCode ?? ""} link={link} />

      <div className="bg-white rounded-2xl border p-6 text-sm text-slate-600 space-y-2">
        <p className="font-semibold text-slate-900">How it works</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Level 1 (direct): KES 250</li>
          <li>Level 2: KES 100</li>
          <li>Level 3: KES 50</li>
        </ul>
      </div>
    </div>
  );
}