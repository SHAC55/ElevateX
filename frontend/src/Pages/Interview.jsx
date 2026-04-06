import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  completeInterviewSession,
  getInterviewAnalytics,
  getInterviewHistory,
  getInterviewProfile,
  getInterviewSession,
  startInterviewSession,
  submitInterviewAnswer,
} from "../api/interviewSession";

const ACTIVE_SESSION_KEY = "elevatex_active_interview_session";

const interviewTypes = [
  {
    value: "technical_screen",
    label: "Technical Screen",
    description: "Foundations, tradeoffs, production judgment.",
  },
  {
    value: "mixed",
    label: "Mixed",
    description: "Balanced technical and applied problem-solving.",
  },
  {
    value: "problem_solving",
    label: "Problem Solving",
    description: "More scenario-based reasoning and debugging.",
  },
];

const scorePalette = (score) => {
  if (score >= 85) {
    return {
      ring: "rgba(27, 176, 107, 0.24)",
      bg: "#ecfdf3",
      text: "#0f5132",
      fill: "#14b86f",
    };
  }

  if (score >= 70) {
    return {
      ring: "rgba(222, 142, 20, 0.24)",
      bg: "#fff7e8",
      text: "#8a4b08",
      fill: "#f2a93b",
    };
  }

  return {
    ring: "rgba(201, 63, 50, 0.24)",
    bg: "#fff1ee",
    text: "#8a2f24",
    fill: "#e06453",
  };
};

const initialsFromSkill = (skill = "") =>
  skill
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "EX";

const formatDate = (value) => {
  if (!value) return "In progress";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const progressPercent = (session) => {
  if (!session?.questionLimit) return 0;
  return Math.min(
    100,
    Math.round((session.currentQuestionIndex / session.questionLimit) * 100),
  );
};

const averageLiveScore = (session) => {
  const entries = session?.transcript || [];

  if (!entries.length) {
    return 0;
  }

  const total = entries.reduce(
    (sum, entry) => sum + (entry?.evaluation?.overallScore || 0),
    0,
  );

  return Math.round(total / entries.length);
};

const DashboardShell = ({ children }) => (
  <div
    className="h-full overflow-y-auto"
    style={{
      background:
        "radial-gradient(circle at top left, rgba(201, 89, 49, 0.12), transparent 22%), radial-gradient(circle at top right, rgba(12, 108, 242, 0.12), transparent 20%), linear-gradient(180deg, #f7f5ef 0%, #f1efe8 100%)",
    }}
  >
    <div className="mx-auto flex min-h-full w-full max-w-[1480px] flex-col gap-6 px-4 pb-8 pt-6 md:px-6">
      {children}
    </div>
  </div>
);

const SectionCard = ({ className = "", children, style = {} }) => (
  <section
    className={`rounded-[28px] border border-black/5 bg-white/90 shadow-[0_20px_60px_rgba(68,53,33,0.08)] backdrop-blur ${className}`}
    style={style}
  >
    {children}
  </section>
);

const MetricTile = ({ label, value, detail, tone = "neutral" }) => {
  const tones = {
    neutral: { bg: "#f5f1e8", text: "#2c241c", accent: "#9f8d72" },
    warm: { bg: "#fff1e7", text: "#6f3511", accent: "#d97706" },
    cool: { bg: "#eaf4ff", text: "#12385b", accent: "#2563eb" },
    green: { bg: "#ebfbf4", text: "#134733", accent: "#16a34a" },
  };

  const palette = tones[tone] || tones.neutral;

  return (
    <div
      className="rounded-[22px] p-4"
      style={{ backgroundColor: palette.bg, color: palette.text }}
    >
      <div
        className="text-[11px] uppercase tracking-[0.24em]"
        style={{ color: palette.accent }}
      >
        {label}
      </div>
      <div className="mt-3 text-3xl font-semibold">{value}</div>
      {detail ? <p className="mt-2 text-sm text-black/55">{detail}</p> : null}
    </div>
  );
};

const ScoreBar = ({ label, score }) => {
  const palette = scorePalette(score);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[#3d3429]">{label}</span>
        <span className="font-semibold" style={{ color: palette.text }}>
          {score}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#ece6db]">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ backgroundColor: palette.fill }}
        />
      </div>
    </div>
  );
};

const SessionHistoryBars = ({ sessions }) => {
  if (!sessions?.length) {
    return (
      <div className="rounded-[22px] border border-dashed border-[#d8cfbf] bg-[#faf7f1] p-4 text-sm text-[#6b5d49]">
        Completed interviews will appear here with score trend bars.
      </div>
    );
  }

  const maxScore = Math.max(...sessions.map((session) => session.overallScore || 0), 100);

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <div key={session.id} className="rounded-[20px] bg-[#f7f3eb] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-[#2f281f]">
                {session.targetRole}
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#86745b]">
                {formatDate(session.completedAt)}
              </div>
            </div>
            <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1d3d72]">
              {session.overallScore}
            </div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(12, ((session.overallScore || 0) / maxScore) * 100)}%`,
                background:
                  "linear-gradient(90deg, #d66b39 0%, #f0b449 50%, #2f77da 100%)",
              }}
            />
          </div>
          {session.improvementAreas?.length ? (
            <p className="mt-3 text-sm text-[#6a5d4b]">
              Focus next: {session.improvementAreas[0]}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
};

const ScoreBadge = ({ score, className = "" }) => {
  const palette = scorePalette(score);

  return (
    <div
      className={className}
      style={{
        backgroundColor: palette.bg,
        color: palette.text,
        boxShadow: `inset 0 0 0 1px ${palette.ring}`,
      }}
    >
      {score}
    </div>
  );
};

const CompactTranscriptList = ({ transcript }) => {
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!transcript?.length) {
      setExpandedId(null);
      return;
    }

    const latestEntry = transcript[transcript.length - 1];
    setExpandedId(latestEntry.questionId);
  }, [transcript]);

  if (!transcript?.length) {
    return (
      <div className="rounded-[20px] border border-dashed border-[#ddcfbe] bg-[#fbf8f2] p-5 text-sm text-[#6f634f]">
        Your evaluated answers will appear here after each question.
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-[#eadfce] bg-[#fcfaf6] p-3">
      <div className="mb-3 rounded-[18px] bg-[#f3ede4] px-4 py-3 text-xs uppercase tracking-[0.18em] text-[#7f6e58]">
        New feedback opens automatically. Older answers stay compact unless you expand them.
      </div>
      <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
        {transcript
          .slice()
          .reverse()
          .map((entry) => {
            const expanded = expandedId === entry.questionId;
            const palette = scorePalette(entry.evaluation.overallScore);
            const isLatest = entry.questionId === transcript[transcript.length - 1]?.questionId;

            return (
              <div
                key={entry.questionId}
                className="rounded-[18px] border border-[#eadfce] bg-white p-4 transition"
                style={{
                  boxShadow: isLatest
                    ? "0 10px 30px rgba(210, 102, 56, 0.12)"
                    : "none",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#8c7a62]">
                      <span>Q{entry.order}</span>
                      <span>•</span>
                      <span>{entry.topic}</span>
                      <span>•</span>
                      <span>{entry.difficulty}</span>
                      {isLatest ? (
                        <>
                          <span>•</span>
                          <span className="rounded-full bg-[#fff0e6] px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-[#bf5f28]">
                            Latest
                          </span>
                        </>
                      ) : null}
                    </div>
                    <div className="mt-2 line-clamp-2 text-sm font-semibold text-[#2d251c]">
                      {entry.question}
                    </div>
                  </div>
                  <div
                    className="shrink-0 rounded-full px-3 py-1 text-sm font-semibold"
                    style={{
                      backgroundColor: palette.bg,
                      color: palette.text,
                      boxShadow: `inset 0 0 0 1px ${palette.ring}`,
                    }}
                  >
                    {entry.evaluation.overallScore}
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#655846]">
                  {entry.evaluation.feedback}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-[#8d7b63]">
                    Focus: {entry.evaluation.improvementAreas?.[0] || "Keep sharpening depth"}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId((current) =>
                        current === entry.questionId ? null : entry.questionId,
                      )
                    }
                    className="rounded-full border border-[#d8cab8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#5a4b39] transition hover:bg-[#f6efe5]"
                  >
                    {expanded ? "Hide details" : "View details"}
                  </button>
                </div>

                {expanded ? (
                  <div className="mt-4 space-y-4 rounded-[16px] bg-[#f7f2ea] p-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[14px] bg-white p-3">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-[#8f7b63]">
                          Technical
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-[#2f281f]">
                          {entry.evaluation.technicalAccuracy}
                        </div>
                      </div>
                      <div className="rounded-[14px] bg-white p-3">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-[#8f7b63]">
                          Problem Solving
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-[#2f281f]">
                          {entry.evaluation.problemSolving}
                        </div>
                      </div>
                      <div className="rounded-[14px] bg-white p-3">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-[#8f7b63]">
                          Communication
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-[#2f281f]">
                          {entry.evaluation.communication}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-[#8f7b63]">
                        Your answer
                      </div>
                      <p className="mt-2 max-h-28 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-[#5b4d3e]">
                        {entry.answer}
                      </p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.18em] text-[#8f7b63]">
                          Strengths
                        </div>
                        <ul className="mt-2 space-y-1 text-sm text-[#5b4d3e]">
                          {(entry.evaluation.strengths || []).map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.18em] text-[#8f7b63]">
                          Improve
                        </div>
                        <ul className="mt-2 space-y-1 text-sm text-[#5b4d3e]">
                          {(entry.evaluation.improvementAreas || []).map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {entry.evaluation.nextStepAdvice ? (
                      <div className="rounded-[14px] bg-white p-3 text-sm leading-6 text-[#5a4d3d]">
                        <span className="font-semibold">Coach note:</span>{" "}
                        {entry.evaluation.nextStepAdvice}
                      </div>
                    ) : null}
                    {entry.evaluation.idealAnswer ? (
                      <div className="rounded-[14px] border border-[#e8dccb] bg-[#fffdfa] p-3 text-sm leading-6 text-[#5a4d3d]">
                        <span className="font-semibold">What stronger looks like:</span>{" "}
                        {entry.evaluation.idealAnswer}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
      </div>
    </div>
  );
};

const TranscriptList = ({ transcript }) => {
  if (!transcript?.length) {
    return (
      <div className="rounded-[20px] border border-dashed border-[#ddcfbe] bg-[#fbf8f2] p-5 text-sm text-[#6f634f]">
        Your evaluated answers will appear here after each question.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transcript.map((entry) => (
        <div
          key={entry.questionId}
          className="rounded-[24px] border border-[#eadfce] bg-[#fcfaf6] p-5"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#8b7a62]">
            <span>Question {entry.order}</span>
            <span>•</span>
            <span>{entry.topic}</span>
            <span>•</span>
            <span>{entry.difficulty}</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-[#2d251c]">
            {entry.question}
          </h3>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#5e5140]">
            {entry.answer}
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-[140px_1fr]">
            <div
              className="rounded-[18px] p-4 text-center"
              style={{
                backgroundColor: scorePalette(entry.evaluation.overallScore).bg,
                color: scorePalette(entry.evaluation.overallScore).text,
                boxShadow: `inset 0 0 0 1px ${scorePalette(entry.evaluation.overallScore).ring}`,
              }}
            >
              <div className="text-xs uppercase tracking-[0.2em]">Score</div>
              <div className="mt-2 text-4xl font-semibold">
                {entry.evaluation.overallScore}
              </div>
            </div>
            <div className="rounded-[18px] bg-white p-4">
              <p className="text-sm leading-7 text-[#46392d]">
                {entry.evaluation.feedback}
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[#967e65]">
                    Strengths
                  </div>
                  <ul className="mt-2 space-y-2 text-sm text-[#5b4d3e]">
                    {(entry.evaluation.strengths || []).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[#967e65]">
                    Improve
                  </div>
                  <ul className="mt-2 space-y-2 text-sm text-[#5b4d3e]">
                    {(entry.evaluation.improvementAreas || []).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {entry.evaluation.nextStepAdvice ? (
                <div className="mt-4 rounded-[16px] bg-[#f5f1ea] p-4 text-sm text-[#584936]">
                  <span className="font-semibold">Coach note:</span>{" "}
                  {entry.evaluation.nextStepAdvice}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyCareerState = () => (
  <SectionCard className="overflow-hidden">
    <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="p-8 md:p-10">
        <div className="inline-flex rounded-full bg-[#fff3e6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#b15f1d]">
          Interview Setup Required
        </div>
        <h1 className="mt-6 max-w-[14ch] text-4xl font-semibold leading-tight text-[#20180f] md:text-5xl">
          Set your career target before starting mock interviews.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[#5d5145]">
          The interview engine now uses your saved role and skill profile to ask
          realistic technical questions, score your answers, and build analytics
          over time. Without a career goal, the interview will be generic and
          low-signal.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/career-form"
            className="rounded-full bg-[#cb6234] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b95327]"
          >
            Set Career Goal
          </Link>
          <Link
            to="/career-os"
            className="rounded-full border border-[#dacbb8] px-6 py-3 text-sm font-semibold text-[#4c3f31] transition hover:bg-[#f6f0e6]"
          >
            Review Career OS
          </Link>
        </div>
      </div>
      <div className="relative min-h-[320px] bg-[#f2ebe0] p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(215,110,57,0.22),transparent_28%),radial-gradient(circle_at_80%_24%,rgba(53,111,219,0.2),transparent_26%),linear-gradient(160deg,#f2ebe0_0%,#ece4d8_100%)]" />
        <div className="relative flex h-full flex-col justify-end gap-4">
          {[
            "Role-specific interviews, not generic chat.",
            "Per-question scoring with feedback and ideal answer direction.",
            "Session history and trend analytics for repeated practice.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[22px] bg-white/75 p-5 text-sm leading-7 text-[#473a2c] backdrop-blur"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  </SectionCard>
);

const Interview = () => {
  const queryClient = useQueryClient();
  const [draftAnswer, setDraftAnswer] = useState("");
  const [sessionOptions, setSessionOptions] = useState({
    interviewType: "technical_screen",
    questionLimit: 5,
  });
  const [sessionId, setSessionId] = useState(
    () => localStorage.getItem(ACTIVE_SESSION_KEY) || "",
  );

  const profileQuery = useQuery({
    queryKey: ["interview-profile"],
    queryFn: getInterviewProfile,
  });

  const sessionQuery = useQuery({
    queryKey: ["interview-session", sessionId],
    queryFn: () => getInterviewSession(sessionId),
    enabled: Boolean(sessionId),
  });

  const analyticsQuery = useQuery({
    queryKey: ["interview-analytics"],
    queryFn: getInterviewAnalytics,
  });

  const historyQuery = useQuery({
    queryKey: ["interview-history"],
    queryFn: getInterviewHistory,
  });

  const startMutation = useMutation({
    mutationFn: startInterviewSession,
    onSuccess: (data) => {
      const nextId = data?.session?.id;
      setDraftAnswer("");
      setSessionId(String(nextId));
      localStorage.setItem(ACTIVE_SESSION_KEY, String(nextId));
      queryClient.setQueryData(["interview-session", String(nextId)], {
        session: data.session,
      });
      queryClient.invalidateQueries({ queryKey: ["interview-history"] });
      queryClient.invalidateQueries({ queryKey: ["interview-analytics"] });
    },
  });

  const answerMutation = useMutation({
    mutationFn: ({ id, answer }) => submitInterviewAnswer(id, answer),
    onSuccess: (data) => {
      setDraftAnswer("");
      queryClient.invalidateQueries({ queryKey: ["interview-session", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["interview-history"] });
      queryClient.invalidateQueries({ queryKey: ["interview-analytics"] });

      if (data?.completed) {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
      }
    },
  });

  const completeMutation = useMutation({
    mutationFn: completeInterviewSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interview-session", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["interview-history"] });
      queryClient.invalidateQueries({ queryKey: ["interview-analytics"] });
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    },
  });

  useEffect(() => {
    if (sessionQuery.data?.session?.status === "completed") {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  }, [sessionQuery.data?.session?.status]);

  const profile = profileQuery.data?.profile;
  const hasCareerProfile = profileQuery.data?.status === "chosen";
  const session = sessionQuery.data?.session;
  const analytics = analyticsQuery.data?.analytics;
  const history = historyQuery.data?.sessions || [];

  const liveAverageScore = useMemo(() => averageLiveScore(session), [session]);
  const report = session?.finalReport;
  const currentQuestion = session?.currentQuestion;
  const latestEntry =
    session?.transcript?.length ? session.transcript[session.transcript.length - 1] : null;

  const handleStart = () => {
    startMutation.mutate(sessionOptions);
  };

  const handleSubmitAnswer = () => {
    if (!draftAnswer.trim() || !sessionId) return;
    answerMutation.mutate({ id: sessionId, answer: draftAnswer.trim() });
  };

  const handleComplete = () => {
    if (!sessionId) return;
    completeMutation.mutate(sessionId);
  };

  if (profileQuery.isLoading) {
    return (
      <DashboardShell>
        <SectionCard className="p-8">
          <div className="text-sm text-[#6c604d]">Loading interview workspace...</div>
        </SectionCard>
      </DashboardShell>
    );
  }

  if (!hasCareerProfile) {
    return (
      <DashboardShell>
        <EmptyCareerState />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <SectionCard className="overflow-hidden">
        <div className="grid gap-6 p-6 md:p-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="inline-flex rounded-full bg-[#edf4ff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#285ea7]">
              Premium Interview Lab
            </div>
            <h1 className="mt-5 max-w-[14ch] text-4xl font-semibold leading-tight text-[#1f180f] md:text-5xl">
              Role-specific interviews with clear evaluation and repeatable analytics.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#5e5246]">
              Your interview is generated from your saved career target and skills.
              Each answer is scored, stored, and rolled into a session report so
              you can see whether you are getting better over time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-[#f6f0e6] px-4 py-2 text-sm font-medium text-[#4b4033]">
                Target role: {profile.careerGoal}
              </span>
              <span className="rounded-full bg-[#eef8f1] px-4 py-2 text-sm font-medium text-[#33543e]">
                Experience: {profile.experience || "Unspecified"}
              </span>
              <span className="rounded-full bg-[#fff2e5] px-4 py-2 text-sm font-medium text-[#805123]">
                Availability: {profile.availability || "Flexible"}
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            <MetricTile
              label="Sessions"
              value={analytics?.totalSessions ?? 0}
              detail="Completed mock interviews tracked in analytics."
              tone="cool"
            />
            <MetricTile
              label="Average Score"
              value={analytics?.averageOverallScore ?? 0}
              detail="Your cross-session performance benchmark."
              tone="warm"
            />
            <MetricTile
              label="Trend"
              value={(analytics?.trend || "stable").replaceAll("_", " ")}
              detail="Based on your latest completed sessions."
              tone="green"
            />
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {!session || session.status === "completed" ? (
            <SectionCard className="p-6 md:p-8">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                  <div className="text-xs uppercase tracking-[0.24em] text-[#8e7b63]">
                    Session Setup
                  </div>
                  <h2 className="text-3xl font-semibold text-[#231b12]">
                    Configure the next interview
                  </h2>
                  <p className="max-w-3xl text-sm leading-7 text-[#665847]">
                    Keep the question count intentionally limited like a real technical
                    screen. The system will ask one question at a time, evaluate each
                    answer, and save the full interview to your history.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="rounded-[24px] bg-[#f7f2ea] p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-[#8e7a61]">
                      Your profile basis
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#d15d31] text-xl font-semibold text-white">
                        {initialsFromSkill(profile.careerGoal)}
                      </div>
                      <div>
                        <div className="text-2xl font-semibold text-[#231d15]">
                          {profile.careerGoal}
                        </div>
                        <div className="mt-1 text-sm text-[#6f614e]">
                          {profile.skills?.join(" • ")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-[#f3f7fc] p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-[#5d7799]">
                      Question limit
                    </div>
                    <div className="mt-3 flex gap-3">
                      {[4, 5, 6].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() =>
                            setSessionOptions((current) => ({
                              ...current,
                              questionLimit: count,
                            }))
                          }
                          className="rounded-[18px] px-5 py-4 text-left transition"
                          style={{
                            backgroundColor:
                              sessionOptions.questionLimit === count
                                ? "#2563eb"
                                : "white",
                            color:
                              sessionOptions.questionLimit === count
                                ? "white"
                                : "#274160",
                          }}
                        >
                          <div className="text-2xl font-semibold">{count}</div>
                          <div className="text-xs uppercase tracking-[0.16em] opacity-75">
                            Questions
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {interviewTypes.map((type) => {
                    const selected = sessionOptions.interviewType === type.value;

                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setSessionOptions((current) => ({
                            ...current,
                            interviewType: type.value,
                          }))
                        }
                        className="rounded-[24px] border p-5 text-left transition"
                        style={{
                          borderColor: selected ? "#d36a3b" : "#e7dccd",
                          backgroundColor: selected ? "#fff4ec" : "#fffdfa",
                        }}
                      >
                        <div className="text-lg font-semibold text-[#291f15]">
                          {type.label}
                        </div>
                        <p className="mt-3 text-sm leading-7 text-[#6b5d4a]">
                          {type.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {report ? (
                  <div className="rounded-[26px] border border-[#ebe0cf] bg-[#fdf9f4] p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-[#907b63]">
                          Latest Report
                        </div>
                        <h3 className="mt-2 text-2xl font-semibold text-[#231c14]">
                          {report.readiness.replaceAll("_", " ")}
                        </h3>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#615341]">
                          {report.summary}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="mb-2 text-xs uppercase tracking-[0.18em] text-[#907b63]">
                          Overall
                        </div>
                        <ScoreBadge
                          score={report.overallScore}
                          className="rounded-[20px] px-5 py-4 text-4xl font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={handleStart}
                    disabled={startMutation.isPending}
                    className="rounded-full bg-[#cb6234] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#b35329] disabled:cursor-not-allowed disabled:bg-[#d8c1b5]"
                  >
                    {startMutation.isPending ? "Preparing session..." : "Start Interview"}
                  </button>
                  <Link
                    to="/career-form"
                    className="rounded-full border border-[#d8cab8] px-7 py-3 text-sm font-semibold text-[#4d4031] transition hover:bg-[#f6efe5]"
                  >
                    Edit Career Inputs
                  </Link>
                </div>
              </div>
            </SectionCard>
          ) : (
            <SectionCard className="overflow-hidden">
              <div className="border-b border-[#eee3d4] px-6 py-5 md:px-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-[#8a7760]">
                      Live Interview
                    </div>
                    <h2 className="mt-2 text-3xl font-semibold text-[#1f180f]">
                      {session.targetRole}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[#625645]">
                      Answer in the same structure you would use in a real technical
                      screen: approach, reasoning, tradeoffs, and how you would validate
                      it in production.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="rounded-full bg-[#eef4ff] px-4 py-2 text-sm font-medium text-[#255598]">
                      {session.interviewType.replaceAll("_", " ")}
                    </div>
                    <div className="rounded-full bg-[#f6f1e8] px-4 py-2 text-sm font-medium text-[#594c3b]">
                      {session.currentQuestionIndex} / {session.questionLimit} answered
                    </div>
                  </div>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#ece3d5]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent(session)}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full bg-[linear-gradient(90deg,#d26638_0%,#efb143_50%,#2d77de_100%)]"
                  />
                </div>
              </div>

              <div className="grid gap-0 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-6 p-6 md:p-8">
                  <div className="xl:sticky xl:top-6 xl:z-10 xl:-mb-1">
                    <div className="rounded-[26px] bg-[#fcf7f0] p-6 shadow-[0_18px_38px_rgba(87,66,44,0.08)]">
                      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#8a7760]">
                        <span>Current Question</span>
                        <span>•</span>
                        <span>{currentQuestion?.topic}</span>
                        <span>•</span>
                        <span>{currentQuestion?.difficulty}</span>
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold leading-tight text-[#231b12]">
                        {currentQuestion?.prompt}
                      </h3>
                      {currentQuestion?.expectedSignals?.length ? (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {currentQuestion.expectedSignals.map((signal) => (
                            <span
                              key={signal}
                              className="rounded-full bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[#7b6b57]"
                            >
                              {signal}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-[#eadfce] bg-white p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-[#927f66]">
                      Your Answer
                    </div>
                    <textarea
                      value={draftAnswer}
                      onChange={(event) => setDraftAnswer(event.target.value)}
                      placeholder="Explain your approach like you would in a real interview. Mention assumptions, tradeoffs, and validation."
                      className="mt-4 min-h-[220px] w-full resize-none rounded-[20px] border border-[#e7dccd] bg-[#fbfaf7] px-5 py-4 text-[15px] leading-7 text-[#32291f] outline-none transition focus:border-[#d36a3b] focus:bg-white"
                    />
                    <div className="mt-4 hidden items-center justify-between gap-4 xl:flex">
                      <p className="text-sm text-[#6b5d4a]">
                        Keep answers structured. Strong responses are concrete, concise,
                        and production-aware.
                      </p>
                    </div>
                  </div>

                  <div className="xl:sticky xl:bottom-4 xl:z-10">
                    <div className="rounded-[24px] border border-[#decfbe] bg-[rgba(255,249,242,0.92)] p-4 shadow-[0_18px_44px_rgba(84,62,40,0.12)] backdrop-blur">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <p className="text-sm text-[#6b5d4a]">
                          Keep answers structured. Strong responses are concrete,
                          concise, and production-aware.
                        </p>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={handleComplete}
                            disabled={completeMutation.isPending}
                            className="rounded-full border border-[#d9cab7] px-5 py-3 text-sm font-semibold text-[#4e4031] transition hover:bg-[#f6efe6] disabled:cursor-not-allowed"
                          >
                            End Session
                          </button>
                          <button
                            type="button"
                            onClick={handleSubmitAnswer}
                            disabled={answerMutation.isPending || !draftAnswer.trim()}
                            className="rounded-full bg-[#cb6234] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b45328] disabled:cursor-not-allowed disabled:bg-[#d8c1b5]"
                          >
                            {answerMutation.isPending ? "Scoring..." : "Submit Answer"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-[#271f16]">
                        Answer feed
                      </h3>
                      <div className="text-sm text-[#6d5f4c]">
                        Compact during the interview, fully expanded after completion
                      </div>
                    </div>
                    <CompactTranscriptList transcript={session.transcript} />
                  </div>
                </div>

                <aside className="border-t border-[#eee3d4] bg-[#f8f3eb] p-6 md:p-8 xl:border-l xl:border-t-0">
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs uppercase tracking-[0.24em] text-[#8b7860]">
                        Live performance
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                        <MetricTile
                          label="Average Score"
                          value={liveAverageScore}
                          detail="Updates after each graded answer."
                          tone="warm"
                        />
                        <MetricTile
                          label="Completed"
                          value={session.transcript?.length || 0}
                          detail="Answers already evaluated in this session."
                          tone="cool"
                        />
                      </div>
                    </div>

                    {latestEntry ? (
                      <div className="rounded-[24px] bg-white p-5">
                        <div className="text-xs uppercase tracking-[0.2em] text-[#917d65]">
                          Latest evaluation
                        </div>
                        <div className="mt-4 space-y-4">
                          <ScoreBar
                            label="Overall"
                            score={latestEntry.evaluation.overallScore}
                          />
                          <ScoreBar
                            label="Technical Accuracy"
                            score={latestEntry.evaluation.technicalAccuracy}
                          />
                          <ScoreBar
                            label="Problem Solving"
                            score={latestEntry.evaluation.problemSolving}
                          />
                          <ScoreBar
                            label="Communication"
                            score={latestEntry.evaluation.communication}
                          />
                        </div>
                        <div className="mt-5 rounded-[18px] bg-[#f7f2ea] p-4 text-sm leading-7 text-[#5a4d3d]">
                          {latestEntry.evaluation.idealAnswer}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-[24px] border border-dashed border-[#dacbb8] bg-white p-5 text-sm leading-7 text-[#695d4a]">
                        Submit your first answer to unlock the score breakdown and coaching panel.
                      </div>
                    )}

                    <div className="rounded-[24px] bg-white p-5">
                      <div className="text-xs uppercase tracking-[0.2em] text-[#917d65]">
                        Interview basis
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(session.primarySkills || []).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-[#f5efe5] px-4 py-2 text-sm font-medium text-[#514431]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </SectionCard>
          )}
        </div>

        <div className="space-y-6">
          <SectionCard className="p-6 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[#8f7b63]">
                  Interview Analytics
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-[#231b12]">
                  Performance overview
                </h2>
              </div>
              <div className="rounded-full bg-[#f1f6ff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#3666af]">
                YC Demo Ready
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <MetricTile
                label="Best Score"
                value={analytics?.bestScore ?? 0}
                detail="Highest completed interview score."
                tone="green"
              />
              <MetricTile
                label="Latest Score"
                value={analytics?.latestScore ?? 0}
                detail="Most recent completed session."
                tone="cool"
              />
            </div>

            <div className="mt-6 rounded-[24px] bg-[#f8f3eb] p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-[#8c7a61]">
                Recent performance
              </div>
              <div className="mt-4">
                <SessionHistoryBars sessions={analytics?.recentSessions || []} />
              </div>
            </div>
          </SectionCard>

          <SectionCard className="p-6 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[#8f7b63]">
                  Session History
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-[#231b12]">
                  Previous interviews
                </h2>
              </div>
              <div className="text-sm text-[#6b5e4b]">
                {history.length} saved
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {history.length ? (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-[#eadfce] bg-[#fcfaf7] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-semibold text-[#281f15]">
                          {item.targetRole}
                        </div>
                        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[#8b7760]">
                          {formatDate(item.completedAt)}
                        </div>
                      </div>
                      <ScoreBadge
                        score={item.overallScore}
                        className="rounded-full px-4 py-2 text-sm font-semibold"
                      />
                    </div>
                    <div className="mt-4 text-sm text-[#655846]">
                      Readiness:{" "}
                      <span className="font-semibold">
                        {item.readiness.replaceAll("_", " ")}
                      </span>
                    </div>
                    {item.improvementAreas?.length ? (
                      <div className="mt-3 rounded-[16px] bg-white p-4 text-sm leading-7 text-[#584b39]">
                        Improve next: {item.improvementAreas.join(" • ")}
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-[#dacbb8] bg-[#faf7f1] p-5 text-sm text-[#6c5f4c]">
                  No completed interviews yet. Start one to create your analytics baseline.
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </DashboardShell>
  );
};

export default Interview;
