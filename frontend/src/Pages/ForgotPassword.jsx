import React, { useState } from "react";
import loginImg from "../assets/login.jpg";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {forgotPassword} from "../api/auth";
const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [apiMessage, setApiMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async ({ email }) => {
    setApiMessage("");
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setApiMessage(res.message || "Check your email for the reset link.");
    } catch (err) {
      setApiMessage(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
      className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Left Image */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 hidden md:block"
        >
          <img
            src={loginImg}
            className="w-full h-full object-cover"
            alt="Forgot Password Visual"
          />
        </motion.div>

        {/* Right Form */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 bg-slate-50 p-8"
        >
          <h1 className="text-3xl font-bold mb-3 bg-black text-white w-56 text-center p-1 rounded-md">
            Forgot Password
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Enter your registered email and we’ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Message */}
            {apiMessage && (
              <p className="text-sm text-center font-medium text-blue-600">{apiMessage}</p>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md transition text-white ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </motion.button>
          </form>

          {/* Back to Login */}
          <p className="text-sm text-center text-gray-600 mt-6">
            Remembered your password?{" "}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Log in
            </a>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;
