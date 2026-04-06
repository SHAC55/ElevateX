import React, { useEffect, useMemo, useState } from "react";
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
  wishlist: { label: "Wishlist", color: "bg-slate-100 text-slate-700 border-slate-200" },
  applied: { label: "Applied", color: "bg-blue-100 text-blue-700 border-blue-200" },
  oa: { label: "OA", color: "bg-amber-100 text-amber-700 border-amber-200" },
  interview: { label: "Interview", color: "bg-violet-100 text-violet-700 border-violet-200" },
  offer: { label: "Offer", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  rejected: { label: "Rejected", color: "bg-rose-100 text-rose-700 border-rose-200" },
};

const READINESS_ICONS = {
  resume: Briefcase,
  interview: Sparkles,
  skills: GraduationCap,
  portfolio: FolderKanban,
  proof: Award,
};

const scoreTone = (score) => {
  if (score >= 80) return "text-emerald-700 bg-emerald-100";
  if (score >= 60) return "text-amber-700 bg-amber-100";
  return "text-rose-700 bg-rose-100";
};

const Chart = ({ series = [], color = "bg-[#d97706]" }) => {
  const maxValue = Math.max(...series.map((item) => item.value), 1);

  return (
    <div className="flex items-end gap-2 h-32">
      {series.map((item) => (
        <div key={item.date} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full bg-[#f1e7d8] rounded-t-xl relative overflow-hidden" style={{ height: "96px" }}>
            <div
              className={`absolute bottom-0 left-0 right-0 rounded-t-xl ${color}`}
              style={{ height: `${Math.max((item.value / maxValue) * 100, item.value > 0 ? 10 : 0)}%` }}
            />
          </div>
          <span className="text-[10px] text-[#7a6c59]">{item.date.slice(5)}</span>
        </div>
      ))}
    </div>
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(217,119,6,0.15),_transparent_24%),linear-gradient(180deg,#f8f3ea_0%,#efe1cb_100%)] text-[#21170f]">
      <div className="mx-auto max-w-[1600px] p-4 sm:p-6">
        <section className="rounded-[32px] border border-[#eadbc5] bg-[linear-gradient(135deg,rgba(255,253,249,0.96),rgba(247,236,219,0.94))] p-6 shadow-[0_24px_70px_rgba(93,58,22,0.12)]">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e7cfad] bg-[#fff9f0] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#ad5c10]">
                <Sparkles size={14} />
                Dashboard Spec Live
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                {hero.welcomeName}, this is your hiring command center.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6f5d47] sm:text-base">
                Product spec implemented: hero strip, action queue, live application pipeline,
                readiness matrix, insights rail, evidence vault, and movement analytics.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl bg-[#1d160f] px-5 py-4 text-white shadow-lg">
                <div className="text-xs uppercase tracking-[0.24em] text-[#c8b294]">Hireability</div>
                <div className="mt-2 text-4xl font-semibold">{hero.hireabilityScore}</div>
                <div className="mt-2 text-sm text-[#d9cab6]">Weighted from resume, interview, skills, portfolio, proof.</div>
              </div>
              <div className="rounded-3xl border border-[#eadbc5] bg-white px-5 py-4">
                <div className="text-xs uppercase tracking-[0.24em] text-[#7a6c59]">Target Role</div>
                <div className="mt-2 text-xl font-semibold">{hero.targetRole}</div>
                <div className="mt-2 text-sm text-[#6f5d47]">Your dashboard adapts around this role.</div>
              </div>
              <div className="rounded-3xl border border-[#eadbc5] bg-white px-5 py-4">
                <div className="text-xs uppercase tracking-[0.24em] text-[#7a6c59]">Next Best Action</div>
                <div className="mt-2 text-base font-semibold">{hero.nextBestAction.title}</div>
                <div className="mt-2 text-sm text-[#6f5d47]">{hero.nextBestAction.detail}</div>
              </div>
              <div className="rounded-3xl border border-[#eadbc5] bg-white px-5 py-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#7a6c59]">
                  <Flame size={14} />
                  This Week&apos;s Momentum
                </div>
                <div className="mt-2 text-4xl font-semibold">{hero.momentum.score}</div>
                <div className="mt-2 text-sm text-[#6f5d47]">
                  {hero.momentum.activeApplications} active apps · {hero.momentum.interviewsInFlight} interviews in flight
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr,1fr]">
          <section className="rounded-[28px] border border-[#eadbc5] bg-white/95 p-6 shadow-[0_16px_50px_rgba(98,64,29,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[#7a6c59]">Focus Panel</div>
                <h2 className="mt-2 text-2xl font-semibold">Today&apos;s 3 highest-leverage tasks</h2>
              </div>
              <Target className="text-[#c27123]" />
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {focus.tasks.map((task, index) => (
                <div key={`${task.title}-${index}`} className="rounded-3xl border border-[#efe2cf] bg-[#fffaf3] p-5">
                  <div className="inline-flex rounded-full bg-[#22180f] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                    {task.category}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{task.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#6f5d47]">{task.detail}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#c27123]">
                    {task.impact} impact
                    <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#eadbc5] bg-white/95 p-6 shadow-[0_16px_50px_rgba(98,64,29,0.08)]">
            <div className="text-xs uppercase tracking-[0.24em] text-[#7a6c59]">Insights Rail</div>
            <h2 className="mt-2 text-2xl font-semibold">Guidance, risks, trends, blockers</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-3xl bg-[#1d160f] p-5 text-white">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#c8b294]">
                  <Sparkles size={14} />
                  AI Guidance
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-[#e7dbcb]">
                  {insights.guidance.map((item, index) => (
                    <li key={`${item}-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-[#f0d5d5] bg-[#fff6f6] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#a43f3f]">
                  <AlertTriangle size={14} />
                  Risks
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-[#7a4a4a]">
                  {insights.risks.map((item, index) => (
                    <li key={`${item}-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-[#eadbc5] bg-[#fffaf3] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#7a6c59]">
                  <BarChart3 size={14} />
                  Trends & Blockers
                </div>
                <div className="mt-4 space-y-3 text-sm leading-7 text-[#6f5d47]">
                  {insights.trends.map((item, index) => (
                    <div key={`${item}-${index}`}>{item}</div>
                  ))}
                  {insights.blockers.map((item, index) => (
                    <div key={`${item}-${index}`} className="font-medium text-[#a43f3f]">{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr,1fr]">
          <section className="rounded-[28px] border border-[#eadbc5] bg-white/95 p-6 shadow-[0_16px_50px_rgba(98,64,29,0.08)]">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[#7a6c59]">Application Pipeline</div>
                <h2 className="mt-2 text-2xl font-semibold">Live pipeline tied to prep assets</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                <input
                  className="rounded-2xl border border-[#eadbc5] bg-[#fffaf3] px-4 py-3 text-sm outline-none"
                  placeholder="Company"
                  value={applicationForm.company}
                  onChange={(event) =>
                    setApplicationForm((current) => ({ ...current, company: event.target.value }))
                  }
                />
                <input
                  className="rounded-2xl border border-[#eadbc5] bg-[#fffaf3] px-4 py-3 text-sm outline-none"
                  placeholder="Role"
                  value={applicationForm.role}
                  onChange={(event) =>
                    setApplicationForm((current) => ({ ...current, role: event.target.value }))
                  }
                />
                <input
                  className="rounded-2xl border border-[#eadbc5] bg-[#fffaf3] px-4 py-3 text-sm outline-none"
                  placeholder="Source"
                  value={applicationForm.source}
                  onChange={(event) =>
                    setApplicationForm((current) => ({ ...current, source: event.target.value }))
                  }
                />
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1d160f] px-4 py-3 text-sm font-semibold text-white"
                  onClick={handleCreateApplication}
                  disabled={busy === "create-app"}
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-6">
              {pipeline.stages.map((stage) => (
                <div key={stage.key} className="rounded-3xl border border-[#efe2cf] bg-[#fffaf3] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${STAGE_META[stage.key].color}`}>
                      {stage.label}
                    </div>
                    <div className="text-lg font-semibold">{stage.count}</div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {stage.items.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[#eadbc5] p-3 text-xs text-[#8a7a66]">
                        No applications here yet.
                      </div>
                    ) : (
                      stage.items.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-[#eadbc5] bg-white p-3">
                          <div className="font-semibold">{item.company}</div>
                          <div className="mt-1 text-xs text-[#7a6c59]">{item.role}</div>
                          <div className="mt-1 text-[11px] text-[#9a8466]">{item.resumeTitle || "No resume linked"}</div>
                          <select
                            className="mt-3 w-full rounded-xl border border-[#eadbc5] bg-[#fffaf3] px-3 py-2 text-xs"
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
                            className="mt-2 text-xs font-semibold text-[#b14f4f]"
                            onClick={() => handleDeleteApplication(item.id)}
                            disabled={busy === item.id}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#eadbc5] bg-white/95 p-6 shadow-[0_16px_50px_rgba(98,64,29,0.08)]">
            <div className="text-xs uppercase tracking-[0.24em] text-[#7a6c59]">Readiness Matrix</div>
            <h2 className="mt-2 text-2xl font-semibold">Resume, interview, skills, portfolio, proof</h2>
            <div className="mt-5 space-y-4">
              {readiness.items.map((item) => {
                const Icon = READINESS_ICONS[item.key] || CheckCircle2;
                return (
                  <div key={item.key} className="rounded-3xl border border-[#efe2cf] bg-[#fffaf3] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-white p-3 shadow-sm">
                          <Icon size={18} className="text-[#c27123]" />
                        </div>
                        <div>
                          <div className="font-semibold">{item.label}</div>
                          <div className="text-sm text-[#6f5d47]">{item.detail}</div>
                        </div>
                      </div>
                      <div className={`rounded-2xl px-4 py-3 text-lg font-semibold ${scoreTone(item.score)}`}>
                        {item.score}
                      </div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-[#eadbc5]">
                      <div className="h-2 rounded-full bg-[#c27123]" style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr,1fr]">
          <section className="rounded-[28px] border border-[#eadbc5] bg-white/95 p-6 shadow-[0_16px_50px_rgba(98,64,29,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[#7a6c59]">Evidence & Assets</div>
                <h2 className="mt-2 text-2xl font-semibold">Resume versions, projects, certificates</h2>
              </div>
              <Trophy className="text-[#c27123]" />
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <div className="rounded-3xl border border-[#efe2cf] bg-[#fffaf3] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-[#7a6c59]">Resume Versions</div>
                <div className="mt-4 space-y-3">
                  {assets.resumeVersions.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-white p-4 shadow-sm">
                      <div className="font-semibold">{item.title}</div>
                      <div className="mt-1 text-sm text-[#6f5d47]">{item.targetCompany || "General"} · {item.targetRole || "Open role"}</div>
                      <div className="mt-2 inline-flex rounded-full bg-[#1d160f] px-3 py-1 text-xs font-semibold text-white">
                        Score {item.score}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[#efe2cf] bg-[#fffaf3] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-[#7a6c59]">Projects</div>
                <div className="mt-4 space-y-3">
                  {assets.projects.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-white p-4 shadow-sm">
                      <div className="font-semibold">{item.title}</div>
                      <div className="mt-2 text-sm text-[#6f5d47]">{item.link}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[#efe2cf] bg-[#fffaf3] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-[#7a6c59]">Portfolio Assets</div>
                <div className="mt-4 space-y-3">
                  {assets.portfolioAssets.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold">{item.title}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#9a8466]">{item.type}</div>
                        </div>
                        <button
                          className="text-xs font-semibold text-[#b14f4f]"
                          onClick={() => handleDeleteAsset(item.id)}
                          disabled={busy === item.id}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-2 text-sm text-[#6f5d47]">{item.description}</div>
                      {item.metrics?.length ? (
                        <div className="mt-3 text-xs text-[#8a7a66]">{item.metrics[0]}</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[#efe2cf] bg-[#fffaf3] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-[#7a6c59]">Certificates</div>
                <div className="mt-4 space-y-3">
                  {assets.certificates.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-white p-4 shadow-sm">
                      <div className="font-semibold">Certification proof</div>
                      <div className="mt-1 text-sm text-[#6f5d47]">Score {item.score}</div>
                      <div className="mt-2 text-xs text-[#8a7a66]">{new Date(item.issuedAt).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[1fr,1.2fr]">
              <div className="rounded-3xl border border-[#efe2cf] bg-[#fffaf3] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-[#7a6c59]">Add Portfolio Asset</div>
                <div className="mt-4 grid gap-3">
                  <input
                    className="rounded-2xl border border-[#eadbc5] bg-white px-4 py-3 text-sm outline-none"
                    placeholder="Asset title"
                    value={assetForm.title}
                    onChange={(event) =>
                      setAssetForm((current) => ({ ...current, title: event.target.value }))
                    }
                  />
                  <select
                    className="rounded-2xl border border-[#eadbc5] bg-white px-4 py-3 text-sm outline-none"
                    value={assetForm.type}
                    onChange={(event) =>
                      setAssetForm((current) => ({ ...current, type: event.target.value }))
                    }
                  >
                    <option value="case_study">Case study</option>
                    <option value="project">Project</option>
                    <option value="landing_page">Landing page</option>
                    <option value="github_repo">GitHub repo</option>
                    <option value="writeup">Writeup</option>
                  </select>
                  <input
                    className="rounded-2xl border border-[#eadbc5] bg-white px-4 py-3 text-sm outline-none"
                    placeholder="Public link"
                    value={assetForm.link}
                    onChange={(event) =>
                      setAssetForm((current) => ({ ...current, link: event.target.value }))
                    }
                  />
                  <textarea
                    className="min-h-[96px] rounded-2xl border border-[#eadbc5] bg-white px-4 py-3 text-sm outline-none"
                    placeholder="What proof does this asset show?"
                    value={assetForm.description}
                    onChange={(event) =>
                      setAssetForm((current) => ({ ...current, description: event.target.value }))
                    }
                  />
                  <textarea
                    className="min-h-[96px] rounded-2xl border border-[#eadbc5] bg-white px-4 py-3 text-sm outline-none"
                    placeholder="One metric per line"
                    value={assetForm.metrics}
                    onChange={(event) =>
                      setAssetForm((current) => ({ ...current, metrics: event.target.value }))
                    }
                  />
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1d160f] px-4 py-3 text-sm font-semibold text-white"
                    onClick={handleCreateAsset}
                    disabled={busy === "create-asset"}
                  >
                    <Plus size={16} />
                    Add asset
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-[#efe2cf] bg-[#fffaf3] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-[#7a6c59]">Callback Attribution</div>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <div className="font-semibold">Resume Versions</div>
                    <div className="mt-3 space-y-3">
                      {assets.attribution?.resumeVersions?.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-[#efe2cf] p-3">
                          <div className="font-medium">{item.title}</div>
                          <div className="mt-2 text-sm text-[#6f5d47]">
                            {item.callbacks} callbacks from {item.uses} uses
                          </div>
                          <div className="mt-2 inline-flex rounded-full bg-[#1d160f] px-3 py-1 text-xs font-semibold text-white">
                            {item.callbackRate}% callback rate
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <div className="font-semibold">Portfolio Assets</div>
                    <div className="mt-3 space-y-3">
                      {assets.attribution?.portfolioAssets?.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-[#efe2cf] p-3">
                          <div className="font-medium">{item.title}</div>
                          <div className="mt-2 text-sm text-[#6f5d47]">
                            {item.callbacks} callbacks from {item.uses} linked applications
                          </div>
                          <div className="mt-2 inline-flex rounded-full bg-[#0f766e] px-3 py-1 text-xs font-semibold text-white">
                            {item.callbackRate}% callback rate
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#eadbc5] bg-white/95 p-6 shadow-[0_16px_50px_rgba(98,64,29,0.08)]">
            <div className="text-xs uppercase tracking-[0.24em] text-[#7a6c59]">Pipeline Summary</div>
            <h2 className="mt-2 text-2xl font-semibold">Stage totals</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {pipeline.stages.map((stage) => (
                <div key={stage.key} className="rounded-3xl border border-[#efe2cf] bg-[#fffaf3] p-4">
                  <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${STAGE_META[stage.key].color}`}>
                    {stage.label}
                  </div>
                  <div className="mt-3 text-3xl font-semibold">{stage.count}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-3xl bg-[#1d160f] p-5 text-white">
              <div className="text-xs uppercase tracking-[0.24em] text-[#c8b294]">Active Pipeline</div>
              <div className="mt-3 text-4xl font-semibold">{pipeline.totals.active}</div>
              <div className="mt-2 text-sm text-[#dfd1bd]">
                {pipeline.totals.interviews} interviews · {pipeline.totals.offers} offers · {allApplications.length} total tracked
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-[28px] border border-[#eadbc5] bg-white/95 p-6 shadow-[0_16px_50px_rgba(98,64,29,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[#7a6c59]">Progress & Trend Analytics</div>
              <h2 className="mt-2 text-2xl font-semibold">7-day and 30-day movement</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fffaf3] px-4 py-2 text-sm font-medium text-[#7a6c59]">
              <TrendingUp size={16} />
              7-day: {analytics.labels.sevenDay} · 30-day: {analytics.labels.thirtyDay}
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl border border-[#efe2cf] bg-[#fffaf3] p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-[#7a6c59]">7-day movement</div>
              <div className="mt-4">
                <Chart series={analytics.sevenDayMovement} color="bg-[#c27123]" />
              </div>
            </div>
            <div className="rounded-3xl border border-[#efe2cf] bg-[#fffaf3] p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-[#7a6c59]">30-day movement</div>
              <div className="mt-4">
                <Chart series={analytics.thirtyDayMovement} color="bg-[#1d160f]" />
              </div>
            </div>
            <div className="rounded-3xl border border-[#efe2cf] bg-[#fffaf3] p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-[#7a6c59]">Application growth</div>
              <div className="mt-4">
                <Chart series={analytics.applicationTrend.slice(-7)} color="bg-[#0f766e]" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
