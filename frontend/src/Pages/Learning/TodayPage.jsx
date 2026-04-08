import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Compass,
  FolderKanban,
  GraduationCap,
  MessageSquareQuote,
  Target,
  TrendingUp,
} from "lucide-react";
import { getInterviewAnalytics } from "../../api/interviewSession";
import { useLearningDashboard } from "../../hooks/useLearning";
import ProductHeader from "../../Components/ui/ProductHeader";

const cardClass =
  "rounded-[28px] border border-[#eadfce] bg-white/92 p-5 shadow-[0_24px_70px_rgba(89,60,27,0.08)]";

const ActionCard = ({ eyebrow, title, body, cta, to, icon, tone = "default", meta }) => {
  const toneMap = {
    default: "from-[#fff8ef] to-white border-[#eadfce]",
    sky: "from-sky-50 to-white border-sky-200",
    amber: "from-amber-50 to-white border-amber-200",
    emerald: "from-emerald-50 to-white border-emerald-200",
    rose: "from-rose-50 to-white border-rose-200",
  };

  return (
    <Link
      to={to}
      className={`group rounded-[28px] border bg-gradient-to-br p-5 transition hover:-translate-y-0.5 ${toneMap[tone] || toneMap.default}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1f160f] text-white">
          {icon}
        </div>
        {meta ? (
          <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a6550]">
            {meta}
          </div>
        ) : null}
      </div>

      <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8e775c]">
        {eyebrow}
      </div>
      <h2 className="mt-2 text-2xl font-semibold text-[#1f160f]">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[#6b5844]">{body}</p>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1f160f]">
        {cta}
        <ArrowRight size={15} className="transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
};

const SimplePanel = ({ eyebrow, title, children, action }) => (
  <section className={cardClass}>
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8e775c]">
          {eyebrow}
        </div>
        <h2 className="mt-2 text-2xl font-semibold text-[#1f160f]">{title}</h2>
      </div>
      {action}
    </div>
    <div className="mt-5">{children}</div>
  </section>
);

const TodayPage = () => {
  const { data, isLoading, error } = useLearningDashboard();
  const interviewQuery = useQuery({
    queryKey: ["interview-analytics"],
    queryFn: getInterviewAnalytics,
    staleTime: 60_000,
  });

  const interviewAnalytics = interviewQuery.data?.analytics;

  const todayDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }).format(new Date()),
    [],
  );

  if (isLoading) {
    return <div className="p-6 text-[#6b5844]">Loading today&apos;s workspace...</div>;
  }

  if (error || !data) {
    return <div className="p-6 text-red-600">Unable to load today&apos;s workspace.</div>;
  }

  const { summary, counts, focusSkills, reviewCenter, projectQueue, weeklyPlan, nudges, completionSignals } = data;

  const nextSkill = focusSkills?.[0];
  const reviewTask =
    reviewCenter?.retryQueue?.[0] ||
    reviewCenter?.weakTopics?.[0] ||
    reviewCenter?.decayRiskTopics?.[0] ||
    null;
  const projectTask = projectQueue?.[0] || null;

  const interviewTask = interviewAnalytics?.totalSessions
    ? {
        title: `Raise your mock interview signal`,
        body:
          interviewAnalytics?.recentSessions?.[0]?.improvementAreas?.[0] ||
          `Current trend is ${String(interviewAnalytics?.trend || "stable").replaceAll("_", " ")}. Run another session and improve one repeated weakness.`,
        meta: `${interviewAnalytics.averageOverallScore || 0} avg`,
      }
    : {
        title: "Create your first interview baseline",
        body: "You do not have any completed mock interviews yet. Run one session to unlock coaching and trend data.",
        meta: "No baseline",
      };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.1),_transparent_20%),linear-gradient(180deg,_#fffaf2_0%,_#f3e7d2_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <ProductHeader
          eyebrow={
            <>
              <CalendarDays size={14} />
              Today
            </>
          }
          title="What needs your attention today."
          description={`Use this page as the daily operating view for ${todayDate}. It compresses learning, review, project work, and interview practice into one clear plan.`}
          stats={[
            {
              label: "Readiness",
              value: summary?.readinessScore ?? 0,
              detail: "Composite signal of where you stand right now.",
            },
            {
              label: "Current Progress",
              value: `${summary?.currentProgress ?? 0}%`,
              detail: "Average tracked skill completion.",
            },
            {
              label: "In Progress",
              value: counts?.inProgressSkills ?? 0,
              detail: `${counts?.completedSkills ?? 0} completed skills so far.`,
            },
            {
              label: "Streak",
              value: completionSignals?.streakDays ?? 0,
              detail: "Days of consecutive learning activity.",
            },
          ]}
          actions={[
            {
              label: "Open skills",
              to: "/career/plan/skills",
              icon: <GraduationCap size={16} />,
            },
            {
              label: "Open full plan",
              to: "/career/plan",
              icon: <Compass size={16} />,
              variant: "secondary",
            },
          ]}
        />

        <section className="grid gap-4 xl:grid-cols-4">
          <ActionCard
            eyebrow="Learn"
            title={nextSkill?.name || "Choose a skill to start"}
            body={
              nextSkill
                ? `${nextSkill.moduleTitle} • ${nextSkill.progress}% complete • ${nextSkill.topicCompletionRate}% topic completion.`
                : "Pick one skill that matches your target role and start building momentum."
            }
            cta="Go to skill"
            to={nextSkill ? `/career/plan/skills/${nextSkill.id}` : "/career/plan/skills"}
            icon={<GraduationCap size={18} />}
            tone="sky"
            meta={nextSkill?.status?.replaceAll("_", " ") || "Next move"}
          />

          <ActionCard
            eyebrow="Review"
            title={reviewTask?.topicTitle || reviewTask?.title || "Review a weak concept"}
            body={
              reviewTask
                ? reviewTask.weakAreas?.[0] || reviewTask.objective || `${reviewTask.skillName} needs another pass before the concept decays.`
                : "Use the review center to revisit low-score or stale concepts."
            }
            cta="Open review"
            to={reviewTask?.topicId ? `/career/plan/topics/${reviewTask.topicId}` : "/career/plan/review"}
            icon={<BookOpen size={18} />}
            tone="amber"
            meta={reviewTask?.score != null ? `${reviewTask.score}%` : reviewTask?.daysSinceReview ? `${reviewTask.daysSinceReview}d stale` : "Practice"}
          />

          <ActionCard
            eyebrow="Build"
            title={projectTask?.name || "Ship one proof asset"}
            body={
              projectTask
                ? projectTask.expectedOutcome || projectTask.description
                : "Open the project queue and choose one artifact that turns learning into proof."
            }
            cta="Open projects"
            to="/career/plan/projects"
            icon={<FolderKanban size={18} />}
            tone="emerald"
            meta={projectTask?.submitted ? "Submitted" : projectTask?.difficulty || "Project"}
          />

          <ActionCard
            eyebrow="Practice"
            title={interviewTask.title}
            body={interviewTask.body}
            cta="Run interview"
            to="/mock-interview"
            icon={<MessageSquareQuote size={18} />}
            tone="rose"
            meta={interviewTask.meta}
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <SimplePanel
            eyebrow="Weekly Priorities"
            title="What this week should optimize for"
            action={
              <Link to="/career/plan/overview" className="text-sm font-semibold text-[#1f160f]">
                Open overview
              </Link>
            }
          >
            <div className="space-y-3">
              {(weeklyPlan?.priorities || []).length ? (
                weeklyPlan.priorities.map((item) => (
                  <div key={item.skillId} className="rounded-[22px] border border-[#eadfce] bg-[#fff8ef] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-[#1f160f]">{item.skillName}</div>
                      <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a6550]">
                        {item.hoursNeeded}h
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[#6b5844]">{item.reason}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-[#e2d3be] bg-[#fffaf4] p-5 text-sm text-[#6b5844]">
                  No weekly priorities are available yet.
                </div>
              )}
            </div>
          </SimplePanel>

          <SimplePanel
            eyebrow="Signals"
            title="Momentum and nudges"
            action={
              <Link to="/career/plan/progress" className="text-sm font-semibold text-[#1f160f]">
                Open progress
              </Link>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[22px] border border-[#eadfce] bg-[#fff8ef] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8e775c]">Weekly Score</div>
                <div className="mt-2 text-3xl font-semibold text-[#1f160f]">
                  {completionSignals?.weeklySkillScore ?? 0}
                </div>
                <div className="mt-2 text-sm text-[#6b5844]">Your current output signal for the week.</div>
              </div>
              <div className="rounded-[22px] border border-[#eadfce] bg-[#fff8ef] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8e775c]">Proof Unlocked</div>
                <div className="mt-2 text-3xl font-semibold text-[#1f160f]">
                  {completionSignals?.masteryMilestones?.proofUnlocked ?? 0}
                </div>
                <div className="mt-2 text-sm text-[#6b5844]">Milestones that can turn into portfolio proof.</div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {(nudges || []).length ? (
                nudges.map((nudge) => (
                  <div key={nudge.id} className="rounded-[22px] border border-[#eadfce] bg-white p-4">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8e775c]">
                      <TrendingUp size={14} />
                      Nudge
                    </div>
                    <div className="mt-2 font-semibold text-[#1f160f]">{nudge.title}</div>
                    <p className="mt-2 text-sm leading-7 text-[#6b5844]">{nudge.message}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-[#e2d3be] bg-[#fffaf4] p-5 text-sm text-[#6b5844]">
                  No nudges right now. Keep compounding the daily loop.
                </div>
              )}
            </div>
          </SimplePanel>
        </div>

        <SimplePanel
          eyebrow="Today Rules"
          title="How to use this page well"
          action={
            <Link to="/career/plan/review" className="text-sm font-semibold text-[#1f160f]">
              Open review center
            </Link>
          }
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-[22px] border border-[#eadfce] bg-[#fff8ef] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1f160f]">
                <Target size={16} />
                One learning move
              </div>
              <p className="mt-3 text-sm leading-7 text-[#6b5844]">
                Pick one skill and create visible progress instead of hopping between modules.
              </p>
            </div>
            <div className="rounded-[22px] border border-[#eadfce] bg-[#fff8ef] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1f160f]">
                <CheckCircle2 size={16} />
                One review move
              </div>
              <p className="mt-3 text-sm leading-7 text-[#6b5844]">
                Revisit one weak concept before it becomes stale and drags your readiness down.
              </p>
            </div>
            <div className="rounded-[22px] border border-[#eadfce] bg-[#fff8ef] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1f160f]">
                <MessageSquareQuote size={16} />
                One conversion move
              </div>
              <p className="mt-3 text-sm leading-7 text-[#6b5844]">
                Either build one proof asset or run one interview session so the system keeps producing signals.
              </p>
            </div>
          </div>
        </SimplePanel>
      </div>
    </div>
  );
};

export default TodayPage;
