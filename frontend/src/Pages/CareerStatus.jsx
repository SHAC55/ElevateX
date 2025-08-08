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
  interest: <FaLightbulb className="text-indigo-500 text-xl" />,
  skills: <FaLaptopCode className="text-indigo-500 text-xl" />,
  education: <FaUserGraduate className="text-indigo-500 text-xl" />,
  experience: <FaCalendarCheck className="text-indigo-500 text-xl" />,
  careergoal: <FaBullseye className="text-indigo-500 text-xl" />,
  timeconstraint: <FaClock className="text-indigo-500 text-xl" />,
  availabilty: <FaGlobe className="text-indigo-500 text-xl" />
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
      const usablePlan = {
        skills: Array.isArray(plan.skills) && plan.skills.length > 1 ? plan.skills : plan?.raw?.skills || [],
        roadmap: Array.isArray(plan.roadmap) && plan.roadmap.length > 0 ? plan.roadmap : plan?.raw?.roadmap || [],
        projects: Array.isArray(plan.projects) && plan.projects.length > 0 ? plan.projects : plan?.raw?.projects || [],
        resources: Array.isArray(plan.resources) && plan.resources.length > 0 ? plan.resources : plan?.raw?.resources || [],
        note: plan.note || '',
      };
      if (plan.generatedAt) setGeneratedAt(new Date(plan.generatedAt));
      setPlanInfo(usablePlan);
    } catch {}
  };

  const handleGeneratePlan = async () => {
    try {
      setGenerating(true);
      const res = await generateCareerPlan();
      toast.success('Career Plan generated successfully!');
      navigate('/career/plan', { state: { plan: res.plan } });
    } catch (err) {
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
      setErrorMsg(`Error ${err?.response?.status || 500}: Unable to fetch your career path.`);
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
    } catch {
      toast.error('Reset failed');
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await updateCareerChoice(formData);
      toast.success('Career choice updated!');
      setChoice(res.choice);
      setEditMode(false);
    } catch {
      toast.error('Update failed');
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchPlanInfo();
  }, []);

  return (
    <div className="p-8 sm:p-10 bg-white rounded-3xl max-w-5xl mx-auto mt-24 transition-all duration-300 border border-slate-200">
      <ToastContainer />
      <h2 className="text-4xl font-bold mb-2 text-slate-900 tracking-tight">🎯 Career Path Status</h2>
      {userName && <p className="text-slate-600 text-md mb-6">👤 Selected by <span className="font-semibold text-indigo-600">{userName}</span></p>}
      {errorMsg && <div className="bg-red-100 text-red-700 border border-red-200 p-4 rounded-xl mb-6">{errorMsg}</div>}
      {status === 'not_chosen' && !errorMsg && <div className="text-slate-600">You haven't selected a career path yet.</div>}

      {status === 'chosen' && choice && (
        <div className="bg-slate-50 p-6 rounded-2xl shadow-md border border-slate-200 space-y-6">
          {editMode ? (
            <EditCareer formData={formData} onChange={handleChange} />
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {Object.entries(choice).map(([key, value]) => {
                if (['_id', 'userId', '__v'].includes(key)) return null;
                const label = key.charAt(0).toUpperCase() + key.slice(1);
                return (
                  <div key={key} className="flex items-start gap-4 p-4 bg-white border border-indigo-100 rounded-xl shadow-sm">
                    <div className="mt-1">{iconMap[key]}</div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">{label}</p>
                      <p className="text-slate-900 font-semibold text-lg">{value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-6">
            {editMode ? (
              <>
                <button onClick={handleUpdate} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">Save</button>
                <button onClick={() => { setEditMode(false); setFormData(choice); }} className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600">Cancel</button>
              </>
            ) : (
              <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">Edit</button>
            )}

            <ResetCareer onReset={handleReset} />

            <button onClick={handleGeneratePlan} className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700" disabled={generating}>
              {generating ? 'Generating...' : '🚀 Generate AI Career Plan'}
            </button>

            <button onClick={() => navigate('/career/plan')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
              📊 View Full Career Plan
            </button>
          </div>

          {generatedAt && <p className="mt-4 text-sm text-slate-500 italic">🕒 Last Plan Generated: {generatedAt.toLocaleString()}</p>}
        </div>
      )}
    </div>
  );
};

export default CareerStatus;
