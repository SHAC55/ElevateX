

// import React, { useEffect, useMemo, useState, useRef } from "react";
// import {
//   useTopics,
//   useGenerateTopicsForSkill,
//   useSkillAIContent,
//   useUpsertSkillStatus,
//   useUpsertTopicStatus,
// } from "../../hooks/useLearning";
// import { useAuth } from "../../context/AuthContext";
// import { useQueryClient } from "@tanstack/react-query";
// import { motion, AnimatePresence } from "framer-motion";
// // Premium UI primitives
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
// import { Button } from "../ui/Button";
// import { Tag } from "../ui/Tag";
// import { Progress } from "../ui/Progress";
// import EmptyState from "./EmptyState";
// import SkillContent from "./SkillContent";
// import TopicOverview from "./TopicOverview";

// const cn = (...c) => c.filter(Boolean).join(" ");
// const getId = (v) => (typeof v === "string" ? v : v?._id || v?.toString?.() || "");

// // parse topic.content safely (supports string or object)
// const unpackTopic = (t) => {
//   let payload = {};
//   try {
//     payload = typeof t?.content === "string" ? JSON.parse(t.content) : t?.content || {};
//   } catch {}
//   const difficulty = (t?.difficulty || payload?.difficulty || "intermediate").toString().toLowerCase();
//   const estimated_hours =
//     typeof t?.estimated_hours === "number"
//       ? t.estimated_hours
//       : typeof payload?.estimated_hours === "number"
//       ? payload.estimated_hours
//       : parseFloat(payload?.estimated_hours || 0) || 0;
//   const objectives = Array.isArray(t?.objectives)
//     ? t.objectives
//     : Array.isArray(payload?.objectives)
//     ? payload.objectives
//     : [];
//   const status = (t?.status || payload?.status || "not_started").toLowerCase();
//   const progress =
//     typeof t?.progress === "number"
//       ? t.progress
//       : typeof payload?.progress === "number"
//       ? payload.progress
//       : status === "completed"
//       ? 100
//       : status === "in_progress"
//       ? 25
//       : 0;

//   return { ...t, difficulty, estimated_hours, objectives, status, progress };
// };

// const difficultyBadgeVariant = (d) => {
//   const val = (d || "").toLowerCase();
//   if (["beginner", "easy", "foundation"].includes(val)) return "success";
//   if (["advanced", "hard", "expert"].includes(val)) return "danger";
//   return "warning";
// };

// const statusLabel = (s) => (s || "").replaceAll("_", " ");

// export default function SkillCard({ skill }) {
//   const { user } = useAuth();
//   const currentUserId = user?.id;
//   const queryClient = useQueryClient();

//   const [open, setOpen] = useState(false);
//   const [expandedTopic, setExpandedTopic] = useState(null);
//   const [pendingTopicId, setPendingTopicId] = useState(null);

//   const skillId = getId(skill._id);
//   const genTopics = useGenerateTopicsForSkill(skillId);

//   const { mutate: upsertSkillStatus } = useUpsertSkillStatus();
//   const { mutate: upsertTopicStatus } = useUpsertTopicStatus();

//   // Query keys we will touch repeatedly
//   const topicsKey = ["learning:topics", { skillId }];
//   const skillKey = ["learning:skill", skillId];
//   const skillsListKey = ["learning:skills"];

//   // Fetch topics only when open, but keep previous to avoid flicker
//   const {
//     data: allTopics = [],
//     isLoading: loadingTopics,
//     isFetching: fetchingTopics,
//     refetch: refetchTopics,
//   } = useTopics(
//     { skillId },
//     {
//       enabled: open,
//       staleTime: 60_000,
//       keepPreviousData: true,
//       refetchOnWindowFocus: false,
//       refetchOnReconnect: false,
//       refetchOnMount: false,
//     }
//   );

//   // Defensive filter + unpack
//   const topics = useMemo(() => {
//     const filtered = (allTopics || []).filter((t) => getId(t.skillId) === skillId);
//     return filtered.map(unpackTopic).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
//   }, [allTopics, skillId]);

//   // AI material only when open
//   const { data: aiMaterial, isLoading: loadingAI, error: aiError } = useSkillAIContent(skillId, {
//     enabled: open,
//   });

//   // Weighted progress by estimated_hours (fallback equal weights)
//   const { totalHours, weightedProgress, completedCount, inProgressCount } = useMemo(() => {
//     const hours = topics.reduce((sum, t) => sum + (t.estimated_hours || 0), 0);
//     const denom = hours > 0 ? hours : topics.length || 1;
//     const num =
//       topics.length === 0
//         ? 0
//         : topics.reduce((acc, t) => {
//             const w = hours > 0 ? (t.estimated_hours || 0) : 1;
//             return acc + w * (Math.max(0, Math.min(100, t.progress || 0)) / 100);
//           }, 0);
//     const completed = topics.filter((t) => (t.status || "").toLowerCase() === "completed").length;
//     const inProg = topics.filter((t) => (t.status || "").toLowerCase() === "in_progress").length;
//     return {
//       totalHours: topics.reduce((sum, t) => sum + (t.estimated_hours || 0), 0),
//       weightedProgress: Math.round((num / denom) * 100),
//       completedCount: completed,
//       inProgressCount: inProg,
//     };
//   }, [topics]);

//   // Derived status from topic progress
//   const derivedStatus =
//     topics.length === 0
//       ? (skill.status ||
//           (skill.progress >= 100 ? "completed" : skill.progress > 0 ? "in_progress" : "not_started")
//         ).toLowerCase()
//       : weightedProgress >= 100
//       ? "completed"
//       : weightedProgress > 0
//       ? "in_progress"
//       : "not_started";

//   // Local cache patch helper to avoid global invalidations
//   const patchSkillCaches = (status, progress) => {
//     // Single skill cache
//     queryClient.setQueryData(skillKey, (prev) =>
//       prev ? { ...prev, status, progress } : prev
//     );
//     // Skills list cache
//     queryClient.setQueryData(skillsListKey, (prev) => {
//       if (!Array.isArray(prev)) return prev;
//       return prev.map((s) => (getId(s._id) === skillId ? { ...s, status, progress } : s));
//     });
//   };

//   // Persist derived skill state if different, but don't invalidate lists
//   const lastPersisted = useRef(null);
//   useEffect(() => {
//     const key = `${derivedStatus}:${weightedProgress}`;
//     if (!currentUserId || !skillId) return;
//     if (lastPersisted.current === key) return;

//     const serverStatus = (skill.status || "").toLowerCase();
//     const serverProgress = Math.round(skill.progress || 0);

//     if (serverStatus !== derivedStatus || serverProgress !== weightedProgress) {
//       lastPersisted.current = key;
//       // Optimistically patch local caches so parents don't refetch
//       patchSkillCaches(derivedStatus, weightedProgress);

//       upsertSkillStatus(
//         { userId: currentUserId, skillId, status: derivedStatus, progress: weightedProgress },
//         {
//           onError: () => {
//             // If server rejects, roll back to server-provided values
//             patchSkillCaches(serverStatus, serverProgress);
//           },
//           // No global invalidations here. Let background fetches catch up later.
//         }
//       );
//     }
//   }, [
//     currentUserId,
//     skillId,
//     derivedStatus,
//     weightedProgress,
//     skill.status,
//     skill.progress,
//     upsertSkillStatus,
//     queryClient,
//   ]);

//   const handleGenerate = async (e) => {
//     e?.preventDefault?.();
//     e?.stopPropagation?.();
//     await genTopics.mutateAsync(
//       { difficulty: skill.difficulty || "intermediate" },
//       { onSuccess: () => refetchTopics() }
//     );
//   };

//   // Centralized per-topic optimistic update to prevent flicker and parent refetch
//   const updateTopic = (vars, e) => {
//     e?.preventDefault?.();
//     e?.stopPropagation?.();

//     setPendingTopicId(vars.topicId);

//     upsertTopicStatus(vars, {
//       onMutate: async () => {
//         await queryClient.cancelQueries({ queryKey: topicsKey });
//         const previous = queryClient.getQueryData(topicsKey);

//         // Optimistically update the topic in cache
//         queryClient.setQueryData(topicsKey, (old = []) =>
//           old.map((t) =>
//             getId(t._id) === vars.topicId
//               ? { ...t, status: vars.status, progress: vars.progress }
//               : t
//           )
//         );

//         return { previous };
//       },
//       onError: (_err, _vars, ctx) => {
//         if (ctx?.previous) queryClient.setQueryData(topicsKey, ctx.previous);
//       },
//       onSettled: () => {
//         setPendingTopicId(null);
//         // Light touch: refetch just this query in background, keepPreviousData avoids flashes
//         queryClient.invalidateQueries({ queryKey: topicsKey, refetchType: "inactive" });
//       },
//     });
//   };

//   const displayDifficulty = (skill.difficulty || "intermediate").toLowerCase();

//   return (
//     <Card variant="elevated" padding="normal" borderRadius="xl" className="overflow-hidden border-0">
//       <CardHeader className="pb-0">
//         <div className="flex items-start justify-between gap-4">
//           <div className="min-w-0 flex-1">
//             <CardTitle size="lg" className="truncate text-gray-900">
//               {skill.name}
//             </CardTitle>
//             <CardDescription className="mt-2 flex items-center gap-2 flex-wrap">
//               <Tag variant={difficultyBadgeVariant(displayDifficulty)} className="mr-2">
//                 {displayDifficulty.charAt(0).toUpperCase() + displayDifficulty.slice(1)}
//               </Tag>
//               <Tag variant={
//                 derivedStatus === "completed" ? "success" : 
//                 derivedStatus === "in_progress" ? "warning" : "default"
//               }>
//                 {statusLabel(derivedStatus)}
//               </Tag>
//               {open && topics.length > 0 ? (
//                 <span className="text-xs text-gray-500">
//                   {topics.length} topic{topics.length > 1 ? "s" : ""} • {totalHours}h total
//                 </span>
//               ) : null}
//             </CardDescription>
//           </div>

//           <div className="flex items-center gap-2 shrink-0">
//             <Button 
//               size="sm" 
//               variant="outline" 
//               onClick={(e) => { e.preventDefault(); setOpen((v) => !v); }} 
//               type="button"
//               className="rounded-full h-9 w-9 p-0 flex items-center justify-center border-gray-300"
//             >
//               {open ? "↑" : "↓"}
//             </Button>
//             <Button
//               size="sm"
//               onClick={handleGenerate}
//               loading={genTopics.isPending}
//               title="Regenerate topics for this skill"
//               type="button"
//               variant="premium"
//             >
//               Generate
//             </Button>
//           </div>
//         </div>

//         {/* Progress */}
//         <div className="mt-4">
//           <Progress value={weightedProgress} className="h-2" />
//           <div className="flex justify-between text-xs text-gray-500 mt-1">
//             <span>Overall Progress</span>
//             <span>{weightedProgress}%</span>
//           </div>
//           {open && fetchingTopics && !loadingTopics ? (
//             <p className="mt-1 text-xs text-gray-400">Updating…</p>
//           ) : null}
//         </div>
//       </CardHeader>

//       <CardContent className={cn(open ? "pt-5" : "pt-0")}>
//         <AnimatePresence initial={false}>
//           {open && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.2 }}
//               className="space-y-6"
//             >
//               {/* Topics Section */}
//               <section>
//                 <div className="flex items-center justify-between mb-3">
//                   <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide text-gray-500">Topics</h4>
//                   {!loadingTopics && (
//                     <button
//                       type="button"
//                       onClick={(e) => { e.preventDefault(); refetchTopics(); }}
//                       className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
//                     >
//                       Refresh
//                     </button>
//                   )}
//                 </div>

//                 {topics.length ? (
//                   <TopicOverview
//                     topics={topics}
//                     loadingTopics={loadingTopics}
//                     expandedTopic={expandedTopic}
//                     setExpandedTopic={setExpandedTopic}
//                     pendingTopicId={pendingTopicId}
//                     updateTopic={updateTopic}
//                     refetchTopics={refetchTopics}
//                   />
//                 ) : (
//                   <EmptyState 
//                     title="No topics yet" 
//                     subtitle="Generate topics for this skill to start learning."
//                     action={
//                       <Button onClick={handleGenerate} loading={genTopics.isPending} variant="premium">
//                         Generate Topics
//                       </Button>
//                     }
//                   />
//                 )}
//               </section>

//               {/* AI Study Material Section */}
//               <section>
//                 <h4 className="font-medium text-gray-900 mb-2 text-sm uppercase tracking-wide text-gray-500">AI Study Material</h4>
//                 <SkillContent loadingAI={loadingAI} aiError={aiError} aiMaterial={aiMaterial} />
//               </section>

//               {/* Stats Section */}
//               {topics.length > 0 && (
//                 <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t">
//                   <span className="flex items-center gap-1">
//                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
//                     {completedCount} completed
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <div className="w-2 h-2 rounded-full bg-amber-500"></div>
//                     {inProgressCount} in progress
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <div className="w-2 h-2 rounded-full bg-gray-300"></div>
//                     {topics.length - completedCount - inProgressCount} not started
//                   </span>
//                 </div>
//               )}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </CardContent>
//     </Card>
//   );
// }


import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  useTopics,
  useGenerateTopicsForSkill,
  useSkillAIContent,
  useUpsertSkillStatus,
  useUpsertTopicStatus,
} from "../../hooks/useLearning";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
// Premium UI primitives
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Tag } from "../ui/Tag";
import { Progress } from "../ui/Progress";
import EmptyState from "./EmptyState";
import SkillContent from "./SkillContent";
import TopicOverview from "./TopicOverview";

const cn = (...c) => c.filter(Boolean).join(" ");
const getId = (v) => (typeof v === "string" ? v : v?._id || v?.toString?.() || "");

// parse topic.content safely (supports string or object)
const unpackTopic = (t) => {
  let payload = {};
  try {
    payload = typeof t?.content === "string" ? JSON.parse(t.content) : t?.content || {};
  } catch {}
  const difficulty = (t?.difficulty || payload?.difficulty || "intermediate").toString().toLowerCase();
  const estimated_hours =
    typeof t?.estimated_hours === "number"
      ? t.estimated_hours
      : typeof payload?.estimated_hours === "number"
      ? payload.estimated_hours
      : parseFloat(payload?.estimated_hours || 0) || 0;
  const objectives = Array.isArray(t?.objectives)
    ? t.objectives
    : Array.isArray(payload?.objectives)
    ? payload.objectives
    : [];
  const status = (t?.status || payload?.status || "not_started").toLowerCase();
  const progress =
    typeof t?.progress === "number"
      ? t.progress
      : typeof payload?.progress === "number"
      ? payload.progress
      : status === "completed"
      ? 100
      : status === "in_progress"
      ? 25
      : 0;

  return { ...t, difficulty, estimated_hours, objectives, status, progress };
};

const difficultyBadgeVariant = (d) => {
  const val = (d || "").toLowerCase();
  if (["beginner", "easy", "foundation"].includes(val)) return "success";
  if (["advanced", "hard", "expert"].includes(val)) return "danger";
  return "warning";
};

const statusLabel = (s) => (s || "").replaceAll("_", " ");

export default function SkillCard({ skill }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentUserId = user?.id;
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [pendingTopicId, setPendingTopicId] = useState(null);

  const skillId = getId(skill._id);
  const genTopics = useGenerateTopicsForSkill(skillId);

  const { mutate: upsertSkillStatus } = useUpsertSkillStatus();
  const { mutate: upsertTopicStatus } = useUpsertTopicStatus();

  // Query keys we will touch repeatedly
  const topicsKey = ["learning:topics", { skillId }];
  const skillKey = ["learning:skill", skillId];
  const skillsListKey = ["learning:skills"];

  // Fetch topics only when open, but keep previous to avoid flicker
  const {
    data: allTopics = [],
    isLoading: loadingTopics,
    isFetching: fetchingTopics,
    refetch: refetchTopics,
  } = useTopics(
    { skillId },
    {
      enabled: open,
      staleTime: 60_000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  // Defensive filter + unpack
  const topics = useMemo(() => {
    const filtered = (allTopics || []).filter((t) => getId(t.skillId) === skillId);
    return filtered.map(unpackTopic).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [allTopics, skillId]);

  // AI material only when open
  const { data: aiMaterial, isLoading: loadingAI, error: aiError } = useSkillAIContent(skillId, {
    enabled: open,
  });

  // Weighted progress by estimated_hours (fallback equal weights)
  const { totalHours, weightedProgress, completedCount, inProgressCount } = useMemo(() => {
    const hours = topics.reduce((sum, t) => sum + (t.estimated_hours || 0), 0);
    const denom = hours > 0 ? hours : topics.length || 1;
    const num =
      topics.length === 0
        ? 0
        : topics.reduce((acc, t) => {
            const w = hours > 0 ? (t.estimated_hours || 0) : 1;
            return acc + w * (Math.max(0, Math.min(100, t.progress || 0)) / 100);
          }, 0);
    const completed = topics.filter((t) => (t.status || "").toLowerCase() === "completed").length;
    const inProg = topics.filter((t) => (t.status || "").toLowerCase() === "in_progress").length;
    return {
      totalHours: topics.reduce((sum, t) => sum + (t.estimated_hours || 0), 0),
      weightedProgress: Math.round((num / denom) * 100),
      completedCount: completed,
      inProgressCount: inProg,
    };
  }, [topics]);

  // Derived status from topic progress
  const derivedStatus =
    topics.length === 0
      ? (skill.status ||
          (skill.progress >= 100 ? "completed" : skill.progress > 0 ? "in_progress" : "not_started")
        ).toLowerCase()
      : weightedProgress >= 100
      ? "completed"
      : weightedProgress > 0
      ? "in_progress"
      : "not_started";

  // Local cache patch helper to avoid global invalidations
  const patchSkillCaches = (status, progress) => {
    // Single skill cache
    queryClient.setQueryData(skillKey, (prev) =>
      prev ? { ...prev, status, progress } : prev
    );
    // Skills list cache
    queryClient.setQueryData(skillsListKey, (prev) => {
      if (!Array.isArray(prev)) return prev;
      return prev.map((s) => (getId(s._id) === skillId ? { ...s, status, progress } : s));
    });
  };

  // Persist derived skill state if different, but don't invalidate lists
  const lastPersisted = useRef(null);
  useEffect(() => {
    const key = `${derivedStatus}:${weightedProgress}`;
    if (!currentUserId || !skillId) return;
    if (lastPersisted.current === key) return;

    const serverStatus = (skill.status || "").toLowerCase();
    const serverProgress = Math.round(skill.progress || 0);

    if (serverStatus !== derivedStatus || serverProgress !== weightedProgress) {
      lastPersisted.current = key;
      // Optimistically patch local caches so parents don't refetch
      patchSkillCaches(derivedStatus, weightedProgress);

      upsertSkillStatus(
        { userId: currentUserId, skillId, status: derivedStatus, progress: weightedProgress },
        {
          onError: () => {
            // If server rejects, roll back to server-provided values
            patchSkillCaches(serverStatus, serverProgress);
          },
          // No global invalidations here. Let background fetches catch up later.
        }
      );
    }
  }, [
    currentUserId,
    skillId,
    derivedStatus,
    weightedProgress,
    skill.status,
    skill.progress,
    upsertSkillStatus,
    queryClient,
  ]);

  const handleGenerate = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    await genTopics.mutateAsync(
      { difficulty: skill.difficulty || "intermediate" },
      { onSuccess: () => refetchTopics() }
    );
  };

  // Handle navigation to skill detail page
  const handleNavigateToDetail = () => {
    navigate(`/career/plan/skills/${skillId}`);
  };

  // Centralized per-topic optimistic update to prevent flicker and parent refetch
  const updateTopic = (vars, e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    setPendingTopicId(vars.topicId);

    upsertTopicStatus(vars, {
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: topicsKey });
        const previous = queryClient.getQueryData(topicsKey);

        // Optimistically update the topic in cache
        queryClient.setQueryData(topicsKey, (old = []) =>
          old.map((t) =>
            getId(t._id) === vars.topicId
              ? { ...t, status: vars.status, progress: vars.progress }
              : t
          )
        );

        return { previous };
      },
      onError: (_err, _vars, ctx) => {
        if (ctx?.previous) queryClient.setQueryData(topicsKey, ctx.previous);
      },
      onSettled: () => {
        setPendingTopicId(null);
        // Light touch: refetch just this query in background, keepPreviousData avoids flashes
        queryClient.invalidateQueries({ queryKey: topicsKey, refetchType: "inactive" });
      },
    });
  };

  const displayDifficulty = (skill.difficulty || "intermediate").toLowerCase();

  return (
    <Card variant="elevated" padding="normal" borderRadius="xl" className="overflow-hidden border-0">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle size="lg" className="truncate text-gray-900">
              {skill.name}
            </CardTitle>
            <CardDescription className="mt-2 flex items-center gap-2 flex-wrap">
              <Tag variant={difficultyBadgeVariant(displayDifficulty)} className="mr-2">
                {displayDifficulty.charAt(0).toUpperCase() + displayDifficulty.slice(1)}
              </Tag>
              <Tag variant={
                derivedStatus === "completed" ? "success" : 
                derivedStatus === "in_progress" ? "warning" : "default"
              }>
                {statusLabel(derivedStatus)}
              </Tag>
              {open && topics.length > 0 ? (
                <span className="text-xs text-gray-500">
                  {topics.length} topic{topics.length > 1 ? "s" : ""} • {totalHours}h total
                </span>
              ) : null}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={(e) => { e.preventDefault(); setOpen((v) => !v); }} 
              type="button"
              className="rounded-full h-9 w-9 p-0 flex items-center justify-center border-gray-300"
            >
              {open ? "↑" : "↓"}
            </Button>
            <Button
              size="sm"
              onClick={handleNavigateToDetail}
              title="View skill details"
              type="button"
              variant="outline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </Button>
            <Button
              size="sm"
              onClick={handleGenerate}
              loading={genTopics.isPending}
              title="Regenerate topics for this skill"
              type="button"
              variant="premium"
            >
              Generate
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <Progress value={weightedProgress} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Overall Progress</span>
            <span>{weightedProgress}%</span>
          </div>
          {open && fetchingTopics && !loadingTopics ? (
            <p className="mt-1 text-xs text-gray-400">Updating…</p>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className={cn(open ? "pt-5" : "pt-0")}>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Topics Section */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide text-gray-500">Topics</h4>
                  {!loadingTopics && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); refetchTopics(); }}
                      className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Refresh
                    </button>
                  )}
                </div>

                {topics.length ? (
                  <TopicOverview
                    topics={topics}
                    loadingTopics={loadingTopics}
                    expandedTopic={expandedTopic}
                    setExpandedTopic={setExpandedTopic}
                    pendingTopicId={pendingTopicId}
                    updateTopic={updateTopic}
                    refetchTopics={refetchTopics}
                  />
                ) : (
                  <EmptyState 
                    title="No topics yet" 
                    subtitle="Generate topics for this skill to start learning."
                    action={
                      <Button onClick={handleGenerate} loading={genTopics.isPending} variant="premium">
                        Generate Topics
                      </Button>
                    }
                  />
                )}
              </section>

              {/* Stats Section */}
              {topics.length > 0 && (
                <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    {completedCount} completed
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    {inProgressCount} in progress
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    {topics.length - completedCount - inProgressCount} not started
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}