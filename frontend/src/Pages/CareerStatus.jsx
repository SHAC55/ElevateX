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
import { FiChevronRight, FiLoader, FiUser } from 'react-icons/fi';
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
import {
  buildCareerPayload,
  createCareerProfileValues,
} from '../lib/careerProfile';

const iconMap = {
  interest: <FaLightbulb className="text-[#c56c19] text-xl" />,
  skills: <FaLaptopCode className="text-[#2563eb] text-xl" />,
  education: <FaUserGraduate className="text-[#15803d] text-xl" />,
  experience: <FaCalendarCheck className="text-[#7c3aed] text-xl" />,
  careergoal: <FaBullseye className="text-[#e11d48] text-xl" />,
  timeconstraint: <FaClock className="text-[#4f46e5] text-xl" />,
  availabilty: <FaGlobe className="text-[#0891b2] text-xl" />,
  workstyle: <FaRocket className="text-[#1e140d] text-xl" />,
  motivation: <FaChartLine className="text-[#15803d] text-xl" />,
};

const Surface = ({ children, className = '' }) => (
  <div
    className={`rounded-[30px] border border-[#eadbc5] bg-white/92 shadow-[0_24px_70px_rgba(89,60,27,0.08)] ${className}`}
  >
    {children}
  </div>
);

const StatChip = ({ label, value, tint = 'indigo' }) => {
  const toneMap = {
    indigo: 'border-[#d4d8f7] bg-[#f3f4ff] text-[#4f46e5]',
    violet: 'border-[#e4d5fb] bg-[#f8f2ff] text-[#7c3aed]',
    fuchsia: 'border-[#f6d2e8] bg-[#fff1f8] text-[#c026d3]',
    emerald: 'border-[#cfe5d3] bg-[#edf8ef] text-[#15803d]',
  };

  return (
    <div className={`rounded-[24px] border p-5 ${toneMap[tint] || toneMap.indigo}`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em]">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-[#1e140d]">{value}</div>
    </div>
  );
};

const DetailCard = ({ icon, label, value }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="rounded-[26px] border border-[#efe3d2] bg-[linear-gradient(135deg,#fff8ef_0%,#fffdf9_100%)] p-5"
  >
    <div className="flex items-center gap-3">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm">
        {icon}
      </div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#866f55]">{label}</div>
    </div>
    <p className="mt-4 text-base font-semibold leading-7 text-[#1e140d]">{value}</p>
  </motion.div>
);

const CareerStatus = ({ refreshStatus }) => {
  const navigate = useNavigate();

  const [status, setStatus] = useState(null);
  const [choice, setChoice] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(() => createCareerProfileValues());
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
        skills: plan.skills ? Object.values(plan.skills).flat().filter(Boolean) : [],
        roadmap: Array.isArray(plan.roadmap) && plan.roadmap.length > 0 ? plan.roadmap : [],
        projects: Array.isArray(plan.projects) && plan.projects.length > 0 ? plan.projects : plan?.raw?.projects || [],
        resources: plan.resources ? Object.values(plan.resources).flat().filter(Boolean) : [],
        note: plan.note || '',
        analytics: plan.analytics || null,
      };
      if (plan.generatedAt) setGeneratedAt(new Date(plan.generatedAt));
      setPlanInfo(usablePlan);
    } catch {}
  };

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const res = await getCareerStatus();
      setStatus(res.status);
      if (res.status === 'chosen') {
        setChoice(res.choice);
        setProfile(res.profile || null);
        setFormData(createCareerProfileValues(res));
        if (res.user) setUserName(res.user);
      }
      setIsLoading(false);
    } catch (err) {
      setErrorMsg(`Error ${err?.response?.status || 500}: Unable to fetch your career path.`);
      toast.error('Failed to fetch career status', { theme: 'colored' });
      setIsLoading(false);
    }
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

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field, option) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      return {
        ...prev,
        [field]: current.includes(option)
          ? current.filter((item) => item !== option)
          : [...current, option],
      };
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await updateCareerChoice(buildCareerPayload(formData));
      toast.success('Career choice updated!', { theme: 'colored' });
      setChoice(res.choice);
      setProfile(res.profile || null);
      setEditMode(false);
      await fetchPlanInfo();
    } catch {
      toast.error('Update failed', { theme: 'colored' });
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchPlanInfo();
  }, []);

  const selectedDetails = [
    {
      key: 'interest',
      label: 'Current Direction',
      value: profile?.userProfile?.careerVector?.currentRole || choice?.interest,
    },
    {
      key: 'careergoal',
      label: 'Target Roles',
      value: (profile?.userProfile?.careerVector?.targetRoles || []).join(', '),
    },
    {
      key: 'skills',
      label: 'Skill Graph',
      value: (profile?.userProfile?.skills || []).map((item) => item.name).join(', '),
    },
    {
      key: 'education',
      label: 'Education',
      value: choice?.education,
    },
    {
      key: 'experience',
      label: 'Experience',
      value: choice?.experience,
    },
    {
      key: 'timeconstraint',
      label: 'Timeline',
      value: choice?.timeconstraint,
    },
    {
      key: 'availabilty',
      label: 'Availability',
      value: choice?.availabilty,
    },
    {
      key: 'workstyle',
      label: 'Work Style DNA',
      value: [
        profile?.userProfile?.workStyleDNA?.learningStyle,
        profile?.userProfile?.workStyleDNA?.collaborationStyle,
        profile?.userProfile?.workStyleDNA?.riskAppetite,
      ].filter(Boolean).join(' • '),
    },
    {
      key: 'motivation',
      label: 'Motivation Drivers',
      value: (profile?.userProfile?.workStyleDNA?.motivationDrivers || []).join(', '),
    },
  ].filter((item) => item.value);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_22%),linear-gradient(180deg,_#fffaf2_0%,_#f3e7d2_100%)] text-[#1e140d]">
      <div className="px-4 pb-12 pt-8 sm:px-6 lg:px-8">
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
          className="mx-auto max-w-6xl"
        >
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <FiLoader className="animate-spin text-4xl text-[#c56c19]" />
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
                {status === 'chosen' && choice ? (
                  <>
                    <section className="overflow-hidden rounded-[36px] border border-[#ead8c0] bg-[#1b140f] text-white shadow-[0_30px_90px_rgba(61,36,10,0.24)]">
                      <div className="grid gap-8 px-6 py-7 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-8">
                        <div className="relative">
                          <div className="absolute -left-16 top-0 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />
                          <div className="absolute left-36 top-24 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />
                          <div className="relative">
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#fdba74] bg-[#fff1dc] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7c2d12] shadow-[0_10px_30px_rgba(251,146,60,0.18)]">
                              <span className="h-2 w-2 rounded-full bg-[#c56c19]" />
                              Career OS
                            </div>
                            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                              {profile?.userProfile?.careerVector?.targetRoles?.[0] || choice?.goal || 'Your path'} is now the active path.
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#efe4d7] sm:text-base">
                              This selected-goal view organizes role direction, constraints, skill signals,
                              and planning outputs into one warmer, clearer operating surface.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                              <GlassyButton
                                variant="primary"
                                onClick={handleGeneratePlan}
                                loading={generating}
                                icon={generating ? FiLoader : FaRocket}
                              >
                                {generating ? 'Generating…' : 'Generate AI Career Plan'}
                              </GlassyButton>
                              <GlassyButton
                                variant="secondary"
                                onClick={() => navigate('/career/plan')}
                                icon={FaChartLine}
                              >
                                View Full Career Plan
                              </GlassyButton>
                            </div>

                            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                                <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">Target</div>
                                <div className="mt-3 text-xl font-semibold">
                                  {profile?.userProfile?.careerVector?.targetRoles?.[0] || 'Defined'}
                                </div>
                                <div className="mt-2 text-sm text-[#f0e4d8]">The selected direction is anchoring the entire workspace.</div>
                              </div>
                              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                                <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">Signals</div>
                                <div className="mt-3 text-xl font-semibold">{selectedDetails.length} profile points</div>
                                <div className="mt-2 text-sm text-[#f0e4d8]">Role, constraints, skills, and motivations are mapped together.</div>
                              </div>
                              <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-orange-500/20 to-transparent p-4">
                                <div className="text-[11px] uppercase tracking-[0.24em] text-[#ffd8b0]">Readiness</div>
                                <div className="mt-3 text-3xl font-semibold">{planInfo?.analytics?.readinessScore ?? 'N/A'}</div>
                                <div className="mt-2 text-sm text-[#f2dcc8]">Current score from the latest available plan analytics.</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-4">
                          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] p-5">
                            <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">Selected By</div>
                            <div className="mt-4 flex items-center gap-3">
                              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
                                <FiUser className="text-xl text-[#fdba74]" />
                              </div>
                              <div>
                                <div className="text-xl font-semibold">{userName || 'ElevateX user'}</div>
                                <div className="text-sm text-[#f0e4d8]">The path is active and can be refined at any time.</div>
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                              <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">Skills</div>
                              <div className="mt-3 text-3xl font-semibold">{planInfo?.skills?.length || 0}</div>
                            </div>
                            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                              <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">Roadmap</div>
                              <div className="mt-3 text-3xl font-semibold">{planInfo?.roadmap?.length || 0}</div>
                            </div>
                            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                              <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">Projects</div>
                              <div className="mt-3 text-3xl font-semibold">{planInfo?.projects?.length || 0}</div>
                            </div>
                            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                              <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">Resources</div>
                              <div className="mt-3 text-3xl font-semibold">{planInfo?.resources?.length || 0}</div>
                            </div>
                          </div>

                          {generatedAt && (
                            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-[#f0e4d8]">
                              Last generated: {generatedAt.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </section>

                    <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
                      <Surface className="p-6">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">Career Profile</div>
                            <h2 className="mt-2 text-2xl font-semibold">The selected goal translated into signal</h2>
                          </div>
                          {!editMode && (
                            <GlassyButton variant="primary" onClick={() => setEditMode(true)}>
                              Edit Preferences
                            </GlassyButton>
                          )}
                        </div>

                        <div className="mt-5">
                          {editMode ? (
                            <div className="space-y-5">
                              <EditCareer
                                formData={formData}
                                onFieldChange={handleFieldChange}
                                onToggle={handleToggle}
                              />
                              <div className="flex flex-wrap gap-3 border-t border-[#efe3d2] pt-5">
                                <GlassyButton variant="primary" onClick={handleUpdate}>
                                  Save Changes
                                </GlassyButton>
                                <GlassyButton
                                  variant="secondary"
                                  onClick={() => {
                                    setEditMode(false);
                                    setFormData(createCareerProfileValues({ choice, profile }));
                                  }}
                                >
                                  Cancel
                                </GlassyButton>
                              </div>
                            </div>
                          ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                              {selectedDetails.map(({ key, label, value }) => (
                                <DetailCard
                                  key={key}
                                  icon={iconMap[key] || <FiUser className="text-[#c56c19]" />}
                                  label={label}
                                  value={value}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </Surface>

                      <div className="space-y-6">
                        {planInfo && (planInfo.skills?.length || planInfo.roadmap?.length || planInfo.projects?.length) ? (
                          <Surface className="p-6">
                            <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">Plan Snapshot</div>
                            <h2 className="mt-2 text-2xl font-semibold">Live outputs tied to this goal</h2>
                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                              <StatChip label="Skills" value={planInfo.skills.length || 0} tint="indigo" />
                              <StatChip label="Roadmap" value={planInfo.roadmap.length || 0} tint="violet" />
                              <StatChip label="Projects" value={planInfo.projects.length || 0} tint="fuchsia" />
                              <StatChip label="Readiness" value={planInfo.analytics?.readinessScore ?? 'N/A'} tint="emerald" />
                            </div>
                          </Surface>
                        ) : null}

                        <Surface className="p-6">
                          <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">Action Rail</div>
                          <h2 className="mt-2 text-2xl font-semibold">Move the selected goal forward</h2>
                          <div className="mt-5 space-y-4">
                            <div className="rounded-[26px] border border-[#efe3d2] bg-[linear-gradient(135deg,#fff8ef_0%,#fffdf9_100%)] p-5">
                              <div className="text-sm font-semibold text-[#1e140d]">Generate or refresh the AI career plan</div>
                              <p className="mt-2 text-sm leading-7 text-[#6e5b46]">
                                Rebuild the roadmap and supporting outputs against your latest inputs.
                              </p>
                            </div>
                            <div className="rounded-[26px] border border-[#efe3d2] bg-[linear-gradient(135deg,#fff8ef_0%,#fffdf9_100%)] p-5">
                              <div className="text-sm font-semibold text-[#1e140d]">Open the full plan workspace</div>
                              <p className="mt-2 text-sm leading-7 text-[#6e5b46]">
                                Continue from summary into the deeper execution layer for learning and projects.
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-3 pt-2">
                              <ResetCareer onReset={handleReset} />
                              <GlassyButton
                                variant="secondary"
                                onClick={handleGeneratePlan}
                                loading={generating}
                                icon={generating ? FiLoader : FaRocket}
                              >
                                {generating ? 'Generating…' : 'Generate Plan'}
                              </GlassyButton>
                              <GlassyButton
                                variant="primary"
                                onClick={() => navigate('/career/plan')}
                                icon={FaChartLine}
                              >
                                View Full Plan
                              </GlassyButton>
                            </div>
                          </div>
                        </Surface>
                      </div>
                    </div>
                  </>
                ) : (
                  <Surface className="overflow-hidden">
                    <div className="p-8 sm:p-10">
                      {errorMsg && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-6 rounded-xl border border-red-300/60 bg-red-50/80 p-4"
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
                        <div className="mb-6 flex items-center">
                          <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
                            <FiUser className="mr-1 h-4 w-4" />
                            Selected by {userName}
                          </span>
                        </div>
                      )}

                      {status === 'not_chosen' && !errorMsg && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="py-12 text-center"
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
                          <h3 className="mt-2 text-lg font-medium text-gray-900">No career path selected</h3>
                          <p className="mt-1 text-sm text-gray-600">Get started by selecting your career preferences.</p>
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
                    </div>
                  </Surface>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CareerStatus;
