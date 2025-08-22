import React from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Tag } from "../ui/Tag";
import { Progress } from "../ui/Progress";

const cn = (...c) => c.filter(Boolean).join(" ");
const getId = (v) => (typeof v === "string" ? v : v?._id || v?.toString?.() || "");

const difficultyBadgeVariant = (d) => {
  const val = (d || "").toLowerCase();
  if (["beginner", "easy", "foundation"].includes(val)) return "success";
  if (["advanced", "hard", "expert"].includes(val)) return "danger";
  return "warning";
};

const statusLabel = (s) => (s || "").replaceAll("_", " ");

export default function TopicOverview({
  topics,
  loadingTopics,
  expandedTopic,
  setExpandedTopic,
  pendingTopicId,
  updateTopic,
  refetchTopics
}) {
  if (loadingTopics) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!topics.length) {
    return null;
  }

  return (
    <ul className="grid grid-cols-1 gap-3">
      {topics.map((t) => {
        const tid = getId(t._id);
        const isOpen = expandedTopic === tid;
        const tStatus =
          t.status ||
          (t.progress >= 100 ? "completed" : t.progress > 0 ? "in_progress" : "not_started");

        const startTopic = (e) =>
          updateTopic(
            {
              topicId: tid,
              status: "in_progress",
              progress: Math.max(1, t.progress || 0),
            },
            e
          );

        const completeTopic = (e) =>
          updateTopic(
            {
              topicId: tid,
              status: "completed",
              progress: 100,
            },
            e
          );

        const resetTopic = (e) =>
          updateTopic(
            {
              topicId: tid,
              status: "not_started",
              progress: 0,
            },
            e
          );

        return (
          <li key={tid}>
            <Card variant="outlined" padding="normal" className="hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-medium text-gray-900 truncate">{t.title}</span>
                    <Tag variant={difficultyBadgeVariant(t.difficulty)} size="sm">
                      {t.difficulty}
                    </Tag>
                    <Tag 
                      variant={
                        tStatus === "completed" ? "success" : 
                        tStatus === "in_progress" ? "warning" : "default"
                      } 
                      size="sm"
                    >
                      {statusLabel(tStatus)}
                    </Tag>
                    <span className="text-xs text-gray-500">{t.estimated_hours || 0}h</span>
                  </div>

                  {Array.isArray(t.objectives) && t.objectives.length > 0 && (
                    <div className="mt-2">
                      {!isOpen ? (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {t.objectives.join(" • ")}
                        </p>
                      ) : (
                        <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
                          {t.objectives.map((o, i) => (
                            <li key={`${tid}-obj-${i}`}>{o}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  <div className="mt-3">
                    <Progress value={Math.round(t.progress || 0)} className="h-1.5" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Progress</span>
                      <span>{Math.round(t.progress || 0)}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end shrink-0">
                  {Array.isArray(t.objectives) && t.objectives.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setExpandedTopic(isOpen ? null : tid);
                      }}
                      className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {isOpen ? "Less" : "More"}
                    </button>
                  )}
                  <div className="flex items-center gap-2">
                    {tStatus !== "in_progress" && tStatus !== "completed" && (
                      <Button
                        size="sm"
                        type="button"
                        loading={pendingTopicId === tid}
                        onClick={startTopic}
                        variant="outline"
                      >
                        Start
                      </Button>
                    )}
                    {tStatus === "in_progress" && (
                      <Button
                        size="sm"
                        type="button"
                        loading={pendingTopicId === tid}
                        onClick={completeTopic}
                      >
                        Complete
                      </Button>
                    )}
                    {tStatus !== "not_started" && (
                      <Button
                        size="sm"
                        type="button"
                        variant="ghost"
                        disabled={pendingTopicId === tid}
                        onClick={resetTopic}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}