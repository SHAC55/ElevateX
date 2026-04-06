import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useSkill,
  useSkillInsights,
  useTopic,
  useUpsertTopicStatus,
} from "../../hooks/useLearning";
import TopicMasteryModal from "../../Components/Learning/TopicMasteryModal";

const safeParse = (value) => {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const progressBar = (value, tone = "from-cyan-400 via-sky-500 to-orange-400") => (
  <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80">
    <div
      className={`h-full rounded-full bg-gradient-to-r ${tone}`}
      style={{ width: `${Math.max(0, Math.min(100, value || 0))}%` }}
    />
  </div>
);

const cardClass =
  "rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)]";

export default function TopicStudyPage() {
  const { topicId } = useParams();
  const [openMastery, setOpenMastery] = useState(false);

  const { data: topic, isLoading: loadingTopic, error: topicError, refetch: refetchTopic } = useTopic(topicId);
  const skillId = topic?.skillId ? String(topic.skillId) : "";
  const { data: skill, refetch: refetchSkill } = useSkill(skillId, { enabled: !!skillId });
  const { data: insights, refetch: refetchInsights } = useSkillInsights(skillId, { enabled: !!skillId });
  const { mutate: upsertTopicStatus, isPending: updatingTopic } = useUpsertTopicStatus();

  const enrichedTopic = useMemo(() => {
    if (!topic) return null;
    const parsed = safeParse(topic.content);
    const stats = (insights?.topicStats || []).find((item) => String(item.id) === String(topic._id));
    const studyGuide = insights?.studyGuide && String(insights.studyGuide.topicId) === String(topic._id)
      ? insights.studyGuide
      : null;

    return {
      ...topic,
      title: topic.title || parsed.title || "Untitled topic",
      objectives: parsed.objectives || [],
      estimatedHours: parsed.estimated_hours || 0,
      summary:
        studyGuide?.summary ||
        parsed.summary ||
        `This topic is part of ${skill?.name || "the current skill"} and should be turned into practical evidence, not just passive reading.`,
      progress: stats?.progress ?? topic.progress ?? 0,
      status: stats?.status ?? topic.status ?? "not_started",
      attempts: stats?.attempts ?? 0,
      latestScore: stats?.latestScore ?? null,
      weakAreas: studyGuide?.commonMistakes || stats?.weakAreas || [],
      keyConcepts: studyGuide?.keyConcepts || parsed.objectives || [],
      miniExercises: studyGuide?.miniExercises || [
        ...(parsed.objectives || []).slice(0, 2).map((objective) => `Explain and demonstrate: ${objective}`),
        `Write one realistic use case for ${topic.title || "this topic"}.`,
      ],
      commonMistakes: studyGuide?.commonMistakes || [],
    };
  }, [topic, insights, skill]);

  const handleStartTopic = () => {
    if (!enrichedTopic || !skillId) return;
    upsertTopicStatus(
      {
        topicId: enrichedTopic._id,
        skillId,
        status: enrichedTopic.status === "not_started" ? "in_progress" : enrichedTopic.status,
        progress: enrichedTopic.status === "not_started" ? 15 : enrichedTopic.progress || 20,
      },
      {
        onSuccess: () => {
          refetchTopic();
          refetchSkill();
          refetchInsights();
        },
      },
    );
  };

  if (loadingTopic) return <div className="p-6 text-slate-600">Loading topic study page...</div>;
  if (topicError || !topic) return <div className="p-6 text-rose-600">Unable to load this topic.</div>;
  if (!enrichedTopic) return <div className="p-6 text-rose-600">Unable to build the study context for this topic.</div>;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.14),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#e2e8f0_50%,_#fff7ed_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-700">
            <Link to="/career/plan/skills" className="transition hover:text-slate-950">← Skills</Link>
            {skillId ? <Link to={`/career/plan/skills/${skillId}`} className="transition hover:text-slate-950">Back to skill</Link> : null}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleStartTopic}
              disabled={updatingTopic}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {enrichedTopic.status === "not_started" ? "Mark topic started" : "Refresh topic state"}
            </button>
            <button
              type="button"
              onClick={() => setOpenMastery(true)}
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
            >
              Open mastery check
            </button>
          </div>
        </div>

        <section className="overflow-hidden rounded-[36px] border border-slate-950 bg-[#07111f] px-6 py-7 text-white shadow-[0_30px_120px_rgba(2,6,23,0.45)]">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">Dedicated Topic Study</div>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{enrichedTopic.title}</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{enrichedTopic.summary}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
                  {skill?.name || "Skill"}
                </div>
                <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
                  {enrichedTopic.estimatedHours ? `${enrichedTopic.estimatedHours}h block` : "Short block"}
                </div>
                <div className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  enrichedTopic.status === "completed"
                    ? "bg-emerald-500 text-white"
                    : enrichedTopic.status === "in_progress"
                      ? "bg-amber-300 text-slate-950"
                      : "bg-white text-slate-950"
                }`}>
                  {enrichedTopic.status.replace("_", " ")}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/12 bg-white/8 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">Progress</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight text-white">{enrichedTopic.progress}%</div>
              </div>
              <div className="rounded-[24px] border border-white/12 bg-white/8 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">Latest score</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight text-white">{enrichedTopic.latestScore != null ? `${enrichedTopic.latestScore}%` : "None"}</div>
              </div>
              <div className="rounded-[24px] border border-white/12 bg-white/8 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">Attempts</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight text-white">{enrichedTopic.attempts}</div>
              </div>
              <div className="rounded-[24px] border border-white/12 bg-white/8 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">Mastery lane</div>
                <div className="mt-3 text-sm leading-7 text-slate-300">Study the concept, practice it once, then prove it immediately.</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className={cardClass}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">1. Study</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Key concepts and objective framing</h2>
            <div className="mt-5 space-y-3">
              {(enrichedTopic.keyConcepts || []).slice(0, 5).map((concept) => (
                <div key={concept} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {concept}
                </div>
              ))}
            </div>
            {enrichedTopic.objectives?.length ? (
              <div className="mt-5">
                <div className="text-sm font-semibold text-slate-950">Objectives</div>
                <div className="mt-3 space-y-2">
                  {enrichedTopic.objectives.map((objective) => (
                    <div key={objective} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                      {objective}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <section className={cardClass}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">2. Practice</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Mini exercises before proof</h2>
            <div className="mt-5 space-y-3">
              {(enrichedTopic.miniExercises || []).slice(0, 4).map((exercise) => (
                <div key={exercise} className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-slate-700">
                  {exercise}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="text-sm font-semibold text-slate-950">Common mistakes</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(enrichedTopic.commonMistakes || enrichedTopic.weakAreas || []).slice(0, 5).map((item) => (
                  <span key={item} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-800">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm font-semibold text-slate-950">Tracked progress</div>
              <div className="mt-3">{progressBar(enrichedTopic.progress || 0)}</div>
              <div className="mt-2 text-sm text-slate-600">{enrichedTopic.progress}% mastery tracked</div>
            </div>
          </section>
        </div>

        <section className={cardClass}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">3. Prove</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Take the mastery check when the concept is active in memory</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                This page is intentionally narrow: learn the topic, stress it once, then convert it into evidence immediately.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpenMastery(true)}
              className="rounded-full bg-gradient-to-r from-cyan-500 to-orange-400 px-5 py-3 text-sm font-semibold text-slate-950"
            >
              Prove this topic
            </button>
          </div>
        </section>
      </div>

      <TopicMasteryModal
        topic={enrichedTopic}
        open={openMastery}
        onClose={() => setOpenMastery(false)}
        onPassed={() => {
          refetchTopic();
          refetchSkill();
          refetchInsights();
        }}
      />
    </div>
  );
}
