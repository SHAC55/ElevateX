import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  useRegenerateSkillAIContent,
  useSkill,
  useSkillAIContent,
  useSkillInsights,
  useStartSkillFlow,
  useTopics,
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

const fmtDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "No signal yet";

const toneClasses = {
  on_track: "bg-emerald-100 text-emerald-800 border-emerald-200",
  at_risk: "bg-amber-100 text-amber-800 border-amber-200",
  no_deadline: "bg-sky-100 text-sky-800 border-sky-200",
  insufficient_data: "bg-slate-100 text-slate-700 border-slate-200",
};

const forecastLabel = {
  on_track: "On track",
  at_risk: "At risk",
  no_deadline: "No deadline",
  insufficient_data: "Need more data",
};

function StatCard({ label, value, detail }) {
  return (
    <div className="rounded-[24px] border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</div>
      <div className="mt-2 text-sm text-slate-300">{detail}</div>
    </div>
  );
}

function SectionShell({ eyebrow, title, children, action }) {
  return (
    <section className="rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{eyebrow}</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function SkillDetailPage() {
  const { skillId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTopic, setActiveTopic] = useState(null);
  const [guidedTopicId, setGuidedTopicId] = useState("");
  const didPrimeSessionRef = useRef(false);

  const { data: skill, isLoading: loadingSkill, error: skillError, refetch: refetchSkill } = useSkill(skillId);
  const { data: insights, isLoading: loadingInsights, refetch: refetchInsights } = useSkillInsights(skillId);
  const { data: aiMaterial, isLoading: loadingAI, error: aiError } = useSkillAIContent(skillId);
  const { data: topicsResp, isLoading: loadingTopics, refetch: refetchTopics } = useTopics({ skillId }, { enabled: !!skillId });
  const { mutate: startSkillFlow, isPending: startingSkill, data: startedFlow } = useStartSkillFlow(skillId);
  const { mutate: upsertTopicStatus } = useUpsertTopicStatus();
  const { mutateAsync: regenerateAI, isPending: regeneratingAI } = useRegenerateSkillAIContent(skillId);

  const topics = useMemo(() => {
    const raw = Array.isArray(topicsResp) ? topicsResp : topicsResp?.items || [];
    const topicStatsMap = new Map((insights?.topicStats || []).map((item) => [String(item.id), item]));

    return raw
      .filter((topic) => String(topic.skillId) === String(skillId))
      .map((topic) => {
        const parsed = safeParse(topic.content);
        const stats = topicStatsMap.get(String(topic._id));
        return {
          ...topic,
          name: topic.title || parsed.title || "Untitled topic",
          objectives: parsed.objectives || [],
          estimated_hours: parsed.estimated_hours || 0,
          summary: parsed.summary || "",
          progress: stats?.progress ?? topic.progress ?? 0,
          status: stats?.status ?? topic.status ?? "not_started",
          latestScore: stats?.latestScore ?? null,
          attempts: stats?.attempts ?? 0,
          weakAreas: stats?.weakAreas ?? [],
          lastAttemptedAt: stats?.lastAttemptedAt ?? null,
        };
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [topicsResp, skillId, insights]);

  const material = aiMaterial?.material?.studyMaterialJson || aiMaterial?.material?.json || null;
  const nextTopic = topics.find((topic) => topic.status !== "completed") || null;
  const overallProgress = insights?.skill?.progress ?? skill?.progress ?? 0;
  const analytics = insights?.analytics || {};
  const recentAttempts = insights?.recentAttempts || [];
  const weakTopicClusters = insights?.weakTopicClusters || [];
  const momentum = insights?.momentum || [];
  const recommendations = insights?.recommendations || [];
  const studyGuide = insights?.studyGuide || null;
  const proofLinkage = insights?.proofLinkage || null;
  const sessionStarted = searchParams.get("session") === "started";
  const requestedTopicId = searchParams.get("topic");

  useEffect(() => {
    if (!topics.length) return;

    const matchedTopic = requestedTopicId
      ? topics.find((topic) => String(topic._id) === String(requestedTopicId))
      : null;

    setGuidedTopicId((current) => {
      if (matchedTopic) return String(matchedTopic._id);
      if (current && topics.some((topic) => String(topic._id) === String(current))) return current;
      if (nextTopic?._id) return String(nextTopic._id);
      return String(topics[0]?._id || "");
    });
  }, [topics, requestedTopicId, nextTopic]);

  const guidedTopic = topics.find((topic) => String(topic._id) === String(guidedTopicId)) || nextTopic || topics[0] || null;
  const guidedTopicIndex = guidedTopic ? topics.findIndex((topic) => String(topic._id) === String(guidedTopic._id)) : -1;
  const studyConcepts = (material?.concepts || []).slice(0, 3);
  const practicePrompts = [
    ...(studyGuide?.miniExercises || []).slice(0, 2),
    ...(guidedTopic?.objectives || []).slice(0, 2).map((objective) => `Explain or demonstrate: ${objective}`),
    ...(studyGuide?.commonMistakes || []).slice(0, 2).map((mistake) => `Avoid this mistake while practicing: ${mistake}`),
    ...(material?.pitfalls || []).slice(0, 2).map((pitfall) => `Avoid this mistake while practicing: ${pitfall}`),
  ].slice(0, 4);

  useEffect(() => {
    if (!sessionStarted || !guidedTopic || didPrimeSessionRef.current) return;
    if (guidedTopic.status !== "not_started") {
      didPrimeSessionRef.current = true;
      return;
    }

    didPrimeSessionRef.current = true;
    handleStartTopic(guidedTopic);
  }, [sessionStarted, guidedTopic]);

  const handleStartTopic = (topic) => {
    upsertTopicStatus(
      {
        topicId: topic._id,
        skillId,
        status: topic.status === "not_started" ? "in_progress" : topic.status,
        progress: topic.status === "not_started" ? 15 : topic.progress || 20,
      },
      {
        onSuccess: () => {
          refetchTopics();
          refetchSkill();
          refetchInsights();
        },
      },
    );
  };

  const handleRegenerateAI = async () => {
    await regenerateAI();
    refetchSkill();
  };

  const handleStartSkill = () => {
    startSkillFlow(
      skillId,
      {
        onSuccess: () => {
          refetchSkill();
          refetchTopics();
          refetchInsights();
        },
      },
    );
  };

  if (loadingSkill) return <div className="p-6 text-slate-600">Loading skill cockpit...</div>;
  if (skillError || !skill) return <div className="p-6 text-rose-600">Unable to load this skill.</div>;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.16),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#e2e8f0_45%,_#fff7ed_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/career/plan/skills" className="text-sm font-semibold text-slate-700 transition hover:text-slate-950">
            ← Back to skill command
          </Link>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                refetchSkill();
                refetchTopics();
                refetchInsights();
              }}
              className="rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Refresh telemetry
            </button>
            <button
              onClick={handleRegenerateAI}
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
            >
              {regeneratingAI ? "Rebuilding AI brief..." : "Rebuild AI brief"}
            </button>
          </div>
        </div>

        <section className="overflow-hidden rounded-[36px] border border-slate-950 bg-[#07111f] px-6 py-7 text-white shadow-[0_30px_120px_rgba(2,6,23,0.45)]">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">Premium Skill Cockpit</div>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{skill.name}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                This page now acts like an execution layer, not a content page. It tracks mastery evidence, predicts readiness, surfaces weak-topic clusters, and shows the next highest-leverage move.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${toneClasses[analytics.readinessForecast] || toneClasses.insufficient_data}`}>
                  {forecastLabel[analytics.readinessForecast] || "Need more data"}
                </div>
                <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
                  {skill.difficulty.replace("_", " ")}
                </div>
                <button
                  type="button"
                  onClick={handleStartSkill}
                  disabled={startingSkill || skill.status === "completed"}
                  className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {skill.status === "in_progress" ? "Skill started" : skill.status === "completed" ? "Skill completed" : "Start skill now"}
                </button>
              </div>
              {startedFlow ? (
                <div className="mt-4 rounded-[22px] border border-white/10 bg-white/8 p-4 text-sm text-slate-200">
                  Started successfully. Flow prepared {startedFlow.flow?.generatedTopics ?? 0} new topics, {startedFlow.flow?.generatedAssessments ?? 0} new assessments,
                  {" "}and {startedFlow.flow?.generatedSkillBrief ? "generated" : "reused"} the AI brief.
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard label="Mastery" value={`${overallProgress}%`} detail={`${insights?.skill?.completedTopics ?? 0}/${insights?.skill?.topicCount ?? topics.length} topics complete`} />
              <StatCard label="Pass Rate" value={`${analytics.passRate ?? 0}%`} detail={`${analytics.attemptCount ?? 0} mastery attempts logged`} />
              <StatCard label="Velocity" value={analytics.weeklyAttemptVelocity ?? 0} detail="attempts in the last 7 days" />
              <StatCard
                label="Forecast"
                value={analytics.predictedReadyInDays != null ? `${analytics.predictedReadyInDays}d` : "TBD"}
                detail={
                  analytics.daysRemainingToGoal != null
                    ? `${analytics.daysRemainingToGoal} days left to goal window`
                    : "set a timeline to unlock deadline forecasting"
                }
              />
            </div>
          </div>
        </section>

        {guidedTopic ? (
          <SectionShell
            eyebrow={sessionStarted ? "First Session Flow" : "Guided Session"}
            title={sessionStarted ? "You already have a next move" : "Study, practice, then prove"}
            action={
              <button
                type="button"
                onClick={() => {
                  setActiveTopic(guidedTopic);
                  if (sessionStarted) {
                    const nextParams = new URLSearchParams(searchParams);
                    nextParams.delete("session");
                    setSearchParams(nextParams, { replace: true });
                  }
                }}
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
              >
                Open mastery check
              </button>
            }
          >
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <div className="rounded-[26px] border border-slate-200 bg-slate-950 p-5 text-white">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                    {sessionStarted ? "Session primed" : "Current focus"}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-950">
                      Topic {guidedTopicIndex + 1}
                    </div>
                    <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
                      {guidedTopic.estimated_hours ? `${guidedTopic.estimated_hours}h block` : "Short block"}
                    </div>
                  </div>
                  <h3 className="mt-4 text-3xl font-semibold tracking-tight">{guidedTopic.name}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                    {(studyGuide?.summary && String(studyGuide.topicId) === String(guidedTopic._id))
                      ? studyGuide.summary
                      : sessionStarted
                      ? "The first topic has been selected for you so the skill starts with momentum instead of another navigation choice."
                      : "Use this lane when you want the fastest path from reading material to evidence."}
                  </p>
                  <div className="mt-5">{progressBar(guidedTopic.progress || 0, "from-cyan-300 via-sky-400 to-orange-300")}</div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
                    <span>{guidedTopic.progress || 0}% tracked</span>
                    <span>{guidedTopic.attempts || 0} mastery attempts</span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">1. Study</div>
                    <div className="mt-3 text-lg font-semibold text-slate-950">Know what matters</div>
                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      {(studyGuide?.keyConcepts || []).slice(0, 2).map((concept) => (
                        <div key={concept} className="rounded-2xl bg-cyan-50 px-3 py-2">
                          {concept}
                        </div>
                      ))}
                      {(guidedTopic.objectives || []).slice(0, 3).map((objective) => (
                        <div key={objective} className="rounded-2xl bg-slate-50 px-3 py-2">
                          {objective}
                        </div>
                      ))}
                      {!guidedTopic.objectives?.length ? (
                        <div className="rounded-2xl bg-slate-50 px-3 py-2">
                          Start by understanding the topic framing and the core vocabulary in the AI brief.
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">2. Practice</div>
                    <div className="mt-3 text-lg font-semibold text-slate-950">Stress the concept</div>
                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      {practicePrompts.length ? practicePrompts.map((prompt) => (
                        <div key={prompt} className="rounded-2xl bg-amber-50 px-3 py-2 text-slate-700">
                          {prompt}
                        </div>
                      )) : (
                        <div className="rounded-2xl bg-amber-50 px-3 py-2 text-slate-700">
                          Turn the topic into one short explanation and one practical example before taking the check.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">3. Prove</div>
                    <div className="mt-3 text-lg font-semibold text-slate-950">Lock evidence</div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Submit the mastery check once you can explain the topic without looking at notes. Passing moves this topic to completed and feeds the readiness forecast.
                    </p>
                    {(studyGuide?.commonMistakes || []).length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {studyGuide.commonMistakes.slice(0, 3).map((mistake) => (
                          <span key={mistake} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-800">
                            {mistake}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setActiveTopic(guidedTopic)}
                      className="mt-4 rounded-full bg-gradient-to-r from-cyan-500 to-orange-400 px-4 py-2 text-sm font-semibold text-slate-950"
                    >
                      Prove this topic
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-950">Skill brief cues for this session</div>
                  <div className="mt-3 space-y-3">
                    {studyConcepts.length ? studyConcepts.map((concept) => (
                      <div key={concept.term} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="font-semibold text-slate-950">{concept.term}</div>
                        <div className="mt-2 text-sm text-slate-600">{concept.definition}</div>
                      </div>
                    )) : (
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                        Rebuild the AI brief if you want richer study cues here.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-950">Session controls</div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleStartTopic(guidedTopic)}
                      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      {guidedTopic.status === "not_started" ? "Mark topic started" : "Refresh topic state"}
                    </button>
                    {sessionStarted ? (
                      <button
                        type="button"
                        onClick={() => {
                          const nextParams = new URLSearchParams(searchParams);
                          nextParams.delete("session");
                          setSearchParams(nextParams, { replace: true });
                        }}
                        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                      >
                        Dismiss first-session mode
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </SectionShell>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <SectionShell
            eyebrow="Execution Radar"
            title="Momentum, weak clusters, and next actions"
            action={
              nextTopic ? (
                <button
                  onClick={() => handleStartTopic(nextTopic)}
                  className="rounded-full bg-gradient-to-r from-cyan-500 to-orange-400 px-4 py-2 text-sm font-semibold text-slate-950"
                >
                  Continue {nextTopic.name}
                </button>
              ) : null
            }
          >
            <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="space-y-4">
                <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-950">Readiness forecast</div>
                  <div className="mt-3 text-sm leading-7 text-slate-600">
                    {analytics.predictedReadyInDays == null
                      ? "There is not enough repeated assessment data yet. Once the user does a few mastery attempts, this page starts forecasting skill readiness instead of only showing completion."
                      : `At the current pace, this skill should be ready in about ${analytics.predictedReadyInDays} days. The current score floor is ${analytics.averageScore ?? 0}% and the cadence is ${analytics.weeklyAttemptVelocity ?? 0} attempts per week.`}
                  </div>
                </div>

                <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-950">Recommended next moves</div>
                  <div className="mt-3 space-y-3">
                    {recommendations.map((item) => (
                      <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-950">14-day momentum</div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Attempts / Avg score</div>
                  </div>
                  <div className="mt-4 flex h-44 items-end gap-2">
                    {(momentum.length ? momentum : Array.from({ length: 14 }).map((_, index) => ({ date: index, attempts: 0, averageScore: 0 }))).map((day) => (
                      <div key={day.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                        <div className="flex h-32 w-full items-end">
                          <div
                            className="w-full rounded-t-[16px] bg-gradient-to-t from-cyan-500 via-sky-500 to-orange-300"
                            style={{ height: `${Math.max(10, (day.attempts || 0) * 22)}px` }}
                          />
                        </div>
                        <div className="text-[10px] font-medium text-slate-500">{String(day.date).slice(5)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-950">Weak-topic clusters</div>
                  <div className="mt-3 space-y-3">
                    {weakTopicClusters.length ? (
                      weakTopicClusters.map((topic) => (
                        <div key={topic.topicId} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="font-semibold text-slate-950">{topic.title}</div>
                              <div className="mt-1 text-sm text-slate-600">
                                {topic.latestScore != null ? `${topic.latestScore}% latest score` : "No completed assessment yet"}
                              </div>
                            </div>
                            <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
                              {topic.attempts} attempts
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(topic.weakAreas || []).slice(0, 3).map((area) => (
                              <span key={area} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                        No weak cluster yet. As attempts come in, this section will isolate the concepts blocking readiness.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SectionShell>

          <SectionShell eyebrow="AI Learning Brief" title="Why this skill matters and how to attack it">
            {loadingAI ? (
              <div className="text-slate-600">Generating study material...</div>
            ) : aiError ? (
              <div className="text-rose-600">Failed to load AI material.</div>
            ) : material ? (
              <div className="space-y-6">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <div className="text-sm font-semibold text-slate-950">Strategic brief</div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{material.whatWhy}</p>
                </div>

                <div className="grid gap-4">
                  {(material.concepts || []).slice(0, 6).map((concept) => (
                    <div key={concept.term} className="rounded-[24px] border border-slate-200 bg-white p-4">
                      <div className="font-semibold text-slate-950">{concept.term}</div>
                      <div className="mt-2 text-sm leading-7 text-slate-600">{concept.definition}</div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-semibold text-slate-950">Execution steps</div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      {(material.steps || []).map((step, index) => (
                        <li key={index}>{index + 1}. {step}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-semibold text-slate-950">Failure modes</div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      {(material.pitfalls || []).map((pitfall, index) => (
                        <li key={index}>• {pitfall}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-600">No AI brief available yet.</div>
            )}
          </SectionShell>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <SectionShell eyebrow="Topic Lane" title="Learn, apply, prove, and close the gap">
            <div className="space-y-4">
              {loadingTopics || loadingInsights ? (
                <div className="text-slate-600">Loading topics...</div>
              ) : topics.map((topic, index) => {
                const isNext = nextTopic?._id === topic._id;
                const isGuided = guidedTopic ? String(guidedTopic._id) === String(topic._id) : false;
                return (
                  <div
                    key={topic._id}
                    className={`rounded-[28px] border p-5 transition ${
                      isNext
                        ? "border-slate-950 bg-slate-950 text-white shadow-[0_24px_80px_rgba(2,6,23,0.22)]"
                        : "border-slate-200 bg-slate-50 text-slate-950"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`grid h-12 w-12 place-items-center rounded-full text-sm font-semibold ${isNext ? "bg-white text-slate-950" : "bg-slate-950 text-white"}`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-xl font-semibold">{topic.name}</div>
                          <div className={`mt-1 text-sm ${isNext ? "text-slate-300" : "text-slate-600"}`}>
                            {topic.estimated_hours ? `${topic.estimated_hours}h estimated` : "Short study block"} • Last signal {fmtDate(topic.lastAttemptedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {isGuided ? (
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${isNext ? "bg-white text-slate-950" : "bg-cyan-100 text-cyan-800"}`}>
                            Guided now
                          </span>
                        ) : null}
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                          topic.status === "completed"
                            ? "bg-emerald-500 text-white"
                            : topic.status === "in_progress"
                              ? "bg-amber-300 text-slate-950"
                              : isNext
                                ? "bg-white text-slate-950"
                                : "bg-slate-950 text-white"
                        }`}>
                          {isNext && topic.status !== "completed" ? "Do next" : topic.status.replace("_", " ")}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isNext ? "bg-white/10 text-white" : "bg-white text-slate-700"}`}>
                          {topic.latestScore != null ? `${topic.latestScore}% latest` : "No proof yet"}
                        </span>
                      </div>
                    </div>

                    {topic.objectives?.length ? (
                      <div className={`mt-4 grid gap-2 sm:grid-cols-2 ${isNext ? "text-slate-200" : "text-slate-600"}`}>
                        {topic.objectives.slice(0, 4).map((objective, objectiveIndex) => (
                          <div key={objectiveIndex} className="rounded-2xl border border-current/10 px-3 py-2 text-sm">
                            {objective}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-4">{progressBar(topic.progress || 0, isNext ? "from-cyan-300 via-sky-400 to-orange-300" : "from-cyan-500 via-sky-500 to-orange-400")}</div>
                    <div className={`mt-2 flex flex-wrap items-center justify-between gap-3 text-sm ${isNext ? "text-slate-300" : "text-slate-600"}`}>
                      <span>{topic.progress || 0}% tracked progress</span>
                      <span>{topic.attempts || 0} mastery attempts</span>
                    </div>

                    {topic.weakAreas?.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {topic.weakAreas.slice(0, 3).map((area) => (
                          <span key={area} className={`rounded-full px-3 py-1 text-xs font-medium ${isNext ? "bg-white/10 text-white" : "bg-white text-slate-700"}`}>
                            {area}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleStartTopic(topic)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold ${isNext ? "border-white/25 text-white" : "border-slate-300 text-slate-700"}`}
                      >
                        {topic.status === "not_started" ? "Start topic" : "Resume topic"}
                      </button>
                      <Link
                        to={`/career/plan/topics/${topic._id}`}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold ${isNext ? "border-white/25 text-white" : "border-slate-300 bg-white text-slate-700"}`}
                      >
                        Open study page
                      </Link>
                      <button
                        onClick={() => setActiveTopic(topic)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${isNext ? "bg-white text-slate-950" : "bg-slate-950 text-white"}`}
                      >
                        Open mastery check
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionShell>

          <SectionShell eyebrow="Proof Ledger" title="Recent attempts and evidence quality">
            <div className="space-y-3">
              {recentAttempts.length ? (
                recentAttempts.map((attempt) => (
                  <div key={attempt.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-950">
                          {attempt.score}% {attempt.passed ? "pass" : "retry"}
                        </div>
                        <div className="mt-1 text-sm text-slate-600">{fmtDate(attempt.createdAt)}</div>
                      </div>
                      <div className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        attempt.passed ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {attempt.passed ? "Evidence locked" : "Gap detected"}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[...(attempt.weakAreas || []), ...(attempt.strengths || [])].slice(0, 3).map((area) => (
                        <span key={area} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                  No mastery attempts yet. The premium part of this feature starts once evidence exists: every submission becomes analyzable product signal for pacing, readiness, and concept-level weakness.
                </div>
              )}
            </div>
          </SectionShell>
        </div>

        {proofLinkage ? (
          <SectionShell eyebrow="Career Bridge" title="Map this skill to real-world proof">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-semibold text-slate-950">Portfolio artifact</div>
                <div className="mt-3 text-lg font-semibold text-slate-900">{proofLinkage.portfolioArtifact?.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{proofLinkage.portfolioArtifact?.description}</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-semibold text-slate-950">Resume bullet</div>
                <p className="mt-3 text-sm leading-7 text-slate-700">{proofLinkage.resumeBullet}</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-semibold text-slate-950">Interview talking point</div>
                <p className="mt-3 text-sm leading-7 text-slate-700">{proofLinkage.interviewTalkingPoint}</p>
              </div>
            </div>
          </SectionShell>
        ) : null}
      </div>

      <TopicMasteryModal
        topic={activeTopic}
        open={Boolean(activeTopic)}
        onClose={() => setActiveTopic(null)}
        onPassed={() => {
          refetchTopics();
          refetchSkill();
          refetchInsights();
        }}
      />
    </div>
  );
}
