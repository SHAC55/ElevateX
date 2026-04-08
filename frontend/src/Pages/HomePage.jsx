import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  Briefcase,
  CheckCircle2,
  Flame,
  FolderKanban,
  GraduationCap,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  createApplication,
  createPortfolioAsset,
  deleteApplication,
  deletePortfolioAsset,
  getDashboardWorkspace,
  updateApplication,
} from "../api/dashboard";

const STAGE_META = {
  wishlist: { label: "Wishlist", tone: "bg-slate-100 text-slate-700 border-slate-200" },
  applied: { label: "Applied", tone: "bg-blue-100 text-blue-700 border-blue-200" },
  oa: { label: "OA", tone: "bg-amber-100 text-amber-700 border-amber-200" },
  interview: { label: "Interview", tone: "bg-violet-100 text-violet-700 border-violet-200" },
  offer: { label: "Offer", tone: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  rejected: { label: "Rejected", tone: "bg-rose-100 text-rose-700 border-rose-200" },
};

const READINESS_ICONS = {
  resume: Briefcase,
  interview: Sparkles,
  skills: GraduationCap,
  portfolio: FolderKanban,
  proof: Award,
};

const ACTION_META = {
  applications: {
    href: "#pipeline",
    cta: "Open pipeline",
    eyebrow: "Pipeline",
  },
  resume: {
    href: "/resume-tools",
    cta: "Improve resume",
    eyebrow: "Resume",
  },
  interview: {
    href: "/mock-interview",
    cta: "Run interview",
    eyebrow: "Interview",
  },
  skills: {
    href: "/career/plan/skills",
    cta: "Study skills",
    eyebrow: "Learning",
  },
  portfolio: {
    href: "/portfolio",
    cta: "Build proof",
    eyebrow: "Portfolio",
  },
  momentum: {
    href: "/career/plan",
    cta: "Open plan",
    eyebrow: "Momentum",
  },
};

const QUICK_LINKS = [
  {
    title: "Skill sprint",
    description: "Jump back into your learning path and close one high-value gap.",
    href: "/career/plan/skills",
    icon: GraduationCap,
    theme: "from-sky-500 via-cyan-500 to-emerald-400",
  },
  {
    title: "Mock interview",
    description: "Get one fresh signal today and tighten your speaking loop.",
    href: "/mock-interview",
    icon: Sparkles,
    theme: "from-orange-500 via-amber-500 to-yellow-400",
  },
  {
    title: "Resume lab",
    description: "Sharpen your strongest resume version against your target role.",
    href: "/resume-tools",
    icon: Briefcase,
    theme: "from-slate-800 via-slate-700 to-slate-600",
  },
  {
    title: "Portfolio proof",
    description: "Turn work into evidence that supports callbacks.",
    href: "/portfolio",
    icon: FolderKanban,
    theme: "from-fuchsia-600 via-rose-500 to-orange-400",
  },
];

const scoreTone = (score) => {
  if (score >= 80) return "bg-emerald-100 text-emerald-700";
  if (score >= 60) return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
};

const formatDate = (value) => {
  if (!value) return "No activity yet";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return "Recent";
  }
};

const movementLabel = (label = "") =>
  String(label)
    .replace("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const Chart = ({ series = [], color = "bg-[#d97706]" }) => {
  const maxValue = Math.max(...series.map((item) => item.value), 1);

  return (
    <div className="flex h-28 items-end gap-2">
      {series.map((item) => (
        <div key={item.date} className="flex flex-1 flex-col items-center gap-2">
          <div className="relative h-20 w-full overflow-hidden rounded-t-2xl bg-[#f4eadb]">
            <div
              className={`absolute bottom-0 left-0 right-0 rounded-t-2xl ${color}`}
              style={{
                height: `${Math.max((item.value / maxValue) * 100, item.value > 0 ? 10 : 0)}%`,
              }}
            />
          </div>
          <span className="text-[10px] text-[#8d7a63]">{item.date.slice(5)}</span>
        </div>
      ))}
    </div>
  );
};

const DashboardActionLink = ({ href, children, className = "" }) => {
  const classes = `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${className}`;

  if (href.startsWith("#")) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={classes}>
      {children}
    </Link>
  );
};

const HomePage = () => {
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [applicationForm, setApplicationForm] = useState({
    company: "",
    role: "",
    status: "wishlist",
    source: "",
  });
  const [assetForm, setAssetForm] = useState({
    title: "",
    type: "case_study",
    link: "",
    description: "",
    metrics: "",
  });

  const loadWorkspace = async () => {
    setLoading(true);
    try {
      const data = await getDashboardWorkspace();
      setWorkspace(data);
    } catch (error) {
      console.error(error);
      toast.error("Could not load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, []);

  const allApplications = useMemo(
    () => workspace?.pipeline?.stages?.flatMap((stage) => stage.items || []) || [],
    [workspace],
  );

  const strongestSurface = useMemo(() => {
    if (!workspace?.readiness?.items?.length) return null;
    return [...workspace.readiness.items].sort((left, right) => right.score - left.score)[0];
  }, [workspace]);

  const weakestSurface = useMemo(() => {
    if (!workspace?.readiness?.items?.length) return null;
    return [...workspace.readiness.items].sort((left, right) => left.score - right.score)[0];
  }, [workspace]);

  const recentApplications = useMemo(
    () =>
      [...allApplications]
        .sort((left, right) => new Date(right.updatedAt || 0) - new Date(left.updatedAt || 0))
        .slice(0, 6),
    [allApplications],
  );

  const handleCreateApplication = async () => {
    if (!applicationForm.company.trim() || !applicationForm.role.trim()) {
      toast.error("Company and role are required");
      return;
    }

    setBusy("create-app");
    try {
      await createApplication(applicationForm);
      setApplicationForm({ company: "", role: "", status: "wishlist", source: "" });
      await loadWorkspace();
      toast.success("Application added");
    } catch (error) {
      console.error(error);
      toast.error("Could not add application");
    } finally {
      setBusy("");
    }
  };

  const handleStatusChange = async (applicationId, status) => {
    setBusy(applicationId);
    try {
      await updateApplication(applicationId, { status });
      await loadWorkspace();
    } catch (error) {
      console.error(error);
      toast.error("Could not update stage");
    } finally {
      setBusy("");
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    setBusy(applicationId);
    try {
      await deleteApplication(applicationId);
      await loadWorkspace();
      toast.success("Application removed");
    } catch (error) {
      console.error(error);
      toast.error("Could not remove application");
    } finally {
      setBusy("");
    }
  };

  const handleCreateAsset = async () => {
    if (!assetForm.title.trim()) {
      toast.error("Portfolio asset title is required");
      return;
    }

    setBusy("create-asset");
    try {
      await createPortfolioAsset({
        title: assetForm.title,
        type: assetForm.type,
        link: assetForm.link,
        description: assetForm.description,
        metrics: assetForm.metrics
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setAssetForm({
        title: "",
        type: "case_study",
        link: "",
        description: "",
        metrics: "",
      });
      await loadWorkspace();
      toast.success("Portfolio asset added");
    } catch (error) {
      console.error(error);
      toast.error("Could not add portfolio asset");
    } finally {
      setBusy("");
    }
  };

  const handleDeleteAsset = async (assetId) => {
    setBusy(assetId);
    try {
      await deletePortfolioAsset(assetId);
      await loadWorkspace();
      toast.success("Portfolio asset removed");
    } catch (error) {
      console.error(error);
      toast.error("Could not remove portfolio asset");
    } finally {
      setBusy("");
    }
  };

  if (loading || !workspace) {
    return <div className="p-6 text-[#3a2c1f]">Loading dashboard...</div>;
  }

  const { hero, focus, pipeline, readiness, insights, assets, analytics } = workspace;
  const nextActionMeta = ACTION_META[hero.nextBestAction.category] || ACTION_META.momentum;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_22%),linear-gradient(180deg,_#fffaf2_0%,_#f3e7d2_100%)] text-[#1e140d]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[36px] border border-[#ead8c0] bg-[#1b140f] text-white shadow-[0_30px_90px_rgba(61,36,10,0.24)]">
          <div className="grid gap-8 px-6 py-7 lg:grid-cols-[1.3fr_0.7fr] lg:px-8 lg:py-8">
            <div className="relative">
              <div className="absolute -left-16 top-0 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />
              <div className="absolute left-36 top-24 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#fdba74] bg-[#fff1dc] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7c2d12] shadow-[0_10px_30px_rgba(251,146,60,0.18)]">
                  <Sparkles size={14} />
                  ElevateX Command Center
                </div>
                <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  {hero.welcomeName}, focus the product around proof, momentum, and your next win.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#efe4d7] sm:text-base">
                  This dashboard now pushes the user toward one immediate move, one proof-building action,
                  and one conversion loop instead of showing every tool with equal weight.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <DashboardActionLink
                    href={nextActionMeta.href}
                    className="bg-white text-[#1b140f] hover:bg-[#f7ead6]"
                  >
                    {nextActionMeta.cta}
                    <ArrowRight size={16} />
                  </DashboardActionLink>
                  <DashboardActionLink
                    href="/career/plan"
                    className="border border-white/15 bg-white/5 text-white hover:bg-white/10"
                  >
                    Open career plan
                  </DashboardActionLink>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">Target Role</div>
                    <div className="mt-3 text-2xl font-semibold">{hero.targetRole}</div>
                    <div className="mt-2 text-sm text-[#f0e4d8]">Everything below is prioritized for this direction.</div>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">Next Best Action</div>
                    <div className="mt-3 text-lg font-semibold">{hero.nextBestAction.title}</div>
                    <div className="mt-2 text-sm text-[#f0e4d8]">{hero.nextBestAction.detail}</div>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-orange-500/20 to-transparent p-4">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#ffd8b0]">
                      <Flame size={14} />
                      Momentum
                    </div>
                    <div className="mt-3 text-3xl font-semibold">{hero.momentum.score}</div>
                    <div className="mt-2 text-sm text-[#f2dcc8]">
                      {hero.momentum.activeApplications} active apps and {hero.momentum.interviewsInFlight} interviews in flight.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] p-5">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">North Star</div>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-6xl font-semibold">{hero.hireabilityScore}</div>
                    <div className="mt-2 text-sm text-[#f0e4d8]">Current hireability score</div>
                  </div>
                  <div className="rounded-full border border-[#fdba74]/50 bg-[#fff1dc] px-4 py-2 text-sm font-semibold text-[#7c2d12]">
                    Built for clarity
                  </div>
                </div>
                <div className="mt-5 h-3 rounded-full bg-white/10">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-orange-400 via-amber-300 to-sky-300"
                    style={{ width: `${hero.hireabilityScore}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">Strongest Surface</div>
                  <div className="mt-3 text-xl font-semibold">{strongestSurface?.label || "Not enough data"}</div>
                  <div className="mt-2 text-sm text-[#f0e4d8]">
                    {strongestSurface ? `${strongestSurface.score}/100` : "Start creating signals"}
                  </div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">Weakest Surface</div>
                  <div className="mt-3 text-xl font-semibold">{weakestSurface?.label || "Not enough data"}</div>
                  <div className="mt-2 text-sm text-[#f0e4d8]">
                    {weakestSurface ? `${weakestSurface.score}/100` : "No scores yet"}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[#f5dec5]">Pipeline Snapshot</div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-2xl font-semibold">{pipeline.totals.all}</div>
                    <div className="text-xs text-[#f0e4d8]">total targets</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold">{pipeline.totals.interviews}</div>
                    <div className="text-xs text-[#f0e4d8]">interviews</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold">{pipeline.totals.offers}</div>
                    <div className="text-xs text-[#f0e4d8]">offers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] border border-[#eadbc5] bg-white/90 p-5 shadow-[0_20px_60px_rgba(89,60,27,0.08)]">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">Hireability</div>
            <div className="mt-3 text-4xl font-semibold">{hero.hireabilityScore}</div>
            <div className="mt-2 text-sm text-[#6e5b46]">Weighted across resume, interview, skills, proof, and portfolio.</div>
          </div>
          <div className="rounded-[28px] border border-[#eadbc5] bg-white/90 p-5 shadow-[0_20px_60px_rgba(89,60,27,0.08)]">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">Active Pipeline</div>
            <div className="mt-3 text-4xl font-semibold">{pipeline.totals.active}</div>
            <div className="mt-2 text-sm text-[#6e5b46]">Live opportunities the system can optimize against right now.</div>
          </div>
          <div className="rounded-[28px] border border-[#eadbc5] bg-white/90 p-5 shadow-[0_20px_60px_rgba(89,60,27,0.08)]">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">Best Resume</div>
            <div className="mt-3 text-4xl font-semibold">
              {readiness.items.find((item) => item.key === "resume")?.score || 0}
            </div>
            <div className="mt-2 text-sm text-[#6e5b46]">Your strongest recruiter-facing document score today.</div>
          </div>
          <div className="rounded-[28px] border border-[#eadbc5] bg-white/90 p-5 shadow-[0_20px_60px_rgba(89,60,27,0.08)]">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">Movement</div>
            <div className="mt-3 inline-flex items-center gap-2 text-2xl font-semibold">
              <TrendingUp size={22} className="text-[#c56c19]" />
              {movementLabel(analytics.labels.sevenDay)}
            </div>
            <div className="mt-2 text-sm text-[#6e5b46]">Seven-day activity trend across learning, interviews, resumes, and applications.</div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[30px] border border-[#eadbc5] bg-white/92 p-6 shadow-[0_24px_70px_rgba(89,60,27,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">Action Queue</div>
                <h2 className="mt-2 text-2xl font-semibold">Three things that move the user forward</h2>
              </div>
              <Target className="text-[#c56c19]" />
            </div>

            <div className="mt-5 space-y-4">
              {focus.tasks.map((task, index) => {
                const action = ACTION_META[task.category] || ACTION_META.momentum;

                return (
                  <div
                    key={`${task.title}-${index}`}
                    className="rounded-[26px] border border-[#efe3d2] bg-[linear-gradient(135deg,#fff8ef_0%,#fffdf9_100%)] p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-2xl">
                        <div className="inline-flex rounded-full bg-[#20160f] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
                          {action.eyebrow}
                        </div>
                        <h3 className="mt-4 text-xl font-semibold">{task.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-[#6e5b46]">{task.detail}</p>
                      </div>
                      <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                        <div className="rounded-full bg-[#f3e1c9] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#a45a16]">
                          {task.impact} impact
                        </div>
                        <DashboardActionLink
                          href={action.href}
                          className="bg-[#20160f] text-white hover:bg-[#362518]"
                        >
                          {action.cta}
                          <ArrowRight size={15} />
                        </DashboardActionLink>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[30px] border border-[#eadbc5] bg-white/92 p-6 shadow-[0_24px_70px_rgba(89,60,27,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">Quick Launch</div>
                <h2 className="mt-2 text-2xl font-semibold">Push users into core loops</h2>
              </div>
              <Sparkles className="text-[#c56c19]" />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {QUICK_LINKS.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    to={item.href}
                    className={`group rounded-[26px] bg-gradient-to-br ${item.theme} p-[1px] transition hover:-translate-y-0.5`}
                  >
                    <div className="h-full rounded-[25px] bg-[#fffaf4] p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#20160f] text-white">
                          <Icon size={20} />
                        </div>
                        <ArrowRight size={18} className="text-[#8f744e] transition group-hover:translate-x-1" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#6e5b46]">{item.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <section className="rounded-[30px] border border-[#eadbc5] bg-white/92 p-6 shadow-[0_24px_70px_rgba(89,60,27,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">Readiness Stack</div>
                <h2 className="mt-2 text-2xl font-semibold">What is strong and what is leaking</h2>
              </div>
              <CheckCircle2 className="text-[#c56c19]" />
            </div>

            <div className="mt-5 space-y-4">
              {readiness.items.map((item) => {
                const Icon = READINESS_ICONS[item.key] || CheckCircle2;

                return (
                  <div key={item.key} className="rounded-[24px] border border-[#efe3d2] bg-[#fff8ef] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm">
                          <Icon size={18} className="text-[#c56c19]" />
                        </div>
                        <div>
                          <div className="font-semibold">{item.label}</div>
                          <div className="mt-1 text-sm text-[#6e5b46]">{item.detail}</div>
                        </div>
                      </div>
                      <div className={`rounded-2xl px-3 py-2 text-sm font-semibold ${scoreTone(item.score)}`}>
                        {item.score}/100
                      </div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-[#eadbc5]">
                      <div className="h-2 rounded-full bg-[#c56c19]" style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[30px] border border-[#eadbc5] bg-white/92 p-6 shadow-[0_24px_70px_rgba(89,60,27,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">Signals</div>
                <h2 className="mt-2 text-2xl font-semibold">Guidance, risk, and movement</h2>
              </div>
              <BarChart3 className="text-[#c56c19]" />
            </div>

            <div className="mt-5 grid gap-4">
              <div className="rounded-[24px] bg-[#1c1510] p-5 text-white">
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#ddc6a8]">AI Guidance</div>
                <div className="mt-4 space-y-3 text-sm leading-7 text-[#eadccf]">
                  {insights.guidance.map((item, index) => (
                    <div key={`${item}-${index}`}>{item}</div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-[#f2d7d4] bg-[#fff6f5] p-5">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#b14943]">
                    <AlertTriangle size={14} />
                    Risks
                  </div>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-[#764643]">
                    {insights.risks.map((item, index) => (
                      <div key={`${item}-${index}`}>{item}</div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#eadbc5] bg-[#fff8ef] p-5">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">Blockers</div>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-[#6e5b46]">
                    {insights.blockers.length ? (
                      insights.blockers.map((item, index) => (
                        <div key={`${item}-${index}`}>{item}</div>
                      ))
                    ) : (
                      <div>No major blockers detected. Keep compounding the core loops.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#eadbc5] bg-[#fff8ef] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">7-Day Movement</div>
                    <div className="mt-2 text-sm text-[#6e5b46]">
                      {movementLabel(analytics.labels.sevenDay)} in the last seven days
                    </div>
                  </div>
                  <div className="rounded-full bg-[#f3e1c9] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#a45a16]">
                    Weekly pulse
                  </div>
                </div>
                <div className="mt-5">
                  <Chart series={analytics.sevenDayMovement} />
                </div>
                <div className="mt-4 space-y-2 text-sm text-[#6e5b46]">
                  {insights.trends.map((item, index) => (
                    <div key={`${item}-${index}`}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section
            id="pipeline"
            className="rounded-[30px] border border-[#eadbc5] bg-white/92 p-6 shadow-[0_24px_70px_rgba(89,60,27,0.08)]"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">Pipeline</div>
                <h2 className="mt-2 text-2xl font-semibold">Live opportunities, simplified</h2>
                <p className="mt-2 text-sm text-[#6e5b46]">
                  Keep the dashboard focused on the most recent targets instead of a full kanban wall.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                <input
                  className="rounded-2xl border border-[#eadbc5] bg-[#fffaf4] px-4 py-3 text-sm outline-none"
                  placeholder="Company"
                  value={applicationForm.company}
                  onChange={(event) =>
                    setApplicationForm((current) => ({ ...current, company: event.target.value }))
                  }
                />
                <input
                  className="rounded-2xl border border-[#eadbc5] bg-[#fffaf4] px-4 py-3 text-sm outline-none"
                  placeholder="Role"
                  value={applicationForm.role}
                  onChange={(event) =>
                    setApplicationForm((current) => ({ ...current, role: event.target.value }))
                  }
                />
                <input
                  className="rounded-2xl border border-[#eadbc5] bg-[#fffaf4] px-4 py-3 text-sm outline-none"
                  placeholder="Source"
                  value={applicationForm.source}
                  onChange={(event) =>
                    setApplicationForm((current) => ({ ...current, source: event.target.value }))
                  }
                />
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#20160f] px-4 py-3 text-sm font-semibold text-white"
                  onClick={handleCreateApplication}
                  disabled={busy === "create-app"}
                >
                  <Plus size={16} />
                  Add target
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
              {pipeline.stages.map((stage) => (
                <div key={stage.key} className="rounded-[22px] border border-[#efe3d2] bg-[#fff8ef] p-4">
                  <div className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${STAGE_META[stage.key].tone}`}>
                    {stage.label}
                  </div>
                  <div className="mt-3 text-3xl font-semibold">{stage.count}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              {recentApplications.length ? (
                recentApplications.map((item) => (
                  <div key={item.id} className="rounded-[24px] border border-[#efe3d2] bg-[#fffdf9] p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="text-lg font-semibold">{item.company}</div>
                          <div className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${STAGE_META[item.status]?.tone || STAGE_META.wishlist.tone}`}>
                            {STAGE_META[item.status]?.label || item.status}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-[#6e5b46]">{item.role}</div>
                        <div className="mt-2 text-xs text-[#8f7a61]">
                          {item.resumeTitle || "No resume linked"} • Updated {formatDate(item.updatedAt)}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <select
                          className="rounded-xl border border-[#eadbc5] bg-[#fff8ef] px-3 py-2 text-sm"
                          value={item.status}
                          onChange={(event) => handleStatusChange(item.id, event.target.value)}
                          disabled={busy === item.id}
                        >
                          {Object.entries(STAGE_META).map(([key, meta]) => (
                            <option key={key} value={key}>
                              {meta.label}
                            </option>
                          ))}
                        </select>
                        <button
                          className="text-sm font-semibold text-[#b14943]"
                          onClick={() => handleDeleteApplication(item.id)}
                          disabled={busy === item.id}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-[#e7d5bc] bg-[#fffaf4] p-6 text-sm text-[#6e5b46]">
                  No live targets yet. Add a company so the dashboard can prioritize your learning and prep against a real goal.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[30px] border border-[#eadbc5] bg-white/92 p-6 shadow-[0_24px_70px_rgba(89,60,27,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#866f55]">Proof Vault</div>
                <h2 className="mt-2 text-2xl font-semibold">Evidence that earns trust</h2>
              </div>
              <Trophy className="text-[#c56c19]" />
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-[24px] border border-[#efe3d2] bg-[#fff8ef] p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-[#866f55]">Resume Versions</div>
                <div className="mt-4 space-y-3">
                  {assets.resumeVersions.length ? (
                    assets.resumeVersions.map((item) => (
                      <div key={item.id} className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="font-semibold">{item.title}</div>
                        <div className="mt-1 text-sm text-[#6e5b46]">
                          {item.targetRole || "Open role"} {item.targetCompany ? `• ${item.targetCompany}` : ""}
                        </div>
                        <div className="mt-3 inline-flex rounded-full bg-[#20160f] px-3 py-1 text-xs font-semibold text-white">
                          Score {item.score}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-white p-4 text-sm text-[#6e5b46]">No resume versions yet.</div>
                  )}
                </div>
              </div>

              <div className="rounded-[24px] border border-[#efe3d2] bg-[#fff8ef] p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-[#866f55]">Add Portfolio Proof</div>
                <div className="mt-4 space-y-3">
                  <select
                    className="w-full rounded-2xl border border-[#eadbc5] bg-white px-4 py-3 text-sm outline-none"
                    value={assetForm.type}
                    onChange={(event) =>
                      setAssetForm((current) => ({ ...current, type: event.target.value }))
                    }
                  >
                    <option value="case_study">Case study</option>
                    <option value="project">Project</option>
                    <option value="artifact">Artifact</option>
                    <option value="presentation">Presentation</option>
                  </select>
                  <input
                    className="w-full rounded-2xl border border-[#eadbc5] bg-white px-4 py-3 text-sm outline-none"
                    placeholder="Case study or asset title"
                    value={assetForm.title}
                    onChange={(event) =>
                      setAssetForm((current) => ({ ...current, title: event.target.value }))
                    }
                  />
                  <input
                    className="w-full rounded-2xl border border-[#eadbc5] bg-white px-4 py-3 text-sm outline-none"
                    placeholder="Link"
                    value={assetForm.link}
                    onChange={(event) =>
                      setAssetForm((current) => ({ ...current, link: event.target.value }))
                    }
                  />
                  <textarea
                    className="min-h-[90px] w-full rounded-2xl border border-[#eadbc5] bg-white px-4 py-3 text-sm outline-none"
                    placeholder="What did you build, improve, or prove?"
                    value={assetForm.description}
                    onChange={(event) =>
                      setAssetForm((current) => ({ ...current, description: event.target.value }))
                    }
                  />
                  <textarea
                    className="min-h-[100px] w-full rounded-2xl border border-[#eadbc5] bg-white px-4 py-3 text-sm outline-none"
                    placeholder="Metrics, one per line"
                    value={assetForm.metrics}
                    onChange={(event) =>
                      setAssetForm((current) => ({ ...current, metrics: event.target.value }))
                    }
                  />
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#20160f] px-4 py-3 text-sm font-semibold text-white"
                    onClick={handleCreateAsset}
                    disabled={busy === "create-asset"}
                  >
                    <Plus size={16} />
                    Add proof
                  </button>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#efe3d2] bg-[#fff8ef] p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-[#866f55]">Portfolio Assets</div>
                <div className="mt-4 space-y-3">
                  {assets.portfolioAssets.length ? (
                    assets.portfolioAssets.map((item) => (
                      <div key={item.id} className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold">{item.title}</div>
                            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[#8f7a61]">{item.type}</div>
                          </div>
                          <button
                            className="text-sm font-semibold text-[#b14943]"
                            onClick={() => handleDeleteAsset(item.id)}
                            disabled={busy === item.id}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="mt-2 text-sm text-[#6e5b46]">{item.description || "No description yet."}</div>
                        {item.metrics?.length ? (
                          <div className="mt-3 text-xs text-[#8f7a61]">{item.metrics[0]}</div>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-white p-4 text-sm text-[#6e5b46]">
                      No portfolio proof yet. Add one asset to make applications more credible.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
