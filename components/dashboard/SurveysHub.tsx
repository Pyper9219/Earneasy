"use client";

import { useMemo, useState } from "react";
import { Clock, Filter, Star } from "lucide-react";

interface SurveyItem {
  id: string;
  title: string;
  category: string;
  partnerName: string;
  rewardKES: number;
  estMinutes: number;
  slotsRemaining: number;
  isHighDemand: boolean;
}

const FILTERS = ["All", "High Paying", "Quick"] as const;
type SurveyFilter = (typeof FILTERS)[number];

export default function SurveysHub({
  surveys,
  totalSurveyEarnings,
}: {
  surveys: SurveyItem[];
  totalSurveyEarnings: number | null;
}) {
  const [filter, setFilter] = useState<SurveyFilter>("All");
  const filteredSurveys = useMemo(
    () =>
      surveys.filter((survey) => {
        if (filter === "High Paying") return survey.isHighDemand;
        if (filter === "Quick") return survey.estMinutes <= 5;
        return true;
      }),
    [filter, surveys]
  );

  return (
    <>
      <section
        className={`mb-8 grid gap-4 ${
          totalSurveyEarnings === null ? "grid-cols-1" : "md:grid-cols-2"
        }`}
      >
        {totalSurveyEarnings !== null && (
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 p-6">
            <p className="mb-1 text-sm font-medium text-emerald-400">
              Survey earnings to date
            </p>
            <p className="text-3xl font-extrabold">
              KES {totalSurveyEarnings}
            </p>
          </div>
        )}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="mb-1 text-sm font-medium text-slate-400">
            Surveys currently available
          </p>
          <p className="text-3xl font-extrabold">{surveys.length}</p>
        </div>
      </section>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              filter === item
                ? "bg-emerald-500 text-white"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {item === "High Paying" && (
              <Star className="mr-1 inline h-3 w-3" />
            )}
            {item === "Quick" && (
              <Clock className="mr-1 inline h-3 w-3" />
            )}
            {item === "All" && <Filter className="mr-1 inline h-3 w-3" />}
            {item}
          </button>
        ))}
      </div>

      {filteredSurveys.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
          No surveys match this filter right now.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSurveys.map((survey) => (
            <article
              key={survey.id}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-emerald-500/50"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-bold uppercase text-emerald-400">
                  {survey.category}
                </span>
                {survey.isHighDemand && (
                  <Star
                    aria-label="High demand"
                    className="h-5 w-5 fill-amber-400 text-amber-400"
                  />
                )}
              </div>
              <h2 className="mb-1 text-lg font-bold transition-colors group-hover:text-emerald-400">
                {survey.title}
              </h2>
              <p className="mb-4 text-sm text-slate-400">
                Partner: {survey.partnerName}
              </p>
              <div className="mb-6 flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {survey.estMinutes} mins
                </span>
                <span>{survey.slotsRemaining} spots left</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-2xl font-extrabold text-emerald-400">
                  KES {survey.rewardKES}
                </span>
                <button
                  type="button"
                  disabled
                  title="A survey questionnaire has not been configured."
                  className="cursor-not-allowed rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-300"
                >
                  Not ready
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                The survey questionnaire is not available yet.
              </p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
