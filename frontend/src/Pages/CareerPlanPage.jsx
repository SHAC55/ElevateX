

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCareerPlan, startLearningJourney, getJourneyStatus } from '../api/career';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Button } from '../Components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/Card';

import SkillsSection from '../Components/AI/SkillsSection';
import RoadmapSection from '../Components/AI/RoadmapSection';
import ProjectsSection from '../Components/AI/ProjectsSection';
import ResourcesSection from '../Components/AI/ResourcesSection';
import FallbackNote from '../Components/AI/FallbackNote';

import {
  FaTools,
  FaProjectDiagram,
  FaBookOpen,
  FaChartLine,
  FaExclamationTriangle,
  FaRoute,
  FaCheckCircle,
  FaRocket,
} from 'react-icons/fa';

const Badge = ({ children }) => (
  <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25 ring-2 ring-white/30">
    {children}
  </span>
);

const SectionCard = ({ icon, title, children, tone = 'default' }) => {
  const toneMap = {
    default: 'from-white to-slate-50/80',
    amber: 'from-amber-50/80 to-amber-100/40',
  };

  return (
    <Card
      variant="elevated"
      className={`overflow-hidden border border-white/30 bg-gradient-to-br ${
        toneMap[tone] || toneMap.default
      } backdrop-blur-xl shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 rounded-2xl`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl tracking-tight font-serif font-semibold text-slate-900/90 flex items-center gap-3">
          <Badge>{icon}</Badge>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            {title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  );
};

const CareerPlanPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const preloadedPlan = location.state?.plan;
  const [plan, setPlan] = useState(preloadedPlan || null);
  const [loading, setLoading] = useState(!preloadedPlan);
  const [error, setError] = useState('');
  const [journeyStarted, setJourneyStarted] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        let planData = preloadedPlan;
        if (!planData) planData = await getCareerPlan();
        // eslint-disable-next-line no-console
        console.log('📋 Loaded plan:', planData);
        setPlan(planData);
        const status = await getJourneyStatus();
        setJourneyStarted(status.journeyStarted || false);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('❌ Error loading plan or journey status:', err);
        setError('Unable to load your AI-generated career plan.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [preloadedPlan]);

  if (loading)
    return (
      <div className="min-h-screen grid place-items-center px-6 bg-gradient-to-br from-indigo-50/40 via-white to-violet-50/40">
        <div className="text-center">
          <div className="relative mx-auto mb-6 h-16 w-16">
            <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 opacity-30 duration-1000" />
            <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30">
              <div className="h-8 w-8 bg-white/20 rounded-full animate-pulse" />
            </div>
          </div>
          <p className="text-slate-600 font-medium tracking-tight">Loading your AI-powered career plan…</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-50/40 via-white to-violet-50/40 px-6">
        <div className="text-center p-8 rounded-3xl border border-red-200/60 bg-white/80 backdrop-blur-xl shadow-2xl max-w-md">
          <div className="text-red-500 text-4xl mb-2">❌</div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">Something went wrong</h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );

  if (!plan)
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-50/40 via-white to-violet-50/40 px-6">
        <div className="text-center p-8 rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-2xl max-w-md">
          <div className="text-slate-500 text-4xl mb-2">📋</div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">No plan available</h2>
          <p className="text-slate-600">Please generate a career plan first.</p>
        </div>
      </div>
    );

  // Helpers
  const flattenSkills = () => {
    const skillObj = plan.skills || plan.raw?.skills || {};
    return Object.values(skillObj).flat().filter(s => typeof s === 'string' && s.trim() !== '');
  };

  const transformResources = () => {
    const resObj = plan.resources || plan.raw?.resources || {};
    return Object.entries(resObj).map(([key, value]) => ({
      type: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      list: Array.isArray(value) ? value : [],
    }));
  };

  const getSection = field => {
    const main = Array.isArray(plan[field]) ? plan[field] : [];
    const fallback = Array.isArray(plan.raw?.[field]) ? plan.raw[field] : [];
    return main.length ? main : fallback;
  };

  const skills = flattenSkills();
  const resources = transformResources();
  const roadmap = getSection('roadmap');
  const projects = getSection('projects');
  const careerOutlook = plan.career_outlook || plan.raw?.career_outlook || null;

  const handleStartJourney = async () => {
    if (journeyStarted) {
      toast.info('Journey already started. Redirecting to learning page...');
      navigate('/career/plan/skills');
      return;
    }
    try {
      const res = await startLearningJourney();
      if (res.message === 'Journey already started') {
        toast.warn('Journey already started');
        setJourneyStarted(true);
        navigate('/career/plan/skills');
      } else {
        toast.success(res.message || 'Journey started!');
        setJourneyStarted(true);
        navigate('/career/plan/skills');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error starting journey', err);
      toast.error('Failed to start learning journey');
    }
  };

  return (
    <div className="min-h-screen relative px-4 py-10 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50/40 via-white to-violet-50/40">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/50 bg-white/70 backdrop-blur-xl px-4 py-2 text-sm font-medium text-slate-700 shadow-md mb-6">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
            AI-Powered Career Blueprint
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-serif font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700">
            Your Personalized Career Plan
          </h1>
          <p className="mt-3 text-lg text-slate-600/90 max-w-2xl mx-auto">
            A comprehensive roadmap designed by AI to guide your professional development journey
          </p>
        </div>

        <div className="space-y-8">
          {skills.length > 0 && (
            <SectionCard icon={<FaTools />} title="Skills to Learn">
              <SkillsSection skills={skills} />
            </SectionCard>
          )}

          {roadmap.length > 0 && (
            <SectionCard icon={<FaRoute />} title="Learning Roadmap">
              <RoadmapSection roadmap={roadmap} />
            </SectionCard>
          )}

          {projects.length > 0 && (
            <SectionCard icon={<FaProjectDiagram />} title="Portfolio Projects">
              <ProjectsSection projects={projects} />
            </SectionCard>
          )}

          {resources.length > 0 && (
            <SectionCard icon={<FaBookOpen />} title="Learning Resources">
              <ResourcesSection resources={resources} />
            </SectionCard>
          )}

          {careerOutlook && (
            <SectionCard icon={<FaChartLine />} title="Career Outlook">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-indigo-200/40 bg-gradient-to-br from-indigo-50 to-indigo-100/30 p-5 backdrop-blur">
                  <h3 className="font-medium text-indigo-700 mb-2">Potential Roles</h3>
                  <ul className="text-sm text-slate-700 space-y-1">
                    {careerOutlook.roles?.map((role, i) => (
                      <li key={i}>• {role}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-emerald-200/40 bg-gradient-to-br from-emerald-50 to-emerald-100/30 p-5 backdrop-blur">
                  <h3 className="font-medium text-emerald-700 mb-2">Salary Range</h3>
                  <p className="text-sm text-slate-700">{careerOutlook.salary_range}</p>
                </div>
                <div className="rounded-2xl border border-fuchsia-200/40 bg-gradient-to-br from-fuchsia-50 to-fuchsia-100/30 p-5 backdrop-blur">
                  <h3 className="font-medium text-fuchsia-700 mb-2">Industry Trends</h3>
                  <ul className="text-sm text-slate-700 space-y-1">
                    {careerOutlook.industry_trends?.map((trend, i) => (
                      <li key={i}>• {trend}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </SectionCard>
          )}

          {/* Start Journey CTA */}
          <div className="sticky bottom-6 z-10 mt-16 flex justify-center">
            {/* glassy pill wrapper */}
            <div className="rounded-full bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl p-1.5 inline-flex">
              <Button
                onClick={handleStartJourney}
                size="lg"
                variant={journeyStarted ? 'outline' : 'premium'}
                className={`rounded-full px-8 py-4 text-lg font-medium tracking-tight transition-all inline-flex items-center justify-center gap-2
                  ${
                    journeyStarted
                      ? '!bg-transparent !border-slate-300/60 !text-slate-800 !rounded-full !shadow-none hover:!border-slate-400/70'
                      : 'shadow-lg hover:shadow-xl'
                  }`}
              >
                {journeyStarted ? (
                  <>
                    <FaCheckCircle className="text-emerald-600" />
                    <span>Journey Already Started</span>
                  </>
                ) : (
                  <>
                    <FaRocket />
                    <span>Start Learning Journey</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastClassName="rounded-xl font-sans bg-white/90 backdrop-blur-xl border border-white/40 shadow-lg"
        progressClassName="bg-gradient-to-r from-indigo-500 to-fuchsia-500"
      />
    </div>
  );
};

export default CareerPlanPage;
