import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaBookOpen,
  FaChartLine,
  FaCheckCircle,
  FaCompass,
  FaLightbulb,
  FaProjectDiagram,
  FaRocket,
  FaRoute,
  FaUsers,
} from "react-icons/fa";
import { getCareerPlan, getJourneyStatus, startLearningJourney } from "../api/career";
import SkillsSection from "../Components/AI/SkillsSection";
import RoadmapSection from "../Components/AI/RoadmapSection";
import ProjectsSection from "../Components/AI/ProjectsSection";
import ResourcesSection from "../Components/AI/ResourcesSection";

const quickLinkBase =
  "group rounded-[28px] border p-5 transition hover:-translate-y-0.5";

const SECTION_STYLES = {
  skills: {
    icon: <FaLightbulb />,
    title: "Skills",
    href: "/career/plan/skills",
    theme: "border-sky-200 bg-[linear-gradient(135deg,#eff6ff,#f8fdff)]",
    description: "See the capabilities that matter most and start one immediately.",
  },
  roadmap: {
    icon: <FaRoute />,
    title: "Roadmap",
    href: "/career/plan/overview",
    theme: "border-amber-200 bg-[linear-gradient(135deg,#fff7ed,#fffdf8)]",
    description: "Understand the order of execution instead of guessing what comes next.",
  },
  projects: {
    icon: <FaProjectDiagram />,
    title: "Projects",
    href: "/career/plan/projects",
    theme: "border-emerald-200 bg-[linear-gradient(135deg,#ecfdf5,#f7fff9)]",
    description: "Translate learning into proof that supports interviews and applications.",
  },
  resources: {
    icon: <FaBookOpen />,
    title: "Resources",
    href: "/career/plan/resources",
    theme: "border-fuchsia-200 bg-[linear-gradient(135deg,#fdf4ff,#fffaff)]",
    description: "Use curated material instead of losing time searching randomly.",
  },
  communities: {
    icon: <FaUsers />,
    title: "Community",
    href: "/career/plan/communities",
    theme: "border-slate-200 bg-[linear-gradient(135deg,#f8fafc,#ffffff)]",
    description: "Get accountability, feedback, and external momentum.",
  },
  progress: {
    icon: <FaChartLine />,
    title: "Progress",
    href: "/career/plan/progress",
    theme: "border-orange-200 bg-[linear-gradient(135deg,#fff7ed,#fffaf4)]",
    description: "Track output, completion, and whether momentum is compounding.",
  },
};

const MetricCard = ({ label, value, detail, tone = "default" }) => {
  const tones = {
    default: "border-[#eadfce] bg-white text-[#1f160f]",
    dark: "border-[#1f160f] bg-[#1f160f] text-white",
    warm: "border-[#f3d8bc] bg-[#fff4e9] text-[#6b3e12]",
    cool: "border-[#cfe5f3] bg-[#eef8ff] text-[#14425f]",
    green: "border-[#cbe8d7] bg-[#eefcf3] text-[#17543a]",
  };

  return (
    <div className={`rounded-[28px] border p-5 shadow-[0_20px_50px_rgba(89,60,27,0.06)] ${tones[tone] || tones.default}`}>
      <div className="text-[11px] uppercase tracking-[0.22em] opacity-70">{label}</div>
      <div className="mt-3 text-4xl font-semibold">{value}</div>
      {detail ? <div className="mt-2 text-sm opacity-80">{detail}</div> : null}
    </div>
  );
};

const SectionBlock = ({ eyebrow, title, children, action }) => (
  <section className="rounded-[32px] border border-[#eadfce] bg-white/92 p-6 shadow-[0_24px_70px_rgba(89,60,27,0.08)]">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-[#8e775c]">{eyebrow}</div>
        <h2 className="mt-2 text-2xl font-semibold text-[#1f160f]">{title}</h2>
      </div>
      {action}
    </div>
    <div className="mt-5">{children}</div>
  </section>
);

const CareerPlanPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const preloadedPlan = location.state?.plan;

  const [plan, setPlan] = useState(preloadedPlan || null);
  const [loading, setLoading] = useState(!preloadedPlan);
  const [error, setError] = useState("");
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [startingJourney, setStartingJourney] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        let planData = preloadedPlan;
        if (!planData) {
          planData = await getCareerPlan();
        }
        setPlan(planData);
        const status = await getJourneyStatus();
        setJourneyStarted(Boolean(status.journeyStarted));
      } catch (err) {
        console.error("Error loading career plan", err);
        setError("Unable to load your career plan right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [preloadedPlan]);

  const flattenSkills = () => {
    const skillObj = plan?.skills || plan?.raw?.skills || {};
    return Object.values(skillObj)
      .flat()
      .filter((skill) => typeof skill === "string" && skill.trim() !== "");
  };

  const transformResources = () => {
    const resObj = plan?.resources || plan?.raw?.resources || {};
    return Object.entries(resObj).map(([key, value]) => ({
      type: key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
      list: Array.isArray(value) ? value : [],
    }));
  };

  const getSection = (field) => {
    const main = Array.isArray(plan?.[field]) ? plan[field] : [];
    const fallback = Array.isArray(plan?.raw?.[field]) ? plan.raw[field] : [];
    return main.length ? main : fallback;
  };

  const skills = useMemo(() => flattenSkills(), [plan]);
  const resources = useMemo(() => transformResources(), [plan]);
  const roadmap = useMemo(() => getSection("roadmap"), [plan]);
  const projects = useMemo(() => getSection("projects"), [plan]);
  const analytics = plan?.analytics || null;
  const executiveSummary = plan?.executiveSummary || null;
  const jobSearchStrategy = plan?.job_search_strategy || null;
  const marketSignals = plan?.market_signals || null;
  const careerOutlook = plan?.career_outlook || plan?.raw?.career_outlook || null;

  const quickLinks = [
    { ...SECTION_STYLES.skills, count: skills.length },
    { ...SECTION_STYLES.roadmap, count: roadmap.length },
    { ...SECTION_STYLES.projects, count: projects.length },
    { ...SECTION_STYLES.resources, count: resources.reduce((sum, item) => sum + item.list.length, 0) },
    { ...SECTION_STYLES.progress, count: analytics?.readinessScore ?? "N/A" },
    { ...SECTION_STYLES.communities, count: "Live" },
  ];

  const handleStartJourney = async () => {
    if (journeyStarted) {
      navigate("/career/plan/skills");
      return;
    }

    try {
      setStartingJourney(true);
      const response = await startLearningJourney();
      toast.success(response.message || "Journey started");
      setJourneyStarted(true);
      navigate("/career/plan/skills");
    } catch (err) {
      console.error("Failed to start journey", err);
      toast.error("Failed to start learning journey");
    } finally {
      setStartingJourney(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[linear-gradient(180deg,#fffaf2_0%,#f3e7d2_100%)] px-6">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-pulse rounded-[20px] bg-[linear-gradient(135deg,#1f2937,#0f172a)]" />
          <p className="mt-5 text-sm font-medium text-[#6b5844]">Loading your learning workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen grid place-items-center bg-[linear-gradient(180deg,#fffaf2_0%,#f3e7d2_100%)] px-6">
        <div className="max-w-md rounded-[32px] border border-[#eadfce] bg-white p-8 text-center shadow-[0_24px_70px_rgba(89,60,27,0.08)]">
          <div className="text-3xl">Plan unavailable</div>
          <p className="mt-3 text-sm leading-7 text-[#6b5844]">
            {error || "Generate your plan first to unlock this workspace."}
          </p>
          <Link
            to="/career-os"
            className="mt-6 inline-flex rounded-full bg-[#1f160f] px-5 py-3 text-sm font-semibold text-white"
          >
            Back to CareerOS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_20%),linear-gradient(180deg,_#fffaf2_0%,_#f3e7d2_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <section className="overflow-hidden rounded-[38px] border border-[#ead8c0] bg-[#1b140f] text-white shadow-[0_30px_90px_rgba(61,36,10,0.24)]">
          <div className="grid gap-8 px-6 py-7 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#fdba74] bg-[#fff1dc] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7c2d12]">
                <FaCompass />
                Career Plan
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Stop reading plans. Start executing one.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#efe4d7] sm:text-base">
                This workspace turns your plan into an operating system: what to learn, what to build,
                what to practice, and where to focus next.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleStartJourney}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#1b140f]"
                >
                  {journeyStarted ? <FaCheckCircle /> : <FaRocket />}
                  {startingJourney ? "Starting..." : journeyStarted ? "Continue learning" : "Start learning"}
                </button>
                <Link
                  to="/career/plan/skills"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
                >
                  Open skills
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard
                label="Readiness"
                value={analytics?.readinessScore ?? "N/A"}
                detail="Current signal of how close you are to being market ready."
                tone="dark"
              />
              <MetricCard
                label="Estimated Weeks"
                value={analytics?.estimatedWeeksToMarketReady ?? "N/A"}
                detail="The current runway implied by your plan."
                tone="warm"
              />
              <MetricCard
                label="Execution Risk"
                value={analytics?.executionRisk ? String(analytics.executionRisk).replace("_", " ") : "N/A"}
                detail="How likely the plan is to stall without tighter focus."
                tone="cool"
              />
              <MetricCard
                label="Journey Status"
                value={journeyStarted ? "Active" : "Not started"}
                detail={journeyStarted ? "You can continue directly into skills." : "Kick off the learning flow to start tracking."}
                tone="green"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((item) => (
            <Link key={item.title} to={item.href} className={`${quickLinkBase} ${item.theme}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1f160f] text-white">
                  {item.icon}
                </div>
                <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b5844]">
                  {item.count}
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[#1f160f]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6b5844]">{item.description}</p>
            </Link>
          ))}
        </section>

        {executiveSummary ? (
          <SectionBlock
            eyebrow="Strategic Readout"
            title={executiveSummary.headline || "Your current strategic position"}
            action={
              <Link
                to="/career/plan/skills"
                className="inline-flex rounded-full border border-[#eadfce] bg-[#fff8ef] px-4 py-2 text-sm font-semibold text-[#1f160f]"
              >
                Go to skill execution
              </Link>
            }
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[24px] border border-[#eadfce] bg-[#fff8ef] p-5">
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#8e775c]">Opportunity</div>
                <p className="mt-3 text-base leading-7 text-[#1f160f]">
                  {executiveSummary.opportunityNarrative}
                </p>
              </div>
              <div className="rounded-[24px] border border-[#eadfce] bg-[#fff8ef] p-5">
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#8e775c]">Strategic Edge</div>
                <p className="mt-3 text-base font-semibold text-[#1f160f]">
                  {executiveSummary.strategicAdvantage}
                </p>
                <div className="mt-4 space-y-2 text-sm text-[#6b5844]">
                  {(executiveSummary.primaryConstraints || []).map((item, index) => (
                    <div key={`${item}-${index}`}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </SectionBlock>
        ) : null}

        {analytics ? (
          <SectionBlock eyebrow="Plan Signals" title="What to protect and what to fix first">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-[24px] border border-[#eadfce] bg-[#fff8ef] p-5">
                <div className="text-sm font-semibold text-[#1f160f]">Strengths</div>
                <div className="mt-4 space-y-2 text-sm text-[#6b5844]">
                  {(analytics.strengths || []).map((item, index) => (
                    <div key={`${item}-${index}`}>{item}</div>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] border border-[#eadfce] bg-[#fff8ef] p-5">
                <div className="text-sm font-semibold text-[#1f160f]">Gaps</div>
                <div className="mt-4 space-y-2 text-sm text-[#6b5844]">
                  {(analytics.gaps || []).map((item, index) => (
                    <div key={`${item}-${index}`}>{item}</div>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] border border-[#eadfce] bg-[#fff8ef] p-5">
                <div className="text-sm font-semibold text-[#1f160f]">Momentum Levers</div>
                <div className="mt-4 space-y-2 text-sm text-[#6b5844]">
                  {(analytics.momentumLevers || []).map((item, index) => (
                    <div key={`${item}-${index}`}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </SectionBlock>
        ) : null}

        {skills.length ? (
          <SectionBlock
            eyebrow="Core Skills"
            title="Capabilities to build now"
            action={
              <Link
                to="/career/plan/skills"
                className="inline-flex rounded-full bg-[#1f160f] px-4 py-2 text-sm font-semibold text-white"
              >
                Open skills workspace
              </Link>
            }
          >
            <SkillsSection skills={skills} />
          </SectionBlock>
        ) : null}

        {roadmap.length ? (
          <SectionBlock eyebrow="Execution Order" title="Recommended roadmap">
            <RoadmapSection roadmap={roadmap} />
          </SectionBlock>
        ) : null}

        {projects.length ? (
          <SectionBlock eyebrow="Proof Building" title="Projects that strengthen your profile">
            <ProjectsSection projects={projects} />
          </SectionBlock>
        ) : null}

        {resources.length ? (
          <SectionBlock eyebrow="Learning Inputs" title="Resources worth using">
            <ResourcesSection resources={resources} />
          </SectionBlock>
        ) : null}

        {jobSearchStrategy ? (
          <SectionBlock eyebrow="Search System" title="How to turn preparation into opportunities">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[24px] border border-[#eadfce] bg-[#fff8ef] p-5">
                <div className="text-sm font-semibold text-[#1f160f]">Execution targets</div>
                <div className="mt-4 space-y-2 text-sm text-[#6b5844]">
                  <div>{jobSearchStrategy.applicationTargetsPerWeek} targeted applications per week</div>
                  <div>{jobSearchStrategy.networkingTouchesPerWeek} networking touches per week</div>
                  <div>{jobSearchStrategy.portfolioPriority}</div>
                </div>
              </div>
              <div className="rounded-[24px] border border-[#eadfce] bg-[#fff8ef] p-5">
                <div className="text-sm font-semibold text-[#1f160f]">Interview focus areas</div>
                <div className="mt-4 space-y-2 text-sm text-[#6b5844]">
                  {(jobSearchStrategy.interviewFocusAreas || []).map((item, index) => (
                    <div key={`${item}-${index}`}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </SectionBlock>
        ) : null}

        {marketSignals || careerOutlook ? (
          <SectionBlock eyebrow="Market Context" title="What the plan is reacting to">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-[24px] border border-[#eadfce] bg-[#fff8ef] p-5">
                <div className="text-sm font-semibold text-[#1f160f]">Hiring heat</div>
                <div className="mt-3 text-2xl font-semibold capitalize text-[#1f160f]">
                  {marketSignals?.hiringHeat || "Unknown"}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(marketSignals?.demandDrivers || []).map((item, index) => (
                    <span key={`${item}-${index}`} className="rounded-full border border-[#dfcfb9] px-3 py-1 text-xs text-[#6b5844]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] border border-[#eadfce] bg-[#fff8ef] p-5">
                <div className="text-sm font-semibold text-[#1f160f]">Emerging skills</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(marketSignals?.emergingSkills || []).map((item, index) => (
                    <span key={`${item}-${index}`} className="rounded-full bg-[#1f160f] px-3 py-1 text-xs text-white">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] border border-[#eadfce] bg-[#fff8ef] p-5">
                <div className="text-sm font-semibold text-[#1f160f]">Career outlook</div>
                <div className="mt-4 space-y-2 text-sm text-[#6b5844]">
                  {(careerOutlook?.roles || []).slice(0, 3).map((item, index) => (
                    <div key={`${item}-${index}`}>{item}</div>
                  ))}
                  {careerOutlook?.salary_range ? <div>{careerOutlook.salary_range}</div> : null}
                </div>
              </div>
            </div>
          </SectionBlock>
        ) : null}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastClassName="rounded-xl border border-[#eadfce] bg-white text-[#1f160f]"
        progressClassName="bg-[#1f160f]"
      />
    </div>
  );
};

export default CareerPlanPage;
