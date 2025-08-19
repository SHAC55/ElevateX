
import React, { useEffect, useState } from 'react';
import {
  getCareerStatus,
  deleteCareerChoice,
  updateCareerChoice,
  generateCareerPlan,
  getCareerPlan,
} from '../api/career';
import {  FiUser } from 'react-icons/fi';



import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditCareer from '../Components/EditCareer';
import ResetCareer from '../Components/ResetCareer';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiLoader } from 'react-icons/fi';

import {
  FaUserGraduate,
  FaLightbulb,
  FaLaptopCode,
  FaGlobe,
  FaBullseye,
  FaClock,
  FaCalendarCheck,
  FaRocket,
  FaChartLine
} from 'react-icons/fa';

const iconMap = {
  interest: <FaLightbulb className="text-amber-400 text-xl" />,
  skills: <FaLaptopCode className="text-blue-400 text-xl" />,
  education: <FaUserGraduate className="text-emerald-400 text-xl" />,
  experience: <FaCalendarCheck className="text-purple-400 text-xl" />,
  careergoal: <FaBullseye className="text-rose-400 text-xl" />,
  timeconstraint: <FaClock className="text-indigo-400 text-xl" />,
  availabilty: <FaGlobe className="text-cyan-400 text-xl" />
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
      toast.success('Career Plan generated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      navigate('/career/plan', { state: { plan: res.plan } });
    } catch (err) {
      toast.error('Failed to generate career plan', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
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
      toast.error('Failed to fetch career status', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await deleteCareerChoice();
      toast.success('Career choice reset successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setStatus('not_chosen');
      setChoice(null);
      setEditMode(false);
      refreshStatus();
    } catch {
      toast.error('Reset failed', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await updateCareerChoice(formData);
      toast.success('Career choice updated!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setChoice(res.choice);
      setEditMode(false);
    } catch {
      toast.error('Update failed', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchPlanInfo();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
return (
  <div className="min-h-screen bg-[#F9FAFB]">
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            Career Path Status
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            {status === "not_chosen"
              ? "Your career journey starts here"
              : "Your personalized career roadmap"}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FiLoader className="animate-spin text-4xl text-blue-600" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={status}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="p-8 sm:p-10">
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded"
                  >
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-red-400"
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
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <FiUser className="mr-1 w-4 h-4" />
                      Selected by {userName}
                    </span>
                  </div>
                )}

                {status === "not_chosen" && !errorMsg && (
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
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by selecting your career preferences.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => navigate("/career")}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Choose Career Path <FiChevronRight className="ml-2 -mr-1 w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {status === "chosen" && choice && (
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
                          if (["_id", "userId", "__v"].includes(key)) return null;
                          const label = key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase());
                          return (
                            <motion.div
                              key={key}
                              whileHover={{ y: -3, shadow: "0 10px 15px rgba(0,0,0,0.05)" }}
                              className="flex flex-col p-6 bg-white rounded-xl shadow-sm border border-gray-200"
                            >
                              <div className="flex items-center mb-4">
                                <div className="p-2 rounded-lg bg-blue-50">
                                  {iconMap[key] || <FiUser className="w-6 h-6 text-blue-400" />}
                                </div>
                                <h3 className="ml-3 text-sm font-medium text-gray-500">{label}</h3>
                              </div>
                              <p className="text-lg font-semibold text-gray-900 truncate">{value}</p>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                      {editMode ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleUpdate}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Save Changes
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setEditMode(false);
                              setFormData(choice);
                            }}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Cancel
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setEditMode(true)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Edit Preferences
                        </motion.button>
                      )}

                      <ResetCareer onReset={handleReset} />

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGeneratePlan}
                        disabled={generating}
                        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          generating
                            ? "bg-purple-400"
                            : "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
                        }`}
                      >
                        {generating ? (
                          <>
                            <FiLoader className="animate-spin mr-2" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <FaRocket className="mr-2" />
                            Generate AI Career Plan
                          </>
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/career/plan")}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                      >
                        <FaChartLine className="mr-2" />
                        View Full Career Plan
                      </motion.button>
                    </div>

                    {generatedAt && (
                      <div className="text-sm text-gray-500 flex items-center mt-4">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
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
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  </div>
);




};

export default CareerStatus;