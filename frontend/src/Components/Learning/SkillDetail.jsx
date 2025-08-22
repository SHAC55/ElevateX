
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useSkill,
  useTopics,
  useSkillAIContent,
  useUpsertTopicStatus,
} from "../../hooks/useLearning";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Progress } from "../ui/Progress";
import SkillContent from "./SkillContent";
import TopicOverview from "./TopicOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { Skeleton } from "../ui/Skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faClock,
  faBullseye,
  faRotate,
  faArrowLeft,
  faGraduationCap,
  faLightbulb,
  faSitemap,
  faCheckCircle,
  faPlayCircle,
  faCircle,
  faArrowDown,
  faCrown,
  faMedal,
  faRocket,
  faFire
} from "@fortawesome/free-solid-svg-icons";

const cn = (...c) => c.filter(Boolean).join(" ");
const getId = (v) => (typeof v === "string" ? v : v?._id || v?.toString?.() || "");

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const slideUp = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

// normalize hook return shape
const normalizeTopicsResponse = (resp) =>
  Array.isArray(resp) ? resp : Array.isArray(resp?.items) ? resp.items : [];

// safe unpack for topic rows
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

  return {
    ...t,
    name: t.name || payload.name || "Unnamed Topic",
    difficulty,
    estimated_hours,
    objectives,
    status,
    progress,
  };
};

const difficultyBadgeVariant = (d) => {
  const val = (d || "").toLowerCase();
  if (["beginner", "easy", "foundation"].includes(val)) return "success";
  if (["advanced", "hard", "expert"].includes(val)) return "danger";
  return "warning";
};

const statusLabel = (s) => (s || "").replaceAll("_", " ");

export default function SkillDetailPage() {
  const { skillId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const prefersReducedMotion = useReducedMotion();

  const [expandedTopic, setExpandedTopic] = useState(null);
  const [pendingTopicId, setPendingTopicId] = useState(null);
  const [activeTab, setActiveTab] = useState("topics");

  // 1) Skill
  const { data: skill, isLoading: loadingSkill, error: skillError } = useSkill(skillId);

  // 2) Topics
  const {
    data: topicsResp,
    isLoading: loadingTopics,
    isFetching: fetchingTopics,
    refetch: refetchTopics,
  } = useTopics(
    { skillId },
    {
      enabled: true,
      staleTime: 60_000,
      keepPreviousData: true,
    }
  );

  const allTopicsRaw = normalizeTopicsResponse(topicsResp);

  // Filter + normalize topics
  const topics = useMemo(() => {
    const filtered = (allTopicsRaw || []).filter((t) => getId(t.skillId) === skillId);
    return filtered.map(unpackTopic).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [allTopicsRaw, skillId]);

  // Next actionable topic helper
  const nextTopic = useMemo(() => {
    return (
      topics.find((t) => t.status === "in_progress") ||
      topics.find((t) => t.status === "not_started") ||
      null
    );
  }, [topics]);

  // 3) AI material
  const { data: aiMaterial, isLoading: loadingAI, error: aiError } = useSkillAIContent(skillId, {
    enabled: true,
  });

  // 4) Update topic status with optimistic UI
  const { mutate: upsertTopicStatus } = useUpsertTopicStatus();
  const updateTopic = (vars, e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    setPendingTopicId(vars.topicId);

    const queryKey = ["learning:topics", { skillId }];
    upsertTopicStatus(vars, {
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey });
        const previous = queryClient.getQueryData(queryKey);
        queryClient.setQueryData(queryKey, (old = []) =>
          old.map((t) =>
            getId(t._id) === vars.topicId ? { ...t, status: vars.status, progress: vars.progress } : t
          )
        );
        return { previous };
      },
      onError: (_err, _vars, ctx) => {
        if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
      },
      onSettled: () => {
        setPendingTopicId(null);
        queryClient.invalidateQueries({ queryKey, refetchType: "inactive" });
      },
    });
  };

  // 5) Progress stats
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

  // Scroll to next topic when expanded
  useEffect(() => {
    if (expandedTopic && nextTopic && expandedTopic === nextTopic._id) {
      setTimeout(() => {
        const element = document.getElementById(`topic-${expandedTopic}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [expandedTopic, nextTopic]);

  // 6) Loading / error states
  if (loadingSkill) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
        <div className="text-lg flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FontAwesomeIcon icon={faRotate} className="h-5 w-5" />
          </motion.div>
          Loading skill details...
        </div>
      </div>
    );
  }
  if (skillError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
        <div className="text-lg text-red-500">Error loading skill: {skillError.message}</div>
      </div>
    );
  }
  if (!skill) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
        <div className="text-lg">Skill not found</div>
      </div>
    );
  }

  const displayDifficulty = (skill.difficulty || "intermediate").toLowerCase();

  // animation helpers
  const springy = prefersReducedMotion
    ? {}
    : { type: "spring", stiffness: 260, damping: 24 };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Sticky toolbar */}
        <motion.div 
          className="sticky top-4 z-20 mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...springy, delay: 0.1 }}
        >
          <div className="flex items-center justify-between rounded-2xl border bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 px-4 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-all"
                  aria-label="Go back"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              </motion.div>
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-600 ml-2">
                <FontAwesomeIcon icon={faBookOpen} className="h-3.5 w-3.5" />
                <span>{topics.length} topics</span>
                <span>•</span>
                <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5" />
                <span>{totalHours}h</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {nextTopic ? (
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="hidden sm:block"
                >
                  <Button
                    size="sm"
                    variant="premium"
                    onClick={() => setExpandedTopic(nextTopic._id)}
                    className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:shadow-lg transition-shadow"
                    title="Jump to next topic"
                  >
                    <FontAwesomeIcon icon={faRocket} className="mr-2" />
                    Continue Learning
                  </Button>
                </motion.div>
              ) : null}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchTopics()}
                  disabled={fetchingTopics}
                  className="rounded-full border-gray-300 bg-white/80"
                  aria-live="polite"
                >
                  <FontAwesomeIcon 
                    icon={fetchingTopics ? faRotate : faRotate} 
                    className={cn("mr-2", fetchingTopics && "animate-spin")} 
                  />
                  Refresh
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Page header */}
        <motion.div
          initial={{ y: prefersReducedMotion ? 0 : 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: springy }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight font-serif bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                {skill.name}
              </h1>
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <Badge 
                  variant={difficultyBadgeVariant(displayDifficulty)} 
                  className="px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                >
                  {displayDifficulty.charAt(0).toUpperCase() + displayDifficulty.slice(1)}
                </Badge>
                <span className="text-sm text-gray-600 font-light flex items-center">
                  <FontAwesomeIcon icon={faMedal} className="h-4 w-4 mr-1.5 text-amber-500" />
                  Mastery path
                </span>
              </div>
            </div>
            {weightedProgress === 100 && (
              <motion.div 
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="hidden lg:flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg"
              >
                <FontAwesomeIcon icon={faCrown} className="h-7 w-7 text-white" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Progress card */}
        <motion.div
          initial={{ y: prefersReducedMotion ? 0 : 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { ...springy, delay: 0.1 } }}
          className="mb-8"
        >
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/40 to-indigo-50/40 z-0"></div>
            <div className="relative z-10">
              <CardHeader className="pb-4">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <CardTitle className="flex items-center gap-2 font-sans text-gray-800">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FontAwesomeIcon icon={faBullseye} className="h-5 w-5 text-blue-600" />
                    </motion.div>
                    Overall Progress
                  </CardTitle>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-mono">
                      {weightedProgress}%
                    </span>
                    <span className="text-sm text-gray-500">complete</span>
                  </div>
                </div>
                <CardDescription className="font-sans">Your journey to mastering {skill.name}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-5">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative"
                      initial={{ width: 0 }}
                      animate={{ width: `${weightedProgress}%` }}
                      transition={{ duration: prefersReducedMotion ? 0 : 1.5, ease: "easeOut", delay: 0.3 }}
                    >
                      {weightedProgress > 0 && weightedProgress < 100 && (
                        <motion.div 
                          className="absolute right-0 top-0 h-full w-1 bg-white/50"
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-green-50 rounded-xl p-3 shadow-sm">
                      <div className="text-2xl font-bold text-green-700 font-mono">{completedCount}</div>
                      <div className="text-xs text-green-600 mt-1 uppercase tracking-wide font-medium">Completed</div>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-3 shadow-sm">
                      <div className="text-2xl font-bold text-amber-700 font-mono">{inProgressCount}</div>
                      <div className="text-xs text-amber-600 mt-1 uppercase tracking-wide font-medium">In Progress</div>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-3 shadow-sm">
                      <div className="text-2xl font-bold text-gray-700 font-mono">
                        {Math.max(0, topics.length - completedCount - inProgressCount)}
                      </div>
                      <div className="text-xs text-gray-600 mt-1 uppercase tracking-wide font-medium">Not Started</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ y: prefersReducedMotion ? 0 : 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { ...springy, delay: 0.2 } }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/70 backdrop-blur rounded-2xl border border-gray-200/60 p-1.5 shadow-sm">
              <TabsTrigger
                value="topics"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-gray-200/50 transition-all duration-300 font-sans data-[state=active]:text-gray-900 py-3"
              >
                <FontAwesomeIcon icon={faBookOpen} className="h-4 w-4 mr-2" />
                Learning Path
              </TabsTrigger>
              <TabsTrigger
                value="blog"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-gray-200/50 transition-all duration-300 font-sans data-[state=active]:text-gray-900 py-3"
              >
                <FontAwesomeIcon icon={faGraduationCap} className="h-4 w-4 mr-2" />
                Study Material
              </TabsTrigger>
            </TabsList>

            <TabsContent value="topics" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-0 shadow-lg overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                    <CardTitle className="flex items-center gap-2 font-sans">
                      <FontAwesomeIcon icon={faSitemap} className="h-5 w-5 text-blue-600" />
                      Learning Journey
                    </CardTitle>
                    <CardDescription className="font-sans">
                      Master {skill.name} by completing these structured topics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {loadingTopics ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-4 border rounded-xl bg-white/60">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        ))}
                      </div>
                    ) : topics.length > 0 ? (
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
                      <div className="text-center py-10">
                        <FontAwesomeIcon icon={faLightbulb} className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2 font-sans">No topics yet</h3>
                        <p className="text-gray-500 mb-4 font-sans">
                          Topics will appear here once they're generated for this skill.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="blog">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-0 shadow-lg overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                    <CardTitle className="flex items-center gap-2 font-sans">
                      <FontAwesomeIcon icon={faGraduationCap} className="h-5 w-5 text-blue-600" />
                      Knowledge Center
                    </CardTitle>
                    <CardDescription className="font-sans">
                      Comprehensive resources to accelerate your learning
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <SkillContent loadingAI={loadingAI} aiError={aiError} aiMaterial={aiMaterial} />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Floating action button for mobile */}
        {nextTopic && (
          <motion.div 
            className="fixed bottom-6 right-6 z-30 lg:hidden"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              variant="premium"
              onClick={() => setExpandedTopic(nextTopic._id)}
              className="rounded-full shadow-lg h-14 w-14 p-0 bg-gradient-to-r from-indigo-600 to-purple-600"
              title="Jump to next topic"
            >
              <FontAwesomeIcon icon={faArrowDown} className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}



