import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { register as registerUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import signupImg from "../assets/signup.jpg";

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// SVG Icons
const EyeIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeSlashIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
    />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const EnvelopeIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const LockClosedIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    />
  </svg>
);

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data);

      toast.success(
        <div className="flex items-start space-x-3">
          <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Registration Successful!</p>
            <p className="text-sm text-gray-600 mt-1">
              Please check your email to verify your account.
            </p>
          </div>
        </div>,
        {
          duration: 6000,
          position: "top-right",
          style: {
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            padding: "16px",
            maxWidth: "400px",
          },
        },
      );

      setVerificationSent(true);
      reset();

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Signup failed. Please try again.";

      toast.error(
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-500 text-sm font-bold">!</span>
            </div>
          </div>
          <div>
            <p className="font-medium">Registration Failed</p>
            <p className="text-sm text-gray-600 mt-1">{errorMessage}</p>
          </div>
        </div>,
        {
          duration: 5000,
          position: "top-right",
          style: {
            background: "#fef2f2",
            border: "1px solid #fecaca",
            padding: "16px",
            maxWidth: "400px",
          },
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            borderRadius: "12px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          },
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/50 flex flex-col">
        {/* Top Navigation Bar */}
     

        {/* Main Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8"
        >
          <div className="w-full max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Left - Image Section */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                <div className="relative h-full min-h-[400px] lg:min-h-[600px]">
                  <img
                    src={signupImg}
                    className="w-full h-full object-cover"
                    alt="Join our professional community"
                  />
                  {/* Overlay Content */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 lg:p-12">
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="max-w-md"
                    >
                      <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-sm text-white font-medium">
                          10,000+ Professionals Joined
                        </span>
                      </div>
                      <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                        Accelerate Your Career Journey
                      </h2>
                      <p className="text-gray-200 text-lg mb-6">
                        Join a community of ambitious professionals, access
                        exclusive resources, and fast-track your career growth.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-white">
                            Personalized career paths
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-white">
                            Industry expert mentors
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-white">
                            Premium learning resources
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Right - Form Section */}
              <motion.div
                variants={staggerChildren}
                initial="hidden"
                animate="visible"
                className="lg:w-1/2 p-6 sm:p-8 lg:p-12 xl:p-16"
              >
                <div className="max-w-lg mx-auto">
                  {/* Header */}
                  <motion.div variants={fadeIn} className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      Create Your Account
                    </h2>
                    <p className="text-gray-600">
                      Start your journey towards professional excellence
                    </p>
                  </motion.div>

                  {/* Verification Success Message */}
                  <AnimatePresence>
                    {verificationSent && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
                      >
                        <div className="flex items-center space-x-3">
                          <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-green-800">
                              Verification Email Sent!
                            </p>
                            <p className="text-sm text-green-700 mt-1">
                              Please check your inbox and verify your email to
                              continue.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form */}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Username Field */}
                    <motion.div variants={fadeIn}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center space-x-2">
                          <UserIcon className="w-4 h-4 text-gray-500" />
                          <span>Username</span>
                        </div>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          {...register("username", {
                            required: "Username is required",
                            minLength: {
                              value: 3,
                              message: "Minimum 3 characters required",
                            },
                            pattern: {
                              value: /^[a-zA-Z0-9_]+$/,
                              message:
                                "Only letters, numbers and underscores allowed",
                            },
                          })}
                          className={`w-full px-4 py-3 pl-11 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                            errors.username
                              ? "border-red-300 focus:ring-red-500/20 bg-red-50"
                              : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
                          }`}
                          placeholder="john_doe"
                        />
                        <UserIcon
                          className={`absolute left-3 top-3.5 w-5 h-5 ${
                            errors.username ? "text-red-400" : "text-gray-400"
                          }`}
                        />
                      </div>
                      {errors.username && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-600 text-sm mt-2 flex items-center"
                        >
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                          {errors.username.message}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Email Field */}
                    <motion.div variants={fadeIn}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center space-x-2">
                          <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                          <span>Email Address</span>
                        </div>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          className={`w-full px-4 py-3 pl-11 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                            errors.email
                              ? "border-red-300 focus:ring-red-500/20 bg-red-50"
                              : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
                          }`}
                          placeholder="john@example.com"
                        />
                        <EnvelopeIcon
                          className={`absolute left-3 top-3.5 w-5 h-5 ${
                            errors.email ? "text-red-400" : "text-gray-400"
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-600 text-sm mt-2 flex items-center"
                        >
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                          {errors.email.message}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Password Field */}
                    <motion.div variants={fadeIn}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center space-x-2">
                          <LockClosedIcon className="w-4 h-4 text-gray-500" />
                          <span>Password</span>
                        </div>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          {...register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message: "Minimum 6 characters required",
                            },
                            pattern: {
                              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                              message: "Include uppercase, lowercase & number",
                            },
                          })}
                          className={`w-full px-4 py-3 pl-11 pr-11 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                            errors.password
                              ? "border-red-300 focus:ring-red-500/20 bg-red-50"
                              : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
                          }`}
                          placeholder="••••••••"
                        />
                        <LockClosedIcon
                          className={`absolute left-3 top-3.5 w-5 h-5 ${
                            errors.password ? "text-red-400" : "text-gray-400"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="w-5 h-5" />
                          ) : (
                            <EyeIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-600 text-sm mt-2 flex items-center"
                        >
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                          {errors.password.message}
                        </motion.p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          Must be at least 6 characters with uppercase,
                          lowercase, and a number
                        </p>
                      </div>
                    </motion.div>

                    {/* Terms Agreement */}
                    <motion.div
                      variants={fadeIn}
                      className="flex items-start space-x-3"
                    >
                      <input
                        type="checkbox"
                        id="terms"
                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div variants={fadeIn} className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 px-6 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <>
                            <span>Create Account</span>
                            <ArrowRightIcon className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </form>

                  {/* Divider */}
                  <motion.div
                    variants={fadeIn}
                    className="my-8 flex items-center"
                  >
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-4 text-sm text-gray-500">
                      Or continue with
                    </span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </motion.div>

                  {/* Social Signup */}
                  <motion.div
                    variants={fadeIn}
                    className="grid grid-cols-2 gap-3 mb-8"
                  >
                    <button
                      type="button"
                      className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="text-sm font-medium">Google</span>
                    </button>
                    <button
                      type="button"
                      className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="#000000"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
                      </svg>
                      <span className="text-sm font-medium">Facebook</span>
                    </button>
                  </motion.div>

                  {/* Bottom Links */}
                  <motion.div variants={fadeIn} className="text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <a
                        href="/login"
                        className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                      >
                        Sign in here
                      </a>
                    </p>
                    <p className="text-xs text-gray-500 mt-4">
                      By signing up, you agree to our{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        Terms
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Signup;
