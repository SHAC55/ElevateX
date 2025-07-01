import React from "react";
import { useState } from "react";
import signupImg from "../assets/signup.jpg";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { register as registerUser } from "../api/auth"; // ✅ API call
import { useAuth } from "../context/AuthContext"; // ✅ AuthContext
import { useNavigate } from "react-router-dom";

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Signup = () => {
  const { login } = useAuth(); // ✅ So we can log user in after registration
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


 
  const [successMsg, setSuccessMsg] = useState("");
  const onSubmit = async (data) => {
    try {
     await registerUser(data);
       setSuccessMsg("✅ Registration successful! Please check your email to verify your account.");
    // Auto-login
   
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Left - Image */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 md:block"
        >
          <img
            src={signupImg}
            className="w-full h-full object-cover"
            alt="Signup Visual"
          />
        </motion.div>

        {/* Right - Form */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 bg-slate-50 p-8"
        >
          <motion.h1 className="text-3xl font-bold mb-5 bg-black text-white w-40 text-center p-1 rounded-md">
            ElevateX
          </motion.h1>
          <h2 className="text-lg text-gray-800 font-medium mb-1">
            Create your account and get hired faster
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Set up your dashboard, choose your career path, and start your skill journey.
          </p>
{successMsg && (
  <div className="bg-green-100 text-green-800 border border-green-300 px-4 py-3 rounded mb-5 text-sm">
    {successMsg}
  </div>
)}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters required",
                  },
                })}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters required",
                  },
                })}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Sign Up
            </motion.button>
          </form>

          {/* Login Prompt */}
          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </a>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Signup;
