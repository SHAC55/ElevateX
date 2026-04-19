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
  `rounded-full border px-3 py-2 text-sm font-medium transition ${
    active
      ? "border-[#20160f] bg-[#20160f] text-white"
      : "border-[#e8d8c2] bg-[#fffaf4] text-[#6e5b46] hover:border-[#d39b5e] hover:text-[#1e140d]"
  }`;

const Section = ({ title, children }) => (
  <div className="rounded-[26px] border border-[#efe3d2] bg-[linear-gradient(135deg,#fff8ef_0%,#fffdf9_100%)] p-5">
    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#866f55]">{title}</div>
    <div className="mt-4">{children}</div>
  </div>
);

const EditCareer = ({ formData, onFieldChange, onToggle }) => {
  return (
    <div className="space-y-5">
      <Section title="Career Direction">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#3f2d1f]">Current role</span>
            <input
              value={formData.currentRole}
              onChange={(event) => onFieldChange("currentRole", event.target.value)}
              className="w-full rounded-[20px] border border-[#e8d8c2] bg-[#fffaf4] px-4 py-3 text-[#1e140d] outline-none transition focus:border-[#d39b5e] focus:ring-4 focus:ring-[#f5dfc0]"
            />
          </label>

          <div>
            <span className="mb-2 block text-sm font-medium text-[#3f2d1f]">Target roles</span>
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
              className="w-full rounded-[20px] border border-[#e8d8c2] bg-[#fffaf4] px-4 py-3 text-[#1e140d] outline-none transition focus:border-[#d39b5e] focus:ring-4 focus:ring-[#f5dfc0]"
            >
              <option value="">Education</option>
              {EDUCATION_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select
              value={formData.experience}
              onChange={(event) => onFieldChange("experience", event.target.value)}
              className="w-full rounded-[20px] border border-[#e8d8c2] bg-[#fffaf4] px-4 py-3 text-[#1e140d] outline-none transition focus:border-[#d39b5e] focus:ring-4 focus:ring-[#f5dfc0]"
            >
              <option value="">Experience</option>
              {EXPERIENCE_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select
              value={formData.timeline}
              onChange={(event) => onFieldChange("timeline", event.target.value)}
              className="w-full rounded-[20px] border border-[#e8d8c2] bg-[#fffaf4] px-4 py-3 text-[#1e140d] outline-none transition focus:border-[#d39b5e] focus:ring-4 focus:ring-[#f5dfc0]"
            >
              <option value="">Timeline</option>
              {TIMELINE_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select
              value={formData.availability}
              onChange={(event) => onFieldChange("availability", event.target.value)}
              className="w-full rounded-[20px] border border-[#e8d8c2] bg-[#fffaf4] px-4 py-3 text-[#1e140d] outline-none transition focus:border-[#d39b5e] focus:ring-4 focus:ring-[#f5dfc0]"
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
              className="w-full rounded-[20px] border border-[#e8d8c2] bg-[#fffaf4] px-4 py-3 text-[#1e140d] outline-none transition focus:border-[#d39b5e] focus:ring-4 focus:ring-[#f5dfc0]"
            >
              <option value="">Learning style</option>
              {LEARNING_STYLE_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select
              value={formData.collaborationStyle}
              onChange={(event) => onFieldChange("collaborationStyle", event.target.value)}
              className="w-full rounded-[20px] border border-[#e8d8c2] bg-[#fffaf4] px-4 py-3 text-[#1e140d] outline-none transition focus:border-[#d39b5e] focus:ring-4 focus:ring-[#f5dfc0]"
            >
              <option value="">Collaboration style</option>
              {COLLABORATION_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select
              value={formData.riskAppetite}
              onChange={(event) => onFieldChange("riskAppetite", event.target.value)}
              className="w-full rounded-[20px] border border-[#e8d8c2] bg-[#fffaf4] px-4 py-3 text-[#1e140d] outline-none transition focus:border-[#d39b5e] focus:ring-4 focus:ring-[#f5dfc0]"
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
