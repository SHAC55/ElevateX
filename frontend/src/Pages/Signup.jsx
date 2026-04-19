import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, GraduationCap, Sparkles, Target } from "lucide-react";
import { register as registerUser } from "../api/auth";

const STARTER_STEPS = [
  "ElevateX combines planning, execution, and proof-building inside one connected workspace.",
  "Career roadmaps, interview practice, and portfolio evidence are shaped into one product flow.",
  "A refined dashboard turns progress into a visible, motivating experience instead of hidden effort.",
];

const Signup = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [successMsg, setSuccessMsg] = useState("");
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setApiError("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      await registerUser(data);
      reset();
      setSuccessMsg("Registration successful. Check your email to verify your account.");
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      setApiError(err.response?.data?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_22%),linear-gradient(180deg,_#fffaf2_0%,_#f3e7d2_100%)] px-4 py-6 text-[#1e140d] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1380px] items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden rounded-[36px] border border-[#ead8c0] bg-[#1b140f] p-7 text-white shadow-[0_30px_90px_rgba(61,36,10,0.24)] sm:p-8"
          >
            <div className="absolute -left-12 top-6 h-44 w-44 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="absolute right-2 top-20 h-44 w-44 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#fdba74] bg-[#fff1dc] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7c2d12] shadow-[0_10px_30px_rgba(251,146,60,0.18)]">
                <Sparkles size={14} />
                ElevateX Onboarding
              </div>
              <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
                One product for planning the path and proving the work.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#efe4d7] sm:text-base">
                ElevateX is built as a polished operating layer for career growth, blending roadmap,
                readiness, and portfolio signals into a single premium experience.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">Direction</div>
                  <div className="mt-3 flex items-center gap-2 text-2xl font-semibold">
                    <Target size={20} className="text-[#fdba74]" />
                    Goal-led
                  </div>
                  <div className="mt-2 text-sm text-[#f0e4d8]">Structured around clear targets, not disconnected tasks.</div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">Learning</div>
                  <div className="mt-3 flex items-center gap-2 text-2xl font-semibold">
                    <GraduationCap size={20} className="text-[#fdba74]" />
                    Skill loops
                  </div>
                  <div className="mt-2 text-sm text-[#f0e4d8]">Learning, practice, and evidence stay connected by design.</div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-orange-500/20 to-transparent p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-[#ffd8b0]">Outcome</div>
                  <div className="mt-3 text-3xl font-semibold">Hireability</div>
                  <div className="mt-2 text-sm text-[#f2dcc8]">Every surface is oriented around visible, recruiter-facing value.</div>
                </div>
              </div>

              <div className="mt-8 rounded-[28px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] p-5">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">Why ElevateX feels different</div>
                <div className="mt-5 space-y-4">
                  {STARTER_STEPS.map((step) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-2xl bg-white/10">
                        <CheckCircle2 size={16} className="text-[#fdba74]" />
                      </div>
                      <p className="text-sm leading-7 text-[#eadccf]">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="rounded-[36px] border border-[#eadbc5] bg-white/92 p-6 shadow-[0_24px_70px_rgba(89,60,27,0.08)] sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-full bg-[#20160f] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                Sign up
              </div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-[#eadbc5] bg-[#fff8ef] px-4 py-2 text-sm font-semibold text-[#6e5b46] transition hover:border-[#dcb487] hover:text-[#20160f]"
              >
                Back to login
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="mt-6">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">Create your account</div>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Join ElevateX.</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#6e5b46]">
                Create an account to enter a product that brings structure, clarity, and momentum to
                the full career-growth journey.
              </p>
            </div>

            {successMsg && (
              <div className="mt-6 rounded-[24px] border border-[#cdddbe] bg-[#eff9e9] px-5 py-4 text-sm leading-6 text-[#396a2d]">
                {successMsg}
              </div>
            )}

            {apiError && (
              <div className="mt-6 rounded-[24px] border border-[#f0b8aa] bg-[#fff1ed] px-5 py-4 text-sm leading-6 text-[#b42318]">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#3f2d1f]">Username</label>
                <input
                  type="text"
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Minimum 3 characters required",
                    },
                  })}
                  className="mt-2 w-full rounded-[20px] border border-[#e8d8c2] bg-[#fffaf4] px-4 py-3 text-[#1e140d] outline-none transition placeholder:text-[#a28b72] focus:border-[#d39b5e] focus:ring-4 focus:ring-[#f5dfc0]"
                  placeholder="Choose a username"
                />
                {errors.username && <p className="mt-2 text-sm text-[#c2410c]">{errors.username.message}</p>}
              </div>

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
                <label className="block text-sm font-semibold text-[#3f2d1f]">Password</label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters required",
                    },
                  })}
                  className="mt-2 w-full rounded-[20px] border border-[#e8d8c2] bg-[#fffaf4] px-4 py-3 text-[#1e140d] outline-none transition placeholder:text-[#a28b72] focus:border-[#d39b5e] focus:ring-4 focus:ring-[#f5dfc0]"
                  placeholder="Create a password"
                />
                {errors.password && <p className="mt-2 text-sm text-[#c2410c]">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${
                  submitting
                    ? "cursor-not-allowed bg-[#d8b28a] text-white"
                    : "bg-[#20160f] text-white hover:bg-[#362518]"
                }`}
              >
                {submitting ? "Creating account..." : "Create account"}
                {!submitting && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="mt-8 rounded-[28px] border border-[#efe3d2] bg-[linear-gradient(135deg,#fff8ef_0%,#fffdf9_100%)] p-5">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">Inside the platform</div>
              <p className="mt-3 text-sm leading-7 text-[#6e5b46]">
                From the first screen onward, ElevateX carries the same visual language as `/home`:
                warm surfaces, strong hierarchy, and product-focused clarity.
              </p>
            </div>

            <p className="mt-6 text-center text-sm text-[#6e5b46]">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[#a45a16] transition hover:text-[#7c2d12]">
                Log in
              </Link>
            </p>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default Signup;
