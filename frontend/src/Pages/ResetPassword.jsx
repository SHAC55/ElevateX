import React, { useState } from "react";
import loginImg from "../assets/login.jpg";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/auth";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [apiMessage, setApiMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = searchParams.get("token");

  const onSubmit = async ({ password }) => {
    setApiMessage("");
    setLoading(true);
    try {
       

      const res = await resetPassword( {
        token,
        password,
      });
      setApiMessage(res.message || "Password reset successful.");
      setTimeout(() => navigate("/login"), 1500); // redirect after short delay
    } catch (err) {
      setApiMessage(err?.response?.data?.message || "Reset failed.");
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
            alt="Reset Password Visual"
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
            Reset Password
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Enter a new password to reset your account access.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* API Message */}
            {apiMessage && (
              <p className="text-blue-600 text-sm font-medium text-center">{apiMessage}</p>
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
              {loading ? "Resetting..." : "Reset Password"}
            </motion.button>
          </form>

          {/* Back to login */}
          <p className="text-sm text-center text-gray-600 mt-6">
            Go back to{" "}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </a>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ResetPassword;
