import React from "react";
import { Link } from "react-router-dom";
import { useLearningDashboard } from "../../hooks/useLearning";

const cardClass =
  "rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)]";

export default function ReviewCenter() {
  const { data, isLoading, error } = useLearningDashboard();

  if (isLoading) return <div className="p-6 text-slate-600">Loading review center...</div>;
  if (error || !data) return <div className="p-6 text-red-600">Unable to load review center.</div>;

  const { reviewCenter } = data;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_60%,_#fff7ed_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[30px] border border-slate-900 bg-slate-900 px-6 py-8 text-white">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Review Center</div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Weak clusters, retries, and decaying concepts in one place</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            This is the habit surface. It centralizes the topics most likely to block readiness if ignored.
          </p>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-slate-900">Retry queue</h2>
            <div className="mt-4 space-y-3">
              {(reviewCenter?.retryQueue || []).map((item) => (
                <Link key={item.id} to={`/career/plan/topics/${item.topicId}`} className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-400">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{item.topicTitle}</div>
                      <div className="mt-1 text-sm text-slate-600">{item.skillName}</div>
                    </div>
                    <div className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-800">
                      {item.score}%
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(item.weakAreas || []).slice(0, 3).map((area) => (
                      <span key={area} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                        {area}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-slate-900">Weak topic clusters</h2>
            <div className="mt-4 space-y-3">
              {(reviewCenter?.weakTopics || []).map((topic) => (
                <Link key={topic.topicId} to={`/career/plan/topics/${topic.topicId}`} className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-400">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{topic.title}</div>
                      <div className="mt-1 text-sm text-slate-600">{topic.skillName}</div>
                    </div>
                    <div className="text-sm font-semibold text-slate-700">{topic.latestScore != null ? `${topic.latestScore}%` : "No proof"}</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(topic.weakAreas || []).slice(0, 3).map((area) => (
                      <span key={area} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                        {area}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-slate-900">Upcoming assessments</h2>
            <div className="mt-4 space-y-3">
              {(reviewCenter?.upcomingAssessments || []).map((item) => (
                <Link key={item.topicId} to={`/career/plan/topics/${item.topicId}`} className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-400">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="mt-1 text-sm text-slate-600">{item.skillName}</div>
                    </div>
                    <div className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-800">
                      {item.estimatedHours}h
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{item.objective || "Open this topic and convert it into a proof attempt."}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-slate-900">Decay-risk concepts</h2>
            <div className="mt-4 space-y-3">
              {(reviewCenter?.decayRiskTopics || []).map((item) => (
                <div key={item.topicId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="mt-1 text-sm text-slate-600">{item.skillName}</div>
                    </div>
                    <div className="text-sm font-semibold text-slate-700">{item.daysSinceReview}d stale</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    {item.latestScore != null ? `Last recorded score ${item.latestScore}%.` : "No recent assessment score available."}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
