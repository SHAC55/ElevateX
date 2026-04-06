import React, { useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { chooseCareer } from "../api/career";
import {
  AVAILABILITY_OPTIONS,
  CAREER_ROLE_OPTIONS,
  COLLABORATION_OPTIONS,
  EDUCATION_OPTIONS,
  EXPERIENCE_OPTIONS,
  LEARNING_STYLE_OPTIONS,
  MOTIVATION_OPTIONS,
  RISK_OPTIONS,
  SKILL_OPTIONS,
  TIMELINE_OPTIONS,
  buildCareerPayload,
  emptyCareerProfile,
} from "../lib/careerProfile";

const pillClass = (active) =>
  `rounded-full border px-4 py-2 text-sm font-medium transition ${
    active
      ? "border-slate-900 bg-slate-900 text-white"
      : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
  }`;

const sectionCard =
  "rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur";

const CareerForm = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(() => emptyCareerProfile());
  const [submitting, setSubmitting] = useState(false);

  const missingRequired = useMemo(() => {
    const missing = [];
    if (!values.currentRole.trim()) missing.push("current role");
    if (!values.targetRoles.length) missing.push("target role");
    if (!values.primarySkills.length) missing.push("skills");
    if (!values.timeline) missing.push("timeline");
    if (!values.availability) missing.push("availability");
    return missing;
  }, [values]);

  const toggleArrayValue = (field, option) => {
    setValues((prev) => {
      const current = prev[field] || [];
      const exists = current.includes(option);
      return {
        ...prev,
        [field]: exists ? current.filter((item) => item !== option) : [...current, option],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (missingRequired.length) {
      toast.error(`Missing: ${missingRequired.join(", ")}`);
      return;
    }

    try {
      setSubmitting(true);
      const payload = buildCareerPayload(values);
      await chooseCareer(payload);
      toast.success("CareerOS profile saved");
      navigate("/career-os");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save career profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <ToastContainer />

      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <div className="inline-flex rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
            CareerOS Intake
          </div>
          <h1 className="mt-5 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Build a living career profile, not a one-time form
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            This profile feeds planning, analytics, resume strategy, interview prep, and weekly AI briefings.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className={sectionCard}>
            <h2 className="text-2xl font-semibold text-slate-900">Career Direction</h2>
            <p className="mt-2 text-sm text-slate-600">Tell us where you are now and where you want to go.</p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Current role or identity</span>
                <input
                  value={values.currentRole}
                  onChange={(event) => setValues((prev) => ({ ...prev, currentRole: event.target.value }))}
                  placeholder="Student builder, backend engineer, designer..."
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                />
              </label>

              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700">Primary target roles</span>
                <div className="flex flex-wrap gap-2">
                  {CAREER_ROLE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleArrayValue("targetRoles", option)}
                      className={pillClass(values.targetRoles.includes(option))}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={sectionCard}>
            <h2 className="text-2xl font-semibold text-slate-900">Skill Signal Map</h2>
            <p className="mt-2 text-sm text-slate-600">Choose the abilities you can already leverage or learn fast.</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleArrayValue("primarySkills", option)}
                  className={pillClass(values.primarySkills.includes(option))}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className={sectionCard}>
              <h2 className="text-2xl font-semibold text-slate-900">Constraints</h2>
              <div className="mt-5 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Education</span>
                  <select
                    value={values.education}
                    onChange={(event) => setValues((prev) => ({ ...prev, education: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-900"
                  >
                    <option value="">Select education</option>
                    {EDUCATION_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Experience</span>
                  <select
                    value={values.experience}
                    onChange={(event) => setValues((prev) => ({ ...prev, experience: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-900"
                  >
                    <option value="">Select experience</option>
                    {EXPERIENCE_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Timeline to meaningful outcome</span>
                  <select
                    value={values.timeline}
                    onChange={(event) => setValues((prev) => ({ ...prev, timeline: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-900"
                  >
                    <option value="">Select timeline</option>
                    {TIMELINE_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Availability</span>
                  <select
                    value={values.availability}
                    onChange={(event) => setValues((prev) => ({ ...prev, availability: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-900"
                  >
                    <option value="">Select availability</option>
                    {AVAILABILITY_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
              </div>
            </div>

            <div className={sectionCard}>
              <h2 className="text-2xl font-semibold text-slate-900">Work Style DNA</h2>
              <div className="mt-5 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Learning style</span>
                  <select
                    value={values.learningStyle}
                    onChange={(event) => setValues((prev) => ({ ...prev, learningStyle: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-900"
                  >
                    <option value="">Select style</option>
                    {LEARNING_STYLE_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Collaboration style</span>
                  <select
                    value={values.collaborationStyle}
                    onChange={(event) => setValues((prev) => ({ ...prev, collaborationStyle: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-900"
                  >
                    <option value="">Select style</option>
                    {COLLABORATION_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Risk appetite</span>
                  <select
                    value={values.riskAppetite}
                    onChange={(event) => setValues((prev) => ({ ...prev, riskAppetite: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-900"
                  >
                    <option value="">Select risk level</option>
                    {RISK_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>

                <div>
                  <span className="mb-2 block text-sm font-medium text-slate-700">Motivation drivers</span>
                  <div className="flex flex-wrap gap-2">
                    {MOTIVATION_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleArrayValue("motivationDrivers", option)}
                        className={pillClass(values.motivationDrivers.includes(option))}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={sectionCard}>
            <h2 className="text-2xl font-semibold text-slate-900">Optional Context</h2>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Resume or background notes</span>
                <textarea
                  rows={8}
                  value={values.resumeRaw}
                  onChange={(event) => setValues((prev) => ({ ...prev, resumeRaw: event.target.value }))}
                  placeholder="Paste resume summary, project history, internships, achievements..."
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-900"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Anything the AI should optimize around?</span>
                <textarea
                  rows={8}
                  value={values.notes}
                  onChange={(event) => setValues((prev) => ({ ...prev, notes: event.target.value }))}
                  placeholder="Examples: need internship fast, want remote roles, want startup fit, weak in DSA..."
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-900"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 rounded-[28px] border border-slate-900 bg-slate-900 px-6 py-5 text-white sm:flex-row sm:items-center">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-slate-300">What happens next</div>
              <p className="mt-2 max-w-2xl text-sm text-slate-200">
                We will generate a strategic career plan, skill graph, roadmap, portfolio project stack, market signals, and analytics-ready readiness model.
              </p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving profile..." : "Build My CareerOS"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CareerForm;
