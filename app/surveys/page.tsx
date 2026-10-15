import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import SurveysHub from "@/components/dashboard/SurveysHub";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connect";
import { User, IUser } from "@/lib/db/models/User";
import { Survey } from "@/lib/models/Survey";

export const dynamic = "force-dynamic";

type SurveyHubUser = Pick<
  IUser,
  "hasPaid" | "isActivated" | "totalSurveyEarnings"
>;

export default async function SurveysPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = token ? verifySessionToken(token) : null;
  if (!session) redirect("/login");

  await connectDB();
  const user = await User.findById(session.userId)
    .select("hasPaid isActivated totalSurveyEarnings")
    .lean<SurveyHubUser | null>();
  if (!user) redirect("/login");

  if (!user.hasPaid && !user.isActivated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0B1326] p-4 text-white">
        <section className="w-full max-w-md rounded-2xl border border-amber-500/30 bg-white/5 p-8 text-center">
          <h1 className="mb-2 text-2xl font-bold">Account Not Activated</h1>
          <p className="mb-6 text-slate-400">
            Complete the KES 450 activation payment to unlock available surveys.
          </p>
          <Link
            href="/dashboard"
            className="inline-block rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 font-bold text-white transition-all hover:brightness-110"
          >
            Go to dashboard
          </Link>
        </section>
      </main>
    );
  }

  const surveys = await Survey.find({
    isActive: true,
    slotsRemaining: { $gt: 0 },
  })
    .sort({ rewardKES: -1 })
    .lean();

  return (
    <main className="min-h-screen bg-[#0B1326] p-4 text-white md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium text-emerald-400">
            EarnEasy surveys
          </p>
          <h1 className="text-3xl font-extrabold md:text-4xl">
            Daily Paid Surveys
          </h1>
          <p className="mt-2 text-slate-400">
            Browse surveys currently available for your account.
          </p>
        </header>

        <SurveysHub
          surveys={surveys.map((survey) => ({
            id: String(survey._id),
            title: survey.title,
            category: survey.category,
            partnerName: survey.partnerName,
            rewardKES: survey.rewardKES,
            estMinutes: survey.estMinutes,
            slotsRemaining: survey.slotsRemaining,
            isHighDemand: Boolean(survey.isHighDemand),
          }))}
          totalSurveyEarnings={user.totalSurveyEarnings ?? 0}
        />
      </div>
    </main>
  );
}
