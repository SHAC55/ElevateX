

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import SkillContent from "./SkillContent";
import TopicOverview from "./TopicOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { Skeleton } from "../ui/Skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faClock,
  faBullseye,
  faGraduationCap,
  faLightbulb,
  faSitemap,
  faCrown,
  faMedal,
  faRocket,
  faArrowDown,
  faExpand,
  faCompress
} from "@fortawesome/free-solid-svg-icons";

const cn = (...c) => c.filter(Boolean).join(" ");

const difficultyBadgeVariant = (d) => {
  const val = (d || "").toLowerCase();
  if (["beginner", "easy", "foundation"].includes(val)) return "success";
  if (["advanced", "hard", "expert"].includes(val)) return "danger";
  return "warning";
};

export default function SkillDetailComponent({
  skill,
  topics,
  loadingTopics,
  fetchingTopics,
  refetchTopics,
  aiMaterial,
  loadingAI,
  aiError,
  onRetryAI,
  onUpdateTopic,
  onExpandChange,
  isExpanded
}) {
  const prefersReducedMotion = useReducedMotion();
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [pendingTopicId, setPendingTopicId] = useState(null);
  const [activeTab, setActiveTab] = useState("topics");
  const scrollTargetRef = useRef(null);

  // Toggle expanded view
  const toggleExpanded = () => {
    if (onExpandChange) {
      onExpandChange(!isExpanded);
    }
  };

  // Derived: next actionable
  const nextTopic = useMemo(() => {
    return (
      (topics || []).find((t) => (t.status || "").toLowerCase() === "in_progress") ||
      (topics || []).find((t) => (t.status || "").toLowerCase() === "not_started") ||
      null
    );
  }, [topics]);

  // Stats
  const { totalHours, weightedProgress, completedCount, inProgressCount } = useMemo(() => {
    const list = topics || [];
    const hours = list.reduce((sum, t) => sum + (t.estimated_hours || 0), 0);
    const denom = hours > 0 ? hours : list.length || 1;
    const num =
      list.length === 0
        ? 0
        : list.reduce((acc, t) => {
            const w = hours > 0 ? (t.estimated_hours || 0) : 1;
            const p = Math.max(0, Math.min(100, t.progress || 0)) / 100;
            return acc + w * p;
          }, 0);
    const completed = list.filter((t) => (t.status || "").toLowerCase() === "completed").length;
    const inProg = list.filter((t) => (t.status || "").toLowerCase() === "in_progress").length;
    return {
      totalHours: hours,
      weightedProgress: Math.round((num / denom) * 100),
      completedCount: completed,
      inProgressCount: inProg
    };
  }, [topics]);

  // Smooth scroll with retries
  const scrollToTopicWithRetries = (topicId, attempts = 10) => {
    if (!topicId || attempts <= 0) return;
    const el = document.getElementById(`topic-${topicId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setTimeout(() => scrollToTopicWithRetries(topicId, attempts - 1), 100);
    }
  };

  const handleContinueLearning = () => {
    if (!nextTopic) return;
    setActiveTab("topics");
    setExpandedTopic(nextTopic._id);
    scrollTargetRef.current = nextTopic._id;
    setTimeout(() => scrollToTopicWithRetries(scrollTargetRef.current), 50);
  };

  // Scroll when expanded changes
  useEffect(() => {
    if (expandedTopic) {
      const id = expandedTopic;
      const t = setTimeout(() => scrollToTopicWithRetries(id), 150);
      return () => clearTimeout(t);
    }
  }, [expandedTopic]);

  // Wrap onUpdateTopic to handle pending state neatly
  const updateTopic = (vars, e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setPendingTopicId(vars.topicId);
    Promise.resolve(onUpdateTopic?.(vars)).finally(() => setPendingTopicId(null));
  };

  const displayDifficulty = (skill.difficulty || "intermediate").toLowerCase();
  const springy = prefersReducedMotion ? {} : { type: "spring", stiffness: 260, damping: 24 };

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
          <div className="flex items-center justify-between rounded-2xl border bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 px-4 py-3 ">
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-600 ml-2">
                <FontAwesomeIcon icon={faBookOpen} className="h-3.5 w-3.5" />
                <span>{topics?.length || 0} topics</span>
                <span>•</span>
                <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5" />
                <span>{totalHours}h</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {nextTopic ? (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="hidden sm:block">
                  <Button
                    size="sm"
                    variant="premium"
                    onClick={handleContinueLearning}
                    className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:shadow-lg transition-shadow"
                    title="Jump to next topic"
                  >
                    <FontAwesomeIcon icon={faRocket} className="mr-2" />
                    Continue Learning
                  </Button>
                </motion.div>
              ) : null}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleExpanded}
                className="p-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                title={isExpanded ? "Collapse view" : "Expand view"}
              >
                <FontAwesomeIcon icon={isExpanded ? faCompress : faExpand} className="h-4 w-4" />
              </motion.button>
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
                <Badge variant={difficultyBadgeVariant(displayDifficulty)} className="px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
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
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
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
                    />
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
                        {Math.max(0, (topics?.length || 0) - completedCount - inProgressCount)}
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
            <TabsList className="flex mb-6 p-0 border-b border-gray-200 rounded-none gap-0 bg-transparent">
              <TabsTrigger
                value="topics"
                className="flex-1 justify-center rounded-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-700 bg-transparent shadow-none border-b-2 border-transparent py-3 font-sans"
              >
                <FontAwesomeIcon icon={faBookOpen} className="h-4 w-4 mr-2" />
                Learning Path
              </TabsTrigger>
              <TabsTrigger
                value="blog"
                className="flex-1 justify-center rounded-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-700 bg-transparent shadow-none border-b-2 border-transparent py-3 font-sans"
              >
                <FontAwesomeIcon icon={faGraduationCap} className="h-4 w-4 mr-2" />
                Study Material
              </TabsTrigger>
            </TabsList>

            <TabsContent value="topics" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
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
                    ) : (topics?.length || 0) > 0 ? (
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
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
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
              onClick={handleContinueLearning}
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