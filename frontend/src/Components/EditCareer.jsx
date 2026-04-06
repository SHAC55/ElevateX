import React from "react";
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
} from "../lib/careerProfile";

const chipClass = (active) =>
  `rounded-full border px-3 py-2 text-sm transition ${
    active
      ? "border-slate-900 bg-slate-900 text-white"
      : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
  }`;

const Section = ({ title, children }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    <div className="mt-4">{children}</div>
  </div>
);

const EditCareer = ({ formData, onFieldChange, onToggle }) => {
  return (
    <div className="space-y-5">
      <Section title="Career Direction">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Current role</span>
            <input
              value={formData.currentRole}
              onChange={(event) => onFieldChange("currentRole", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            />
          </label>

          <div>
            <span className="mb-2 block text-sm font-medium text-slate-700">Target roles</span>
            <div className="flex flex-wrap gap-2">
              {CAREER_ROLE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={chipClass(formData.targetRoles.includes(option))}
                  onClick={() => onToggle("targetRoles", option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Skill Map">
        <div className="flex flex-wrap gap-2">
          {SKILL_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={chipClass(formData.primarySkills.includes(option))}
              onClick={() => onToggle("primarySkills", option)}
            >
              {option}
            </button>
          ))}
        </div>
      </Section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Constraints">
          <div className="space-y-4">
            <select
              value={formData.education}
              onChange={(event) => onFieldChange("education", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            >
              <option value="">Education</option>
              {EDUCATION_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select
              value={formData.experience}
              onChange={(event) => onFieldChange("experience", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            >
              <option value="">Experience</option>
              {EXPERIENCE_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select
              value={formData.timeline}
              onChange={(event) => onFieldChange("timeline", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            >
              <option value="">Timeline</option>
              {TIMELINE_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select
              value={formData.availability}
              onChange={(event) => onFieldChange("availability", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            >
              <option value="">Availability</option>
              {AVAILABILITY_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </Section>

        <Section title="Work Style DNA">
          <div className="space-y-4">
            <select
              value={formData.learningStyle}
              onChange={(event) => onFieldChange("learningStyle", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            >
              <option value="">Learning style</option>
              {LEARNING_STYLE_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select
              value={formData.collaborationStyle}
              onChange={(event) => onFieldChange("collaborationStyle", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            >
              <option value="">Collaboration style</option>
              {COLLABORATION_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select
              value={formData.riskAppetite}
              onChange={(event) => onFieldChange("riskAppetite", event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            >
              <option value="">Risk appetite</option>
              {RISK_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
            <div className="flex flex-wrap gap-2">
              {MOTIVATION_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={chipClass(formData.motivationDrivers.includes(option))}
                  onClick={() => onToggle("motivationDrivers", option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default EditCareer;
