// src/pages/CareerStatus.jsx
import React, { useEffect, useState } from 'react';
import {
  getCareerStatus,
  deleteCareerChoice,
  updateCareerChoice,
  generateCareerPlan,
  getCareerPlan,
} from '../api/career';

import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  FiUser,
  FiChevronRight,
  FiLoader,
} from 'react-icons/fi';

import {
  FaUserGraduate,
  FaLightbulb,
  FaLaptopCode,
  FaGlobe,
  FaBullseye,
  FaClock,
  FaCalendarCheck,
  FaRocket,
  FaChartLine,
} from 'react-icons/fa';

import EditCareer from '../Components/EditCareer';
import ResetCareer from '../Components/ResetCareer';
import GlassyButton from '../Components/ui/GlassyButton';

/* ----------------------------- Icon dictionary ---------------------------- */
const iconMap = {
  interest: <FaLightbulb className="text-amber-400 text-xl" />,
  skills: <FaLaptopCode className="text-blue-500 text-xl" />,
  education: <FaUserGraduate className="text-emerald-500 text-xl" />,
  experience: <FaCalendarCheck className="text-purple-500 text-xl" />,
  careergoal: <FaBullseye className="text-rose-500 text-xl" />,
  timeconstraint: <FaClock className="text-indigo-500 text-xl" />,
  availabilty: <FaGlobe className="text-cyan-500 text-xl" />,
};

/* ---------------------------- Small UI primitives ---------------------------- */
const GlassCard = ({ children, className = '' }) => (
  <div
    className={`rounded-2xl border border-white/30 bg-gradient-to-br from-white/70 to-slate-50/70 backdrop-blur-xl shadow-xl shadow-black/10 ${className}`}
  >
    {children}
  </div>
);

const StatChip = ({ label, value, tint = 'indigo' }) => (
  <div
    className={`flex flex-col rounded-xl border p-4 backdrop-blur bg-gradient-to-br 
      from-${tint}-50/50 to-${tint}-100/30 border-${tint}-200/50`}
  >
    <span className={`text-sm font-medium text-${tint}-700`}>{label}</span>
    <span className="mt-1 text-xl font-semibold text-slate-900">{value}</span>
  </div>
);

/* -------------------------------- Component -------------------------------- */
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
  const [isLoading, setIsLoading] = useState(true);

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
      toast.success('Career Plan generated successfully!', { theme: 'colored' });
      navigate('/career/plan', { state: { plan: res.plan } });
    } catch {
      toast.error('Failed to generate career plan', { theme: 'colored' });
    } finally {
      setGenerating(false);
    }
  };

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const res = await getCareerStatus();
      setStatus(res.status);
      if (res.status === 'chosen') {
        setChoice(res.choice);
        setFormData(res.choice);
        if (res.user) setUserName(res.user);
      }
      setIsLoading(false);
    } catch (err) {
      setErrorMsg(`Error ${err?.response?.status || 500}: Unable to fetch your career path.`);
      toast.error('Failed to fetch career status', { theme: 'colored' });
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await deleteCareerChoice();
      toast.success('Career choice reset successfully', { theme: 'colored' });
      setStatus('not_chosen');
      setChoice(null);
      setEditMode(false);
      refreshStatus();
    } catch {
      toast.error('Reset failed', { theme: 'colored' });
    }
  };

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await updateCareerChoice(formData);
      toast.success('Career choice updated!', { theme: 'colored' });
      setChoice(res.choice);
      setEditMode(false);
    } catch {
      toast.error('Update failed', { theme: 'colored' });
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchPlanInfo();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen relative bg-aurora">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/70 via-white/70 to-indigo-50/60 pointer-events-none" />

      <div className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="colored"
          toastClassName="rounded-xl font-sans bg-white/90 backdrop-blur-xl border border-white/40 shadow-lg"
          progressClassName="bg-gradient-to-r from-indigo-500 to-fuchsia-500"
        />

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/60 backdrop-blur-xl px-4 py-2 text-sm font-medium text-slate-700 shadow-md">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
              Career status overview
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700">
              Career Path Status
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-lg text-slate-600">
              {status === 'not_chosen'
                ? 'Your career journey starts here'
                : 'Your personalized career roadmap'}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <FiLoader className="animate-spin text-4xl text-indigo-600" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {planInfo && (planInfo.skills?.length || planInfo.roadmap?.length || planInfo.projects?.length) ? (
                  <GlassCard className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <StatChip label="Skills" value={planInfo.skills.length || 0} tint="indigo" />
                      <StatChip label="Roadmap steps" value={planInfo.roadmap.length || 0} tint="violet" />
                      <StatChip label="Projects" value={planInfo.projects.length || 0} tint="fuchsia" />
                    </div>
                    {generatedAt && (
                      <div className="mt-3 text-sm text-slate-500">
                        Last plan generated: {generatedAt.toLocaleString()}
                      </div>
                    )}
                  </GlassCard>
                ) : null}

                <GlassCard className="overflow-hidden border-white/40">
                  <div className="p-8 sm:p-10">
                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50/80 border border-red-300/60 p-4 mb-6 rounded-xl"
                      >
                        <div className="flex items-center">
                          <svg
                            className="h-5 w-5 text-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="ml-3 text-sm text-red-700">{errorMsg}</p>
                        </div>
                      </motion.div>
                    )}

                    {userName && (
                      <div className="flex items-center mb-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                          <FiUser className="mr-1 w-4 h-4" />
                          Selected by {userName}
                        </span>
                      </div>
                    )}

                    {status === 'not_chosen' && !errorMsg && (
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center py-12"
                      >
                        <div className="mx-auto h-24 w-24 text-gray-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </div>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">
                          No career path selected
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Get started by selecting your career preferences.
                        </p>
                        <div className="mt-6">
                          <GlassyButton
                            variant="primary"
                            icon={FiChevronRight}
                            onClick={() => navigate('/career')}
                          >
                            Choose Career Path
                          </GlassyButton>
                        </div>
                      </motion.div>
                    )}

                    {status === 'chosen' && choice && (
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                      >
                        {editMode ? (
                          <EditCareer formData={formData} onChange={handleChange} />
                        ) : (
                          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(choice).map(([key, value]) => {
                              if (['_id', 'userId', '__v'].includes(key)) return null;
                              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                              return (
                                <motion.div
                                  key={key}
                                  whileHover={{ y: -3 }}
                                  className="flex flex-col p-6 rounded-xl border border-white/30 bg-white/70 backdrop-blur shadow-soft"
                                >
                                  <div className="flex items-center mb-4">
                                    <div className="p-2 rounded-lg bg-white/80 border border-white/40 backdrop-blur">
                                      {iconMap[key] || <FiUser className="w-6 h-6 text-indigo-400" />}
                                    </div>
                                    <h3 className="ml-3 text-sm font-medium text-slate-600">{label}</h3>
                                  </div>
                                  <p className="text-lg font-semibold text-slate-900 truncate">{value}</p>
                                </motion.div>
                              );
                            })}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/30">
                          {editMode ? (
                            <>
                              <GlassyButton variant="primary" onClick={handleUpdate}>
                                Save Changes
                              </GlassyButton>
                              <GlassyButton
                                variant="secondary"
                                onClick={() => {
                                  setEditMode(false);
                                  setFormData(choice);
                                }}
                              >
                                Cancel
                              </GlassyButton>
                            </>
                          ) : (
                            <GlassyButton variant="primary" onClick={() => setEditMode(true)}>
                              Edit Preferences
                            </GlassyButton>
                          )}

                          <ResetCareer onReset={handleReset} />

                          <GlassyButton
                            variant="primary"
                            onClick={handleGeneratePlan}
                            loading={generating}
                            icon={generating ? FiLoader : FaRocket}
                          >
                            {generating ? 'Generating…' : 'Generate AI Career Plan'}
                          </GlassyButton>

                          <GlassyButton
                            variant="danger"
                            onClick={() => navigate('/career/plan')}
                            icon={FaChartLine}
                          >
                            View Full Career Plan
                          </GlassyButton>
                        </div>

                        {generatedAt && (
                          <div className="text-sm text-slate-500 flex items-center mt-4">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-slate-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Last Plan Generated: {generatedAt.toLocaleString()}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CareerStatus;
