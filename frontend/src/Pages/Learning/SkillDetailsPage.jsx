

// src/pages/SkillDetailPage.jsx
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSkill, useSkillAIContent } from '../../hooks/useLearning';
import SkillDetail from '../../Components/Learning/SkillDetail';
import { motion, AnimatePresence } from 'framer-motion';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faBolt,
  faSyncAlt,
  faTriangleExclamation,
  faCircleInfo,
  faCheckCircle,
  faBookOpen,
  faClock,
  faCircleNotch,
  faStar,
  faCrown,
  faGraduationCap,
  faLightbulb
} from '@fortawesome/free-solid-svg-icons';

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gradient-to-r from-slate-100 to-slate-200 rounded ${className}`} />;
}

function HeaderSkeleton() {
  return (
    <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-br from-indigo-50/80 to-blue-50/80 border border-indigo-100 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-2/3 mb-3" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

function ErrorBanner({ title = 'Something went wrong', message, onRetry }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 bg-rose-50 border border-rose-200 text-rose-800 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <FontAwesomeIcon icon={faTriangleExclamation} className="h-5 w-5 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold">{title}</p>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-rose-300 text-rose-800 hover:bg-rose-100 text-sm transition-colors"
          >
            <FontAwesomeIcon icon={faSyncAlt} className="h-3 w-3" />
            Retry
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default function SkillDetailPage() {
  const { skillId } = useParams();
  const [activeTab, setActiveTab] = useState('content');

  // Fetch skill
  const {
    data: skill,
    isLoading: loadingSkill,
    error: skillError,
    refetch: refetchSkill
  } = useSkill(skillId);

  // Fetch AI content
  const {
    data: aiMaterial,
    isLoading: loadingAI,
    error: aiError,
    refetch: refetchAI
  } = useSkillAIContent(skillId);

  // On mount or skill change, refresh both. Guard against double fire.
  useEffect(() => {
    refetchSkill();
    refetchAI();
    // keyboard shortcut: R to refresh AI block
    const onKey = (e) => {
      if ((e.key === 'r' || e.key === 'R') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        refetchAI();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [skillId, refetchSkill, refetchAI]);

  const cachedInfo = useMemo(() => {
    // Handle both shapes: either your new normalized API or old one
    const material = aiMaterial?.material || aiMaterial;
    return {
      cached: Boolean(material?.cached ?? aiMaterial?.cached),
      json: material?.json || null,
      text: material?.text || material?.content || '',
      hasData:
        Boolean(material?.json) ||
        typeof material?.text === 'string' && material?.text.trim().length > 0
    };
  }, [aiMaterial]);

  const onHardRefresh = useCallback(() => {
    refetchSkill();
    refetchAI();
  }, [refetchSkill, refetchAI]);

  // Top-level fatal skill load states
  if (loadingSkill && !skill) {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            Back
          </Link>
        </div>
        <HeaderSkeleton />
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2">
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (skillError) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            Back
          </Link>
        </div>
        <ErrorBanner
          title="Failed to load skill"
          message={skillError.message || 'Please try again.'}
          onRetry={refetchSkill}
        />
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            Back
          </Link>
        </div>
        <div className="rounded-2xl p-6 bg-slate-50 border border-slate-200">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon icon={faCircleInfo} className="h-5 w-5 text-slate-600 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">Skill not found</p>
              <p className="text-sm text-slate-600">Either it was removed or the link is incorrect.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Page header content
  const difficulty = skill.difficulty || cachedInfo.json?.difficulty || 'intermediate';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-4 md:p-8 max-w-7xl mx-auto space-y-6"
    >
      {/* Breadcrumb / Back */}
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
          Back to Skills
        </Link>
      </div>

      {/* Header Card */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-6 md:p-8 bg-gradient-to-br from-indigo-50/80 to-blue-50/80 border border-indigo-100 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-slate-600 mb-2">
              <FontAwesomeIcon icon={faBookOpen} className="h-4 w-4" />
              <span className="text-sm font-medium">Skill Development</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              {skill.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium shadow-sm">
                <FontAwesomeIcon icon={faStar} className="h-4 w-4 text-amber-500" />
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
              {cachedInfo.cached && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
                  <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4" />
                  AI content cached
                </span>
              )}
              {loadingAI && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-medium">
                  <FontAwesomeIcon icon={faCircleNotch} className="h-4 w-4 animate-spin" />
                  Generating AI content
                </span>
              )}
              {aiError && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="h-4 w-4" />
                  AI content failed
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refetchSkill}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium transition-colors shadow-sm"
              title="Refresh skill"
            >
              <FontAwesomeIcon icon={faSyncAlt} className="h-4 w-4" />
              Refresh
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refetchAI}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 text-sm font-medium transition-all shadow-md"
              title="Regenerate AI Content (Ctrl/Cmd+R)"
            >
              <FontAwesomeIcon icon={faBolt} className="h-4 w-4" />
              Regenerate AI
            </motion.button>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 text-sm text-slate-600 p-3 bg-white/50 rounded-lg">
          <FontAwesomeIcon icon={faCircleInfo} className="h-4 w-4 flex-shrink-0" />
          <span>Auto-saves best version. Use Ctrl/Cmd+R to regenerate AI content.</span>
        </div>
      </motion.section>

      {/* Tab Navigation */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex border-b border-slate-200"
      >
        <button
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'content' 
              ? 'border-indigo-500 text-indigo-700' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setActiveTab('content')}
        >
          <FontAwesomeIcon icon={faGraduationCap} className="mr-2 h-4 w-4" />
          Learning Content
        </button>
        <button
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'ai' 
              ? 'border-indigo-500 text-indigo-700' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setActiveTab('ai')}
        >
          <FontAwesomeIcon icon={faLightbulb} className="mr-2 h-4 w-4" />
          AI Assistant
        </button>
      </motion.div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6"
        >
          {activeTab === 'content' ? (
            <>
              {/* Main panel */}
              <div className="lg:col-span-3">
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                  <SkillDetail
                    skill={skill}
                    aiMaterial={aiMaterial}
                    loadingAI={loadingAI}
                    aiError={aiError}
                    onRetry={refetchAI}
                  />
                </div>
              </div>

              {/* Sidebar: Progress & status */}
              <aside className="space-y-6">
                {/* Progress card */}
                <div className="rounded-2xl p-5 bg-white border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 grid place-items-center">
                      <FontAwesomeIcon icon={faCrown} className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Mastery Progress</p>
                      <p className="text-sm text-slate-600">Track your learning journey</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-3/4"></div>
                    </div>
                    <div className="flex justify-between text-sm text-slate-700">
                      <span>75% Complete</span>
                      <span>12/16 Topics</span>
                    </div>
                  </div>
                </div>

                {/* Stats card */}
                <div className="rounded-2xl p-5 bg-white border border-slate-200 shadow-sm">
                  <p className="font-semibold text-slate-900 mb-4">Learning Stats</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Time invested</span>
                      <span className="text-sm font-medium text-slate-900">8h 45m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Last studied</span>
                      <span className="text-sm font-medium text-slate-900">2 days ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Mastery level</span>
                      <span className="text-sm font-medium text-slate-900">Intermediate</span>
                    </div>
                  </div>
                </div>

                {/* Tips card */}
                <div className="rounded-2xl p-5 bg-slate-50 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faCircleInfo} className="h-5 w-5 text-slate-700 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Learning Tips</p>
                      <ul className="mt-2 space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-500 mt-0.5">•</span>
                          <span>Focus on one topic at a time</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-500 mt-0.5">•</span>
                          <span>Practice for at least 30 minutes daily</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-500 mt-0.5">•</span>
                          <span>Review previous topics weekly</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </aside>
            </>
          ) : (
            <>
              {/* AI Assistant Panel */}
              <div className="lg:col-span-3">
                <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 grid place-items-center">
                      <FontAwesomeIcon icon={faLightbulb} className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">AI Learning Assistant</h2>
                      <p className="text-sm text-slate-600">Get personalized guidance for {skill.name}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-700">Ask me anything about {skill.name}...</p>
                    </div>

                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        Explain like I'm beginner
                      </button>
                      <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        Give me a practice exercise
                      </button>
                      <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        Common mistakes to avoid
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Status Sidebar */}
              <aside className="space-y-6">
                {/* AI status card */}
                <div className="rounded-2xl p-5 bg-white border border-slate-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="shrink-0">
                      <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 grid place-items-center">
                        <FontAwesomeIcon icon={faBolt} className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">AI Material Status</p>
                      <p className="text-sm text-slate-600 mt-1">
                        {loadingAI
                          ? 'Generating structured study material...'
                          : aiError
                            ? 'Failed to fetch content. Try regenerating.'
                            : cachedInfo.hasData
                              ? 'Ready to study. Cached for speed.'
                              : 'No content yet. Generate to get started.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={refetchAI}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 text-sm font-medium transition-all shadow-md"
                    >
                      <FontAwesomeIcon icon={faBolt} className="h-4 w-4" />
                      {loadingAI ? 'Generating...' : 'Generate Content'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onHardRefresh}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm text-slate-800 transition-colors"
                    >
                      <FontAwesomeIcon icon={faSyncAlt} className="h-4 w-4" />
                      Hard Refresh All
                    </motion.button>
                  </div>

                  {aiError && (
                    <div className="mt-4">
                      <ErrorBanner
                        title="AI content error"
                        message={aiError?.response?.data?.message || aiError.message || 'Unknown error'}
                        onRetry={refetchAI}
                      />
                    </div>
                  )}
                </div>

                {/* Tips card */}
                <div className="rounded-2xl p-5 bg-slate-50 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faCircleInfo} className="h-5 w-5 text-slate-700 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">AI Assistant Tips</p>
                      <ul className="mt-2 space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-500 mt-0.5">•</span>
                          <span>Be specific with your questions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-500 mt-0.5">•</span>
                          <span>Ask for examples to clarify concepts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-500 mt-0.5">•</span>
                          <span>Request practice exercises to test your knowledge</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </aside>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
