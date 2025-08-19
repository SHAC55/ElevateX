

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCareerPlan, startLearningJourney, getJourneyStatus } from '../api/career';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SkillsSection from "../Components/AI/SkillsSection";
import RoadmapSection from "../Components/AI/RoadmapSection";
import ProjectsSection from "../Components/AI/ProjectsSection";
import ResourcesSection from "../Components/AI/ResourcesSection";
import FallbackNote from "../Components/AI/FallbackNote";

const CareerPlanPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const preloadedPlan = location.state?.plan;
  const [plan, setPlan] = useState(preloadedPlan || null);
  const [loading, setLoading] = useState(!preloadedPlan);
  const [error, setError] = useState('');
  const [journeyStarted, setJourneyStarted] = useState(false);

  // Fetch career plan + journey status
  useEffect(() => {
    const fetchAll = async () => {
      try {
        let planData = preloadedPlan;
        if (!planData) {
          planData = await getCareerPlan();
        }
        console.log("📋 Loaded plan:", planData);

        setPlan(planData);

        const status = await getJourneyStatus();
        setJourneyStarted(status.journeyStarted || false);
      } catch (err) {
        console.error('❌ Error loading plan or journey status:', err);
        setError('Unable to load your AI-generated career plan.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [preloadedPlan]);

  if (loading) return <div className="p-6 text-center">Loading your AI-powered career plan...</div>;
  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;
  if (!plan) return <div className="p-6 text-center">No plan available. Please generate one first.</div>;

  // Helpers
  const flattenSkills = () => {
    const skillObj = plan.skills || plan.raw?.skills || {};
    return Object.values(skillObj)
      .flat()
      .filter(s => typeof s === 'string' && s.trim() !== '');
  };

  const transformResources = () => {
    const resObj = plan.resources || plan.raw?.resources || {};
    return Object.entries(resObj).map(([key, value]) => ({
      type: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      list: Array.isArray(value) ? value : []
    }));
  };

  const getSection = (field) => {
    const main = Array.isArray(plan[field]) ? plan[field] : [];
    const fallback = Array.isArray(plan.raw?.[field]) ? plan.raw[field] : [];
    return main.length ? main : fallback;
  };

  const skills = flattenSkills();
  const resources = transformResources();
  const roadmap = getSection('roadmap');
  const projects = getSection('projects');
  const careerOutlook = plan.career_outlook || plan.raw?.career_outlook || null;

  // Start journey
  const handleStartJourney = async () => {
    if (journeyStarted) {
      toast.info("Journey already started. Redirecting to learning page...");
      navigate("/career/plan/skills");
      return;
    }

    try {
      const res = await startLearningJourney();

      if (res.message === "Journey already started") {
        toast.warn("Journey already started");
        setJourneyStarted(true);
        navigate("/career/plan/skills");
      } else {
        toast.success(res.message || "Journey started!");
        setJourneyStarted(true);
        navigate("/career/plan/skills")
      }
    } catch (err) {
      console.error("Error starting journey", err);
      toast.error("Failed to start learning journey");
    }
  };

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

      {/* Career Outlook */}
      {careerOutlook && (
        <div className="mt-10 p-6 bg-white rounded-xl shadow border">
          <h2 className="text-2xl font-bold mb-4">📈 Career Outlook</h2>
          <div className="space-y-2">
            <p><strong>Roles:</strong> {careerOutlook.roles?.join(", ")}</p>
            <p><strong>Salary Range:</strong> {careerOutlook.salary_range}</p>
            <p><strong>Industry Trends:</strong> {careerOutlook.industry_trends?.join(", ")}</p>
          </div>
        </div>
      )}

      {/* Fallback Note */}
      {plan.note && Object.keys(plan.raw || {}).length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-10 mb-2 text-yellow-700">⚠️ AI Fallback Notice</h2>
          <FallbackNote note={plan.note} raw={plan.raw} />
        </>
      )}

      {/* Start Journey */}
      <div className="text-center mt-12">
        <button
          onClick={handleStartJourney}
          className={`px-6 py-3 ${
            journeyStarted ? "bg-green-600 hover:bg-green-700" : "bg-purple-700 hover:bg-purple-800"
          } text-white font-semibold rounded-lg shadow transition`}
        >
          {journeyStarted ? "✅ Journey Already Started" : "🚀 Start Learning Journey"}
        </button>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default CareerPlanPage;
