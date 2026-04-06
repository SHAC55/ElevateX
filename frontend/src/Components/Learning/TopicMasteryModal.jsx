import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSubmitTopicMasteryCheck, useTopicMasteryCheck } from "../../hooks/useLearning";

const normalizeAnswer = (value) => {
  if (Array.isArray(value)) return value;
  return value || "";
};

const hasAnswer = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return String(value || "").trim().length > 0;
};

const fmtDateTime = (value) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Just now";

export default function TopicMasteryModal({ topic, open, onClose, onPassed }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const { data, isLoading, error } = useTopicMasteryCheck(topic?._id, {
    enabled: open && !!topic?._id,
  });
  const { mutateAsync, isPending } = useSubmitTopicMasteryCheck();

  useEffect(() => {
    if (!open) {
      setAnswers({});
      setResult(null);
    }
  }, [open]);

  const masteryCheck = data?.masteryCheck;
  const attempts = result?.attempts || data?.attempts || [];
  const latestAttempt = result?.attempt || data?.latestAttempt || attempts[0] || null;
  const questions = masteryCheck?.questions || [];
  const canSubmit = questions.length > 0 && questions.every((question) => hasAnswer(answers[question.id]));
  const reviewIntelligence = result?.reviewIntelligence || null;

  const scoreTone = useMemo(() => {
    if (!result) return "text-slate-700";
    return result.result?.passed ? "text-emerald-700" : "text-rose-700";
  }, [result]);

  const setSingleAnswer = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const toggleMultiAnswer = (questionId, option) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      const next = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, [questionId]: next };
    });
  };

  const handleSubmit = async () => {
    if (!topic?._id || !canSubmit) return;

    const payload = questions.map((question) => ({
      id: question.id,
      answer: normalizeAnswer(answers[question.id]),
    }));

    const response = await mutateAsync({
      topicId: topic._id,
      answers: payload,
    });

    setResult(response);
    if (response?.result?.passed) {
      onPassed?.(response);
    }
  };

  if (!open || !topic) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-6">
        <motion.button
          type="button"
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          className="relative z-10 max-h-[92vh] w-full max-w-6xl overflow-auto rounded-[34px] border border-white/20 bg-[#f8fafc] p-6 shadow-[0_30px_120px_rgba(15,23,42,0.35)]"
        >
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700">Proof Engine</div>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{topic.name}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                    This assessment now stores every attempt, scores richer question types, and feeds the analytics cockpit for the parent skill.
                  </p>
                </div>
                <button onClick={onClose} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                  Close
                </button>
              </div>

              <div className="mt-6 rounded-[26px] border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    Passing score {masteryCheck?.passingScore ?? 70}%
                  </div>
                  <div className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-800">
                    {questions.length} questions
                  </div>
                  <div className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-800">
                    {attempts.length} attempts stored
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="mt-6 text-slate-600">Generating mastery check...</div>
              ) : error ? (
                <div className="mt-6 text-rose-600">Failed to load mastery check.</div>
              ) : (
                <div className="mt-8 space-y-6">
                  {questions.map((question, index) => (
                    <div key={question.id} className="rounded-[26px] border border-slate-200 bg-white p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Question {index + 1}
                        </div>
                        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                          {(question.type || "mcq").replace("_", " ")}
                        </div>
                      </div>
                      <div className="mt-3 text-lg font-semibold text-slate-950">{question.prompt}</div>

                      {(question.type === "mcq" || question.type === "true_false") && (
                        <div className="mt-4 grid gap-3">
                          {(question.options || []).map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setSingleAnswer(question.id, option)}
                              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                                answers[question.id] === option
                                  ? "border-slate-950 bg-slate-950 text-white"
                                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}

                      {question.type === "multi_select" && (
                        <div className="mt-4 grid gap-3">
                          {(question.options || []).map((option) => {
                            const selected = Array.isArray(answers[question.id]) && answers[question.id].includes(option);
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => toggleMultiAnswer(question.id, option)}
                                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                                  selected
                                    ? "border-slate-950 bg-slate-950 text-white"
                                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
                                }`}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {question.type === "short_answer" && (
                        <textarea
                          value={answers[question.id] || ""}
                          onChange={(event) => setSingleAnswer(question.id, event.target.value)}
                          rows={4}
                          className="mt-4 w-full rounded-[22px] border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-950"
                          placeholder="Write a concise practical answer..."
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {result ? (
                <div className="mt-6 rounded-[26px] border border-slate-200 bg-white p-5">
                  <div className={`text-2xl font-semibold ${scoreTone}`}>
                    {result.result?.score}% {result.result?.passed ? "passed" : "not passed yet"}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    {result.result?.correctCount}/{result.result?.totalQuestions} correct
                  </div>
                  <div className="mt-4 space-y-3">
                    {(result.result?.details || []).map((item) => (
                      <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-sm font-semibold text-slate-900">{item.prompt}</div>
                        <div className="mt-2 text-sm text-slate-600">
                          Your answer:{" "}
                          <span className="font-medium text-slate-900">
                            {Array.isArray(item.selectedAnswer)
                              ? item.selectedAnswer.join(", ") || "No answer"
                              : item.selectedAnswer || "No answer"}
                          </span>
                        </div>
                        {!item.isCorrect ? (
                          <div className="mt-1 text-sm text-rose-700">
                            Correct answer:{" "}
                            {Array.isArray(item.correctAnswer)
                              ? item.correctAnswer.join(", ")
                              : item.correctAnswer || "See explanation"}
                          </div>
                        ) : null}
                        <div className="mt-2 text-sm text-slate-600">{item.explanation}</div>
                      </div>
                    ))}
                  </div>
                  {reviewIntelligence ? (
                    <div className="mt-5 space-y-4">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-sm font-semibold text-slate-950">Why you missed this</div>
                        <div className="mt-3 space-y-3">
                          {(reviewIntelligence.whyYouMissedThis || []).map((item) => (
                            <div key={item.id} className="rounded-2xl bg-white p-4">
                              <div className="font-medium text-slate-900">{item.prompt}</div>
                              <div className="mt-2 text-sm text-slate-600">{item.explanation}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-sm font-semibold text-slate-950">Concept tags</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(reviewIntelligence.conceptTags || []).map((tag) => (
                            <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-sm font-semibold text-slate-950">Personalized retry set</div>
                        <div className="mt-3 space-y-3">
                          {(reviewIntelligence.personalizedRetrySet || []).map((item) => (
                            <div key={item.id} className="rounded-2xl bg-white p-4">
                              <div className="font-medium text-slate-900">{item.prompt}</div>
                              <div className="mt-2 text-sm text-slate-600">{item.whyMissed}</div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {(item.conceptTags || []).map((tag) => (
                                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <div className="mt-3 text-sm font-medium text-slate-800">{item.nextAction}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-8 flex justify-end gap-3">
                <button onClick={onClose} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
                  Exit
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isPending}
                  className="rounded-full bg-gradient-to-r from-cyan-500 to-orange-400 px-5 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? "Submitting..." : "Submit mastery check"}
                </button>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-[26px] border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold text-slate-950">Latest evidence</div>
                {latestAttempt ? (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-3xl font-semibold tracking-tight text-slate-950">{latestAttempt.score}%</div>
                      <div className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        latestAttempt.passed ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {latestAttempt.passed ? "passed" : "retry"}
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">{fmtDateTime(latestAttempt.createdAt)}</div>
                    <div className="flex flex-wrap gap-2">
                      {[...(latestAttempt.weakAreas || []), ...(latestAttempt.strengths || [])].slice(0, 4).map((area) => (
                        <span key={area} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 text-sm leading-7 text-slate-600">
                    No stored evidence yet. The first submission will start the attempt ledger for this topic.
                  </div>
                )}
              </div>

              <div className="rounded-[26px] border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold text-slate-950">Attempt ledger</div>
                <div className="mt-4 space-y-3">
                  {attempts.length ? (
                    attempts.map((attempt) => (
                      <div key={attempt._id || attempt.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-slate-900">{attempt.score}%</div>
                          <div className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                            attempt.passed ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}>
                            {attempt.passed ? "pass" : "retry"}
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">{fmtDateTime(attempt.createdAt)}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-600">No attempts recorded yet.</div>
                  )}
                </div>
              </div>

              {reviewIntelligence?.spacedRepetition ? (
                <div className="rounded-[26px] border border-slate-200 bg-white p-5">
                  <div className="text-sm font-semibold text-slate-950">Spaced repetition</div>
                  <div className="mt-3 text-sm text-slate-600">
                    Queue: <span className="font-medium text-slate-900">{reviewIntelligence.spacedRepetition.queueLabel}</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Review again in <span className="font-medium text-slate-900">{reviewIntelligence.spacedRepetition.nextReviewInDays} day(s)</span>.
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
