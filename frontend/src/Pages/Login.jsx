// import React, { useEffect, useState } from "react";
// import loginImg from "../assets/login.jpg";
// import { useForm } from "react-hook-form";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { FcGoogle } from "react-icons/fc";
// import { FaGithub } from "react-icons/fa";

// const Login = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const { login, user } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState("");

//   // Redirect if already logged in
//   useEffect(() => {
//     if (user) navigate("/home");
//   }, [user, navigate]);

//   const onSubmit = async (data) => {
//     setApiError("");
//     setLoading(true);
//     try {
//       await login(data.email, data.password);
//       navigate("/home");
//     } catch (err) {
//       setApiError(err?.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={{
//         hidden: { opacity: 0, y: 40 },
//         visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
//       }}
//       className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4"
//     >
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//         className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden"
//       >
//         {/* Left - Image */}
//         <motion.div
//           initial={{ x: -100, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.6 }}
//           className="md:w-1/2 md:block"
//         >
//           <img
//             src={loginImg}
//             className="w-full h-full object-cover"
//             alt="Login Visual"
//           />
//         </motion.div>

//         {/* Right - Form */}
//         <motion.div
//           initial={{ x: 100, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.6 }}
//           className="w-full md:w-1/2 bg-slate-50 p-8"
//         >
//           <h1 className="text-3xl font-bold mb-3 bg-black text-white w-40 text-center p-1 rounded-md">
//             ElevateX
//           </h1>
//           <h2 className="text-lg text-gray-800 font-medium mb-1">Welcome back 👋</h2>
//           <p className="text-sm text-gray-600 mb-6">
//             Let’s get you hired. Access your personalized dashboard and roadmap.
//           </p>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 {...register("email", { required: "Email is required" })}
//                 className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 {...register("password", {
//                   required: "Password is required",
//                   minLength: { value: 6, message: "Minimum 6 characters required" },
//                 })}
//                 className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {errors.password && (
//                 <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
//               )}
//               <div className="text-right mt-1">
//                 <a
//                   href="/forgot-password"
//                   className="text-sm text-blue-600 hover:underline"
//                 >
//                   Forgot Password?
//                 </a>
//               </div>
//             </div>

//             {/* API Error */}
//             {apiError && (
//               <p className="text-red-600 text-sm font-medium text-center">
//                 {apiError}
//               </p>
//             )}

//             {/* Submit Button */}
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               type="submit"
//               disabled={loading}
//               className={`w-full py-2 rounded-md transition text-white ${
//                 loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {loading ? "Logging in..." : "Log In"}
//             </motion.button>
//           </form>

    
// <div className="mt-6 text-center">
//   <p className="text-sm text-gray-600 mb-2">or continue with</p>
//   <div className="flex gap-4 justify-center">
//     <a
//       href="http://localhost:5000/api/auth/google"
//       className="flex items-center justify-center bg-white border border-gray-300 rounded-full p-3 hover:shadow-md transition"
//       title="Continue with Google"
//     >
//       <FcGoogle size={24} />
//     </a>
//     <a
//       href="http://localhost:5000/api/auth/github"
//       className="flex items-center justify-center bg-white border border-gray-300 rounded-full p-3 hover:shadow-md transition"
//       title="Continue with GitHub"
//     >
//       <FaGithub size={24} className="text-black" />
//     </a>
//   </div>
// </div>

//           {/* Sign Up Prompt */}
//           <p className="text-sm text-center text-gray-600 mt-6">
//             Don’t have an account?{" "}
//             <a href="/signup" className="text-blue-600 hover:underline font-medium">
//               Sign up
//             </a>
//           </p>
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default Login;

import React, { useEffect, useState } from "react";
import loginImg from "../assets/login.jpg";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ useLocation added
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ✅
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [linkedBanner, setLinkedBanner] = useState(false); // ✅ state for banner

  // Check if coming from Google link
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("linked") === "true") {
      setLinkedBanner(true);
    }
  }, [location.search]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  const onSubmit = async (data) => {
    setApiError("");
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate("/home");
    } catch (err) {
      setApiError(err?.response?.data?.message || "Login failed");
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
            src={loginImg}
            className="w-full h-full object-cover"
            alt="Login Visual"
          />
        </motion.div>

        {/* Right - Form */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 bg-slate-50 p-8"
        >
          <h1 className="text-3xl font-bold mb-3 bg-black text-white w-40 text-center p-1 rounded-md">
            ElevateX
          </h1>
          <h2 className="text-lg text-gray-800 font-medium mb-1">Welcome back 👋</h2>
          <p className="text-sm text-gray-600 mb-6">
            Let’s get you hired. Access your personalized dashboard and roadmap.
          </p>

          {/* ✅ Linked banner */}
          {linkedBanner && (
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded mb-4 text-sm">
              Your existing account has been linked to Google login. You can now
              sign in with Google.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
                  minLength: { value: 6, message: "Minimum 6 characters required" },
                })}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
              <div className="text-right mt-1">
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* API Error */}
            {apiError && (
              <p className="text-red-600 text-sm font-medium text-center">
                {apiError}
              </p>
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
              {loading ? "Logging in..." : "Log In"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">or continue with</p>
            <div className="flex gap-4 justify-center">
              <a
                href="http://localhost:5000/api/auth/google"
                className="flex items-center justify-center bg-white border border-gray-300 rounded-full p-3 hover:shadow-md transition"
                title="Continue with Google"
              >
                <FcGoogle size={24} />
              </a>
              <a
                href="http://localhost:5000/api/auth/github"
                className="flex items-center justify-center bg-white border border-gray-300 rounded-full p-3 hover:shadow-md transition"
                title="Continue with GitHub"
              >
                <FaGithub size={24} className="text-black" />
              </a>
            </div>
          </div>

          {/* Sign Up Prompt */}
          <p className="text-sm text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline font-medium">
              Sign up
            </a>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
