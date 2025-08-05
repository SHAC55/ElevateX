
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getCareerPlan } from '../api/career';

import SkillsSection from "../Components/AI/SkillsSection";
import RoadmapSection from "../Components/AI/RoadmapSection";
import ProjectsSection from "../Components/AI/ProjectsSection";
import ResourcesSection from "../Components/AI/ResourcesSection";
import FallbackNote from "../Components/AI/FallbackNote";

const CareerPlanPage = () => {
  const location = useLocation();
  const preloadedPlan = location.state?.plan;

  const [plan, setPlan] = useState(preloadedPlan || null);
  const [loading, setLoading] = useState(!preloadedPlan);
  const [error, setError] = useState('');

  useEffect(() => {
    if (preloadedPlan) return;

    const fetchPlan = async () => {
      try {
        const res = await getCareerPlan();
        setPlan(res);
      } catch (err) {
        console.error('Failed to fetch career plan:', err);
        setError('Unable to load your AI-generated career plan.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [preloadedPlan]);

  if (loading) return <div className="p-6 text-center">Loading your AI-powered career plan...</div>;
  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;
  if (!plan) return <div className="p-6 text-center">No plan available. Please generate one first.</div>;

  // ✅ Normalize Skills: Convert object of arrays to flat string array
  const flattenSkills = () => {
    const skillObj = plan.skills || plan.raw?.skills || {};
    return Object.values(skillObj)
      .flat()
      .filter(s => typeof s === 'string' && s.trim() !== '');
  };

  // ✅ Normalize Resources: Convert object of arrays to [{ type, list }]
  const transformResources = () => {
    const resObj = plan.resources || plan.raw?.resources || {};
    return Object.entries(resObj).map(([key, value]) => ({
      type: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      list: Array.isArray(value) ? value : []
    }));
  };

  // ✅ Roadmap, Projects with fallback support
  const getSection = (field) => {
    const main = Array.isArray(plan[field]) ? plan[field] : [];
    const fallback = Array.isArray(plan.raw?.[field]) ? plan.raw[field] : [];
    return main.length ? main : fallback;
  };

  const skills = flattenSkills();
  const resources = transformResources();
  const roadmap = getSection('roadmap');
  const projects = getSection('projects');

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-10 bg-[#f2f4ff] rounded-xl shadow-md mt-10">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
        🎯 Your Personalized Career Plan
      </h1>

      {/* Skills */}
      {skills.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-10 mb-3">🛠 Skills to Learn</h2>
          <SkillsSection skills={skills} />
        </>
      )}

      {/* Roadmap */}
      {roadmap.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-10 mb-3">🛤 Roadmap</h2>
          <RoadmapSection roadmap={roadmap} />
        </>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-10 mb-3">📁 Projects</h2>
          <ProjectsSection projects={projects} />
        </>
      )}

      {/* Resources */}
      {resources.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-10 mb-3">📚 Resources</h2>
          <ResourcesSection resources={resources} />
        </>
      )}

      {/* Raw fallback note */}
      {plan.note && Object.keys(plan.raw || {}).length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-10 mb-2 text-yellow-700">⚠️ AI Fallback Notice</h2>
          <FallbackNote note={plan.note} raw={plan.raw} />
        </>
      )}
    </div>
  );
};

export default CareerPlanPage;
