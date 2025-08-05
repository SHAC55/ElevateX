

import React, { useEffect, useState } from 'react';
import {
  getCareerStatus,
  deleteCareerChoice,
  updateCareerChoice,
  generateCareerPlan,
  getCareerPlan,
} from '../api/career';

import { toast, ToastContainer } from 'react-toastify';
import EditCareer from '../Components/EditCareer';
import ResetCareer from '../Components/ResetCareer';
import { useNavigate } from 'react-router-dom';

import {
  FaUserGraduate,
  FaLightbulb,
  FaLaptopCode,
  FaGlobe,
  FaBullseye,
  FaClock,
  FaCalendarCheck
} from 'react-icons/fa';

const iconMap = {
  interest: <FaLightbulb className="text-blue-600 text-lg" />,
  skills: <FaLaptopCode className="text-blue-600 text-lg" />,
  education: <FaUserGraduate className="text-blue-600 text-lg" />,
  experience: <FaCalendarCheck className="text-blue-600 text-lg" />,
  careergoal: <FaBullseye className="text-blue-600 text-lg" />,
  timeconstraint: <FaClock className="text-blue-600 text-lg" />,
  availabilty: <FaGlobe className="text-blue-600 text-lg" />
};

const CareerStatus = ({ refreshStatus }) => {
  const navigate = useNavigate();

  const [status, setStatus] = useState(null);
  const [choice, setChoice] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [userName, setUserName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [planInfo, setPlanInfo] = useState(null);

  const fetchPlanInfo = async () => {
    try {
      const plan = await getCareerPlan();

      const fallbackSkills = plan?.raw?.skills;
      const fallbackRoadmap = plan?.raw?.roadmap;
      const fallbackProjects = plan?.raw?.projects;
      const fallbackResources = plan?.raw?.resources;

      const usablePlan = {
        skills: Array.isArray(plan.skills) && plan.skills.length > 1 ? plan.skills : fallbackSkills || [],
        roadmap: Array.isArray(plan.roadmap) && plan.roadmap.length > 0 ? plan.roadmap : fallbackRoadmap || [],
        projects: Array.isArray(plan.projects) && plan.projects.length > 0 ? plan.projects : fallbackProjects || [],
        resources: Array.isArray(plan.resources) && plan.resources.length > 0 ? plan.resources : fallbackResources || [],
        note: plan.note || '',
      };

      if (plan.generatedAt) {
        setGeneratedAt(new Date(plan.generatedAt));
      }

      setPlanInfo(usablePlan);
    } catch (err) {
      // Silent fail — plan may not be generated yet
    }
  };

  const handleGeneratePlan = async () => {
  try {
    setGenerating(true);
    const res = await generateCareerPlan(); // POST request that returns the new plan
    toast.success('Career Plan generated successfully!');
    navigate('/career/plan', { state: { plan: res.plan } }); // Pass plan via router
  } catch (err) {
    console.error('Error generating plan:', err);
    toast.error('Failed to generate career plan');
  } finally {
    setGenerating(false);
  }
};


  const fetchStatus = async () => {
    try {
      const res = await getCareerStatus();
      setStatus(res.status);
      if (res.status === 'chosen') {
        setChoice(res.choice);
        setFormData(res.choice);
        if (res.user) setUserName(res.user);
      }
    } catch (err) {
      console.error('Error fetching status:', err);
      setErrorMsg(`Error ${err?.response?.status || 500}: Unable to fetch your career path. Please try again.`);
      toast.error('Failed to fetch career status');
    }
  };

  const handleReset = async () => {
    try {
      await deleteCareerChoice();
      toast.success('Career choice reset successfully');
      setStatus('not_chosen');
      setChoice(null);
      setEditMode(false);
      refreshStatus();
    } catch (err) {
      toast.error('Reset failed');
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {
    try {
      const res = await updateCareerChoice(formData);
      toast.success('Career choice updated!');
      setChoice(res.choice);
      setEditMode(false);
    } catch (err) {
      toast.error('Update failed');
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchPlanInfo();
  }, []);

  return (
    <div className="p-6 sm:p-10 bg-white rounded-2xl max-w-5xl mx-auto mt-10 shadow-md transition-all duration-300">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-2 text-gray-800">🎯 Career Path Status</h2>

      {userName && (
        <p className="text-gray-600 text-md mb-6">
          👤 Selected by <span className="font-semibold text-indigo-600">{userName}</span>
        </p>
      )}

      {errorMsg && (
        <div className="bg-red-100 text-red-700 border border-red-200 p-4 rounded-lg mb-6">
          {errorMsg}
        </div>
      )}

      {status === 'not_chosen' && !errorMsg && (
        <div className="text-gray-600">You haven't selected a career path yet.</div>
      )}

      {status === 'chosen' && choice && (
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          {editMode ? (
            <EditCareer formData={formData} onChange={handleChange} />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(choice).map(([key, value]) => {
                if (['_id', 'userId', '__v'].includes(key)) return null;
                const label = key.charAt(0).toUpperCase() + key.slice(1);
                return (
                  <div
                    key={key}
                    className="flex items-start gap-3 p-4 bg-white border border-blue-100 rounded-lg shadow-sm"
                  >
                    <div className="mt-1">{iconMap[key]}</div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{label}</p>
                      <p className="text-gray-800 font-semibold">{value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 flex-wrap mt-6">
            {editMode ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setFormData(choice);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
            )}

            <ResetCareer onReset={handleReset} />

            <button
              onClick={handleGeneratePlan}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 mt-4"
              disabled={generating}
            >
              {generating ? 'Generating...' : '🚀 Generate AI Career Plan'}
            </button>

            <button
              onClick={() => navigate('/career/plan')}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 mt-4"
            >
              📊 View Full Career Plan
            </button>
          </div>

          {generatedAt && (
            <div className="mt-4 text-sm text-gray-500 italic">
              🕒 Last Plan Generated: {generatedAt.toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CareerStatus;
