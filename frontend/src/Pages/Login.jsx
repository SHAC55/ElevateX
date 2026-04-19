import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Flame, ShieldCheck, Sparkles } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const AUTH_POINTS = [
  "ElevateX unifies job tracking, portfolio proof, interview prep, and growth signals in one product.",
  "A focused command center replaces scattered tools with one clear, recruiter-ready workflow.",
  "Warm analytics, sharp prioritization, and momentum tracking make progress visible at a glance.",
];

const MotionSection = motion.section;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [linkedBanner, setLinkedBanner] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("linked") === "true") {
      setLinkedBanner(true);
    }
  }, [location.search]);

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_22%),linear-gradient(180deg,_#fffaf2_0%,_#f3e7d2_100%)] px-4 py-6 text-[#1e140d] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1380px] items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <MotionSection
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden rounded-[36px] border border-[#ead8c0] bg-[#1b140f] p-7 text-white shadow-[0_30px_90px_rgba(61,36,10,0.24)] sm:p-8"
          >
            <div className="absolute -left-10 top-4 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="absolute right-6 top-24 h-44 w-44 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#fdba74] bg-[#fff1dc] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7c2d12] shadow-[0_10px_30px_rgba(251,146,60,0.18)]">
                <Sparkles size={14} />
                ElevateX Access
              </div>
              <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
                A career command center designed to look premium and work hard.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#efe4d7] sm:text-base">
                ElevateX brings applications, readiness, portfolio assets, and interview progress into
                one polished workspace built for modern career growth.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">Focus</div>
                  <div className="mt-3 text-2xl font-semibold">Focused UX</div>
                  <div className="mt-2 text-sm text-[#f0e4d8]">A clean interface that surfaces signal instead of clutter.</div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">Signals</div>
                  <div className="mt-3 text-2xl font-semibold">Live readiness</div>
                  <div className="mt-2 text-sm text-[#f0e4d8]">Resume, interview, skills, and proof stay connected in one system.</div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-orange-500/20 to-transparent p-4">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#ffd8b0]">
                    <Flame size={14} />
                    Momentum
                  </div>
                  <div className="mt-3 text-3xl font-semibold">Always on</div>
                  <div className="mt-2 text-sm text-[#f2dcc8]">A product rhythm built around visibility, movement, and conversion.</div>
                </div>
              </div>

              <div className="mt-8 rounded-[28px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] p-5">
                <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f5dec5]">
                  <ShieldCheck size={15} />
                  Product highlights
                </div>
                <div className="mt-5 space-y-4">
                  {AUTH_POINTS.map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-2xl bg-white/10">
                        <CheckCircle2 size={16} className="text-[#fdba74]" />
                      </div>
                      <p className="text-sm leading-7 text-[#eadccf]">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MotionSection>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="rounded-[36px] border border-[#eadbc5] bg-white/92 p-6 shadow-[0_24px_70px_rgba(89,60,27,0.08)] sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-full bg-[#20160f] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                Login
              </div>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full border border-[#eadbc5] bg-[#fff8ef] px-4 py-2 text-sm font-semibold text-[#6e5b46] transition hover:border-[#dcb487] hover:text-[#20160f]"
              >
                Create account
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="mt-6">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">Welcome back</div>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Sign in to ElevateX.</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#6e5b46]">
                Access the platform where career planning, proof-building, and opportunity tracking
                live inside one cohesive product experience.
              </p>
            </div>

            {linkedBanner && (
              <div className="mt-6 rounded-[24px] border border-[#f4c98d] bg-[#fff3df] px-5 py-4 text-sm leading-6 text-[#8a5518]">
                Your existing account has been linked to Google login. You can now sign in with Google.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#3f2d1f]">Email</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="mt-2 w-full rounded-[20px] border border-[#e8d8c2] bg-[#fffaf4] px-4 py-3 text-[#1e140d] outline-none transition placeholder:text-[#a28b72] focus:border-[#d39b5e] focus:ring-4 focus:ring-[#f5dfc0]"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-2 text-sm text-[#c2410c]">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <label className="block text-sm font-semibold text-[#3f2d1f]">Password</label>
                  <Link to="/forgot-password" className="text-sm font-medium text-[#a45a16] transition hover:text-[#7c2d12]">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters required" },
                  })}
                  className="mt-2 w-full rounded-[20px] border border-[#e8d8c2] bg-[#fffaf4] px-4 py-3 text-[#1e140d] outline-none transition placeholder:text-[#a28b72] focus:border-[#d39b5e] focus:ring-4 focus:ring-[#f5dfc0]"
                  placeholder="Enter your password"
                />
                {errors.password && <p className="mt-2 text-sm text-[#c2410c]">{errors.password.message}</p>}
              </div>

              {apiError && (
                <div className="rounded-[20px] border border-[#f0b8aa] bg-[#fff1ed] px-4 py-3 text-sm font-medium text-[#b42318]">
                  {apiError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${
                  loading
                    ? "cursor-not-allowed bg-[#d8b28a] text-white"
                    : "bg-[#20160f] text-white hover:bg-[#362518]"
                }`}
              >
                {loading ? "Logging in..." : "Log in"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="mt-8 rounded-[28px] border border-[#efe3d2] bg-[linear-gradient(135deg,#fff8ef_0%,#fffdf9_100%)] p-5">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">Quick access</div>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="http://localhost:5000/api/auth/google"
                  className="inline-flex flex-1 items-center justify-center gap-3 rounded-full border border-[#eadbc5] bg-white px-5 py-3 text-sm font-semibold text-[#20160f] transition hover:-translate-y-0.5 hover:border-[#dcb487]"
                  title="Continue with Google"
                >
                  <FcGoogle size={22} />
                  Continue with Google
                </a>
                <a
                  href="http://localhost:5000/api/auth/github"
                  className="inline-flex flex-1 items-center justify-center gap-3 rounded-full border border-[#eadbc5] bg-white px-5 py-3 text-sm font-semibold text-[#20160f] transition hover:-translate-y-0.5 hover:border-[#dcb487]"
                  title="Continue with GitHub"
                >
                  <FaGithub size={20} />
                  Continue with GitHub
                </a>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-[#6e5b46]">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="font-semibold text-[#a45a16] transition hover:text-[#7c2d12]">
                Sign up
              </Link>
            </p>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default Login;
