import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaChartLine,
  FaCheckCircle,
  FaCompass,
  FaLightbulb,
  FaProjectDiagram,
  FaRoute,
} from "react-icons/fa";

const unlockCards = [
  {
    title: "Clear direction",
    description: "Choose a role and stop bouncing between random tutorials and guesses.",
    icon: <FaCompass />,
  },
  {
    title: "Learning order",
    description: "Get a sequence for what to learn first, next, and later.",
    icon: <FaRoute />,
  },
  {
    title: "Project proof",
    description: "Build artifacts that make your progress visible to others.",
    icon: <FaProjectDiagram />,
  },
  {
    title: "Progress tracking",
    description: "See whether you are actually moving closer to readiness.",
    icon: <FaChartLine />,
  },
];

const UnselectedPath = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.1),_transparent_22%),linear-gradient(180deg,_#fffaf2_0%,_#f3e7d2_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <section className="overflow-hidden rounded-[38px] border border-[#ead8c0] bg-[#1b140f] text-white shadow-[0_30px_90px_rgba(61,36,10,0.24)]">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#fdba74] bg-[#fff1dc] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7c2d12]">
                <FaCompass />
                CareerOS
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Pick a direction first. Everything else becomes easier after that.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#efe4d7] sm:text-base">
                CareerOS works best when it has a target to optimize around. Choose your path once,
                then the platform can organize learning, projects, and execution around that goal.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/career-form")}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#1b140f]"
                >
                  Choose career path
                  <FaArrowRight />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/career-form")}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
                >
                  Get suggestions
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">What you unlock</div>
                <div className="mt-3 text-3xl font-semibold">4 core systems</div>
                <div className="mt-2 text-sm text-[#f0e4d8]">Plan, skills, proof, and progress in one flow.</div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">Best first move</div>
                <div className="mt-3 text-2xl font-semibold">Set your target role</div>
                <div className="mt-2 text-sm text-[#f0e4d8]">The product becomes more precise after this step.</div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 sm:col-span-2">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#ffd8b0]">
                  <FaLightbulb />
                  Why this matters
                </div>
                <div className="mt-3 text-sm leading-7 text-[#f0e4d8]">
                  Without a defined direction, learning usually becomes broad, slow, and hard to convert
                  into projects or interviews. Choosing a path gives the rest of the product a job to do.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {unlockCards.map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-[#eadfce] bg-white/92 p-5 shadow-[0_20px_60px_rgba(89,60,27,0.08)]"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1f160f] text-white">
                {item.icon}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[#1f160f]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6b5844]">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[32px] border border-[#eadfce] bg-white/92 p-6 shadow-[0_24px_70px_rgba(89,60,27,0.08)]">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#8e775c]">Before you start</div>
              <h2 className="mt-2 text-2xl font-semibold text-[#1f160f]">What happens after you choose a path</h2>
              <div className="mt-5 space-y-3 text-sm leading-7 text-[#6b5844]">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="mt-1 text-[#c56c19]" />
                  <span>Your plan is generated around a role instead of generic growth advice.</span>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="mt-1 text-[#c56c19]" />
                  <span>Skills and projects become easier to prioritize because they map to a target.</span>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="mt-1 text-[#c56c19]" />
                  <span>Progress can be measured against a real outcome, not just activity.</span>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#eadfce] bg-[#fff8ef] p-5">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#8e775c]">Next step</div>
              <h3 className="mt-2 text-2xl font-semibold text-[#1f160f]">Create your career profile</h3>
              <p className="mt-3 text-sm leading-7 text-[#6b5844]">
                Tell the system your current level, target direction, and constraints. That gives
                CareerOS enough signal to shape your plan.
              </p>
              <button
                type="button"
                onClick={() => navigate("/career-form")}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1f160f] px-5 py-3 text-sm font-semibold text-white"
              >
                Start profile setup
                <FaArrowRight />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UnselectedPath;
