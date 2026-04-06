import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Download,
  FolderKanban,
  GraduationCap,
  LayoutTemplate,
  Plus,
  Save,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  WandSparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  analyzeResumeVersion,
  createResumeVersion,
  downloadResumePdf,
  generateResumeVersion,
  getResumeVersion,
  getResumeWorkspace,
  updateResumeProfile,
  updateResumeVersion,
} from "../api/resume";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Fraunces:opsz,wght@9..144,400;9..144,600&display=swap');
  .resume-shell,.resume-shell *,.resume-shell *::before,.resume-shell *::after{box-sizing:border-box}
  .resume-shell{--bg:#f4efe6;--paper:#fffdf8;--panel:#f8f2e8;--ink:#141210;--muted:#6e655c;--line:rgba(20,18,16,.10);--accent:#c2612d;--accent-soft:rgba(194,97,45,.12);--success:#146c43;--success-soft:rgba(20,108,67,.10);--warning:#b7791f;--danger:#9f2d2d;min-height:100vh;color:var(--ink);font-family:"Space Grotesk",system-ui,sans-serif;background:
  radial-gradient(circle at top left, rgba(194,97,45,.10), transparent 28%),
  radial-gradient(circle at top right, rgba(20,108,67,.10), transparent 24%),
  linear-gradient(180deg, #f7f3ea 0%, #efe5d6 100%);padding:24px}
  .resume-shell button,.resume-shell input,.resume-shell textarea{font:inherit}
  .resume-shell input,.resume-shell textarea,.resume-shell select{width:100%;border:1px solid var(--line);background:#fff;border-radius:14px;padding:12px 14px;color:var(--ink);outline:none}
  .resume-shell textarea{resize:vertical;min-height:110px}
  .resume-shell input:focus,.resume-shell textarea:focus,.resume-shell select:focus{border-color:rgba(194,97,45,.45);box-shadow:0 0 0 4px rgba(194,97,45,.10)}
  .resume-shell .card{background:rgba(255,253,248,.88);border:1px solid rgba(20,18,16,.08);backdrop-filter:blur(14px);border-radius:24px;box-shadow:0 18px 50px rgba(76,49,28,.08)}
  .resume-shell .label{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
  .resume-shell .pill{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:12px;font-weight:600}
  .resume-shell .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:14px;padding:11px 16px;border:1px solid var(--line);background:#fff;color:var(--ink);cursor:pointer}
  .resume-shell .btn.primary{background:var(--ink);color:#fff;border-color:var(--ink)}
  .resume-shell .btn.accent{background:var(--accent);color:#fff;border-color:var(--accent)}
  .resume-shell .btn:disabled{opacity:.55;cursor:not-allowed}
  .resume-shell .grid{display:grid;grid-template-columns:280px minmax(0,1fr) 340px;gap:18px;align-items:start}
  .resume-shell .stack{display:flex;flex-direction:column;gap:16px}
  .resume-shell .version-btn{width:100%;text-align:left;padding:16px;border-radius:18px;border:1px solid var(--line);background:#fff;cursor:pointer}
  .resume-shell .version-btn.active{background:linear-gradient(135deg,#141210 0%,#362316 100%);color:#fff;border-color:#141210}
  .resume-shell .version-btn.active .muted{color:rgba(255,255,255,.70)}
  .resume-shell .muted{color:var(--muted)}
  .resume-shell .hero{display:flex;justify-content:space-between;gap:20px;padding:28px}
  .resume-shell .hero h1{font-family:"Fraunces",serif;font-weight:600;font-size:40px;line-height:1}
  .resume-shell .hero p{max-width:760px;font-size:15px;line-height:1.7;color:var(--muted);margin-top:12px}
  .resume-shell .section-tabs{display:flex;flex-wrap:wrap;gap:8px}
  .resume-shell .tab{padding:9px 12px;border-radius:12px;border:1px solid var(--line);background:#fff;cursor:pointer}
  .resume-shell .tab.active{background:var(--accent-soft);border-color:rgba(194,97,45,.32);color:var(--accent);font-weight:700}
  .resume-shell .two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .resume-shell .three-col{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
  .resume-shell .entry{padding:16px;border-radius:18px;border:1px solid var(--line);background:var(--paper)}
  .resume-shell .score{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
  .resume-shell .score-card{padding:14px;border-radius:18px;background:var(--panel);border:1px solid var(--line)}
  .resume-shell .template-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
  .resume-shell .template-card{padding:16px;border-radius:18px;border:1px solid var(--line);background:#fff;cursor:pointer;text-align:left}
  .resume-shell .template-card.active{border-color:var(--accent);background:linear-gradient(180deg,rgba(194,97,45,.10),rgba(255,255,255,.98))}
  .resume-shell .diag{padding:12px 14px;border-radius:16px;border:1px solid var(--line);background:#fff}
  .resume-shell .preview-section{padding-top:14px;border-top:1px solid var(--line)}
  .resume-shell .preview-section:first-of-type{padding-top:0;border-top:none}
  .resume-shell .list{display:flex;flex-direction:column;gap:10px}
  .resume-shell .mini{font-size:12px}
  @media (max-width:1280px){.resume-shell .grid{grid-template-columns:260px minmax(0,1fr)}.resume-shell .rail{grid-column:1/-1}}
  @media (max-width:900px){.resume-shell{padding:14px}.resume-shell .grid,.resume-shell .two-col,.resume-shell .three-col{grid-template-columns:1fr}.resume-shell .hero{flex-direction:column}.resume-shell .hero h1{font-size:32px}}
`;

const SECTION_OPTIONS = [
  { id: "summary", label: "Summary", icon: Sparkles },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "skills", label: "Skills", icon: Target },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "certifications", label: "Certifications", icon: Trophy },
];

const emptyExperience = () => ({
  company: "",
  title: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  summary: "",
  achievements: [""],
  skills: [],
});

const emptyProject = () => ({
  name: "",
  summary: "",
  highlights: [""],
  technologies: [],
  link: "",
});

const emptyEducation = () => ({
  school: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  grade: "",
});

const parseLines = (value) =>
  String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const joinLines = (items) => (Array.isArray(items) ? items.filter(Boolean).join("\n") : "");

const parseTags = (value) =>
  String(value || "")
    .split(/[\n,|]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const syncVersionSummary = (version) => ({
  id: version._id || version.id,
  title: version.title,
  targetRole: version.targetRole,
  targetCompany: version.targetCompany,
  templateId: version.templateId,
  status: version.status,
  updatedAt: version.updatedAt,
  scorecard: version.scorecard || {},
});

const scoreTone = (score) => {
  if (score >= 80) return { color: "#146c43", bg: "rgba(20,108,67,.10)" };
  if (score >= 60) return { color: "#b7791f", bg: "rgba(183,121,31,.12)" };
  return { color: "#9f2d2d", bg: "rgba(159,45,45,.10)" };
};

const FALLBACK_TEMPLATES = [
  { id: "classic", name: "Classic", description: "Single-column ATS-safe layout.", previewTone: "Conservative", accent: "#1f4b99" },
  { id: "modern", name: "Modern", description: "Two-column layout with a skills rail.", previewTone: "Product", accent: "#0f766e" },
  { id: "compact", name: "Compact", description: "Dense one-page format.", previewTone: "ATS", accent: "#7c2d12" },
  { id: "executive", name: "Executive", description: "Leadership-forward narrative layout.", previewTone: "Leadership", accent: "#6b21a8" },
];

function Resume() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [profile, setProfile] = useState(null);
  const [templates, setTemplates] = useState(FALLBACK_TEMPLATES);
  const [versions, setVersions] = useState([]);
  const [activeVersion, setActiveVersion] = useState(null);
  const [activeSection, setActiveSection] = useState("summary");
  const [newVersion, setNewVersion] = useState({
    title: "",
    targetRole: "",
    targetCompany: "",
  });

  const loadWorkspace = async () => {
    setLoading(true);
    try {
      const data = await getResumeWorkspace();
      setProfile(data.profile);
      setTemplates(data.templates || FALLBACK_TEMPLATES);
      setVersions(data.versions || []);
      setActiveVersion(data.activeVersion || null);
    } catch (error) {
      console.error(error);
      toast.error("Could not load resume workspace");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, []);

  const versionScore = activeVersion?.scorecard?.overall || 0;
  const deferredKeywords = useMemo(
    () => activeVersion?.analysis?.keywords || [],
    [activeVersion?.analysis?.keywords],
  );

  const selectVersion = async (id) => {
    if (!id || activeVersion?._id === id) return;
    setBusy("load-version");
    try {
      const version = await getResumeVersion(id);
      setActiveVersion(version);
    } catch (error) {
      console.error(error);
      toast.error("Could not open that version");
    } finally {
      setBusy("");
    }
  };

  const updateBasics = (key, value) => {
    setProfile((current) => ({
      ...current,
      basics: { ...current.basics, [key]: value },
    }));
  };

  const updateTargeting = (key, value) => {
    setProfile((current) => ({
      ...current,
      targeting: { ...current.targeting, [key]: value },
    }));
  };

  const patchVersion = (updater) => {
    setActiveVersion((current) => (typeof updater === "function" ? updater(current) : current));
  };

  const updateVersionField = (key, value) => {
    patchVersion((current) => ({ ...current, [key]: value }));
  };

  const updateSection = (key, value) => {
    patchVersion((current) => ({
      ...current,
      sections: { ...current.sections, [key]: value },
    }));
  };

  const updateExperience = (index, key, value) => {
    patchVersion((current) => {
      const next = [...(current.sections.experience || [])];
      next[index] = { ...next[index], [key]: value };
      return { ...current, sections: { ...current.sections, experience: next } };
    });
  };

  const updateProject = (index, key, value) => {
    patchVersion((current) => {
      const next = [...(current.sections.projects || [])];
      next[index] = { ...next[index], [key]: value };
      return { ...current, sections: { ...current.sections, projects: next } };
    });
  };

  const updateEducation = (index, key, value) => {
    patchVersion((current) => {
      const next = [...(current.sections.education || [])];
      next[index] = { ...next[index], [key]: value };
      return { ...current, sections: { ...current.sections, education: next } };
    });
  };

  const saveEverything = async () => {
    if (!activeVersion || !profile) return;
    setBusy("save");
    try {
      const nextProfile = {
        basics: profile.basics,
        targeting: {
          ...profile.targeting,
          targetRoles: parseTags(profile.targeting?.targetRoles?.join("\n") || ""),
          interestAreas: parseTags(profile.targeting?.interestAreas?.join("\n") || ""),
        },
        experience: activeVersion.sections.experience || [],
        projects: activeVersion.sections.projects || [],
        education: activeVersion.sections.education || [],
        certifications: (activeVersion.sections.certifications || []).map((name) => ({
          name,
          issuer: "",
          issuedAt: "",
        })),
        skillInventory: (activeVersion.sections.skills || []).map((name) => ({
          name,
          level: "",
          category: "resume",
          evidence: "",
        })),
      };

      await updateResumeProfile(nextProfile);
      const savedVersion = await updateResumeVersion(activeVersion._id, {
        title: activeVersion.title,
        targetRole: activeVersion.targetRole,
        targetCompany: activeVersion.targetCompany,
        templateId: activeVersion.templateId,
        theme: activeVersion.theme,
        layout: activeVersion.layout,
        jobDescription: activeVersion.jobDescription,
        status: activeVersion.status,
        sections: activeVersion.sections,
      });

      setActiveVersion(savedVersion);
      setVersions((current) => {
        const summary = syncVersionSummary(savedVersion);
        const withoutActive = current.filter((item) => item.id !== summary.id);
        return [summary, ...withoutActive];
      });
      toast.success("Resume workspace saved");
    } catch (error) {
      console.error(error);
      toast.error("Save failed");
    } finally {
      setBusy("");
    }
  };

  const createVersion = async () => {
    setBusy("create");
    try {
      const version = await createResumeVersion(newVersion);
      setActiveVersion(version);
      setVersions((current) => [syncVersionSummary(version), ...current]);
      setNewVersion({ title: "", targetRole: "", targetCompany: "" });
      toast.success("New tailored version created");
    } catch (error) {
      console.error(error);
      toast.error("Could not create a new version");
    } finally {
      setBusy("");
    }
  };

  const analyze = async () => {
    if (!activeVersion?._id) return;
    setBusy("analyze");
    try {
      await updateResumeVersion(activeVersion._id, {
        title: activeVersion.title,
        targetRole: activeVersion.targetRole,
        targetCompany: activeVersion.targetCompany,
        templateId: activeVersion.templateId,
        theme: activeVersion.theme,
        layout: activeVersion.layout,
        jobDescription: activeVersion.jobDescription,
        status: activeVersion.status,
        sections: activeVersion.sections,
      });
      const version = await analyzeResumeVersion(activeVersion._id);
      setActiveVersion(version);
      setVersions((current) =>
        current.map((item) => (item.id === version._id ? syncVersionSummary(version) : item)),
      );
      toast.success("JD analysis complete");
    } catch (error) {
      console.error(error);
      toast.error("Analysis failed");
    } finally {
      setBusy("");
    }
  };

  const generate = async () => {
    if (!activeVersion?._id) return;
    setBusy("generate");
    try {
      await updateResumeVersion(activeVersion._id, {
        title: activeVersion.title,
        targetRole: activeVersion.targetRole,
        targetCompany: activeVersion.targetCompany,
        templateId: activeVersion.templateId,
        theme: activeVersion.theme,
        layout: activeVersion.layout,
        jobDescription: activeVersion.jobDescription,
        status: activeVersion.status,
        sections: activeVersion.sections,
      });
      const version = await generateResumeVersion(activeVersion._id);
      setActiveVersion(version);
      setVersions((current) =>
        current.map((item) => (item.id === version._id ? syncVersionSummary(version) : item)),
      );
      toast.success("Tailored draft generated");
    } catch (error) {
      console.error(error);
      toast.error("Generation failed");
    } finally {
      setBusy("");
    }
  };

  const exportPdf = async () => {
    if (!activeVersion?._id) return;
    setBusy("export");
    try {
      const blob = await downloadResumePdf(activeVersion._id);
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${(activeVersion.title || "resume").replace(/\s+/g, "-").toLowerCase()}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("PDF export failed");
    } finally {
      setBusy("");
    }
  };

  if (loading) {
    return (
      <div className="resume-shell">
        <style>{styles}</style>
        <div className="card" style={{ padding: 32 }}>
          Loading resume builder...
        </div>
      </div>
    );
  }

  if (!profile || !activeVersion) {
    return (
      <div className="resume-shell">
        <style>{styles}</style>
        <div className="card" style={{ padding: 32 }}>
          Resume workspace is not available right now.
        </div>
      </div>
    );
  }

  const tone = scoreTone(versionScore);
  const activeTemplate =
    templates.find((template) => template.id === activeVersion.templateId) ||
    FALLBACK_TEMPLATES[0];

  return (
    <div className="resume-shell">
      <style>{styles}</style>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="card hero"
      >
        <div>
          <div className="pill">
            <WandSparkles size={14} />
            YC-grade resume engine
          </div>
          <h1>ElevateX Resume OS</h1>
          <p>
            This builder uses the user&apos;s career choice, profile links, and job description
            to create tailored resume versions with fit scoring, keyword coverage, and a clean export path.
          </p>
        </div>

        <div className="stack" style={{ minWidth: 320 }}>
          <div className="two-col">
            <input
              placeholder="Target role"
              value={newVersion.targetRole}
              onChange={(event) =>
                setNewVersion((current) => ({ ...current, targetRole: event.target.value }))
              }
            />
            <input
              placeholder="Target company"
              value={newVersion.targetCompany}
              onChange={(event) =>
                setNewVersion((current) => ({ ...current, targetCompany: event.target.value }))
              }
            />
          </div>
          <input
            placeholder="Version title"
            value={newVersion.title}
            onChange={(event) =>
              setNewVersion((current) => ({ ...current, title: event.target.value }))
            }
          />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn accent" onClick={createVersion} disabled={busy === "create"}>
              <Plus size={16} />
              New version
            </button>
            <button className="btn" onClick={saveEverything} disabled={Boolean(busy)}>
              <Save size={16} />
              Save all
            </button>
            <button className="btn" onClick={analyze} disabled={Boolean(busy)}>
              <Sparkles size={16} />
              Analyze
            </button>
            <button className="btn primary" onClick={generate} disabled={Boolean(busy)}>
              <WandSparkles size={16} />
              Tailor
            </button>
            <button className="btn" onClick={exportPdf} disabled={Boolean(busy)}>
              <Download size={16} />
              PDF
            </button>
          </div>
        </div>
      </motion.section>

      <div className="grid" style={{ marginTop: 18 }}>
        <aside className="stack">
          <section className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span className="label" style={{ marginBottom: 0 }}>Versions</span>
              <span className="pill">{versions.length}</span>
            </div>
            <div className="stack" style={{ gap: 10 }}>
              {versions.map((version) => {
                const active = version.id === activeVersion._id;
                const itemTone = scoreTone(version.scorecard?.overall || 0);
                return (
                  <button
                    key={version.id}
                    className={`version-btn ${active ? "active" : ""}`}
                    onClick={() => selectVersion(version.id)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{version.title}</div>
                        <div className="muted mini">{version.targetCompany || "General"} · {version.targetRole || "Open role"}</div>
                        <div className="muted mini" style={{ marginTop: 4 }}>{version.templateId || "classic"} template</div>
                      </div>
                      <div
                        style={{
                          minWidth: 48,
                          textAlign: "center",
                          borderRadius: 12,
                          padding: "6px 8px",
                          background: active ? "rgba(255,255,255,.12)" : itemTone.bg,
                          color: active ? "#fff" : itemTone.color,
                          fontWeight: 700,
                        }}
                      >
                        {version.scorecard?.overall || 0}
                      </div>
                    </div>
                    <div className="muted mini" style={{ marginTop: 10, textTransform: "capitalize" }}>
                      {version.status}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="card" style={{ padding: 18 }}>
            <span className="label">Section focus</span>
            <div className="section-tabs">
              {SECTION_OPTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    className={`tab ${activeSection === section.id ? "active" : ""}`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <Icon size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                    {section.label}
                  </button>
                );
              })}
            </div>
          </section>
        </aside>

        <main className="stack">
          <section className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <UserRound size={18} />
              <div>
                <div style={{ fontWeight: 700 }}>Core profile</div>
                <div className="muted mini">This seeds every new tailored version.</div>
              </div>
            </div>
            <div className="two-col">
              <div>
                <span className="label">Full name</span>
                <input value={profile.basics.fullName || ""} onChange={(e) => updateBasics("fullName", e.target.value)} />
              </div>
              <div>
                <span className="label">Email</span>
                <input value={profile.basics.email || ""} onChange={(e) => updateBasics("email", e.target.value)} />
              </div>
              <div>
                <span className="label">Phone</span>
                <input value={profile.basics.phone || ""} onChange={(e) => updateBasics("phone", e.target.value)} />
              </div>
              <div>
                <span className="label">Location</span>
                <input value={profile.basics.location || ""} onChange={(e) => updateBasics("location", e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <span className="label">Headline</span>
              <input value={profile.basics.headline || ""} onChange={(e) => updateBasics("headline", e.target.value)} />
            </div>
            <div style={{ marginTop: 12 }}>
              <span className="label">Target roles</span>
              <input
                value={(profile.targeting?.targetRoles || []).join(", ")}
                onChange={(e) => updateTargeting("targetRoles", parseTags(e.target.value))}
              />
            </div>
          </section>

          <section className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <LayoutTemplate size={18} />
              <div>
                <div style={{ fontWeight: 700 }}>Template system</div>
                <div className="muted mini">Switch layouts without rewriting resume data.</div>
              </div>
            </div>
            <div className="template-grid">
              {templates.map((template) => {
                const selected = template.id === activeVersion.templateId;
                return (
                  <button
                    key={template.id}
                    className={`template-card ${selected ? "active" : ""}`}
                    onClick={() =>
                      patchVersion((current) => ({
                        ...current,
                        templateId: template.id,
                        theme: {
                          ...(current.theme || {}),
                          accent: template.accent || current.theme?.accent || "#c2612d",
                          density:
                            template.id === "compact"
                              ? "compact"
                              : template.id === "executive"
                                ? "comfortable"
                                : "balanced",
                        },
                        layout: {
                          ...(current.layout || {}),
                          columns: template.id === "modern" ? 2 : 1,
                          showSidebar: template.id === "modern",
                          compact: template.id === "compact",
                        },
                      }))
                    }
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                      <strong>{template.name}</strong>
                      <span className="pill" style={{ background: `${template.accent}18`, color: template.accent }}>
                        {template.previewTone}
                      </span>
                    </div>
                    <div className="mini muted" style={{ lineHeight: 1.6 }}>{template.description}</div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <Target size={18} />
              <div>
                <div style={{ fontWeight: 700 }}>Target job</div>
                <div className="muted mini">Paste a JD, analyze it, then tailor this version against it.</div>
              </div>
            </div>
            <div className="two-col">
              <div>
                <span className="label">Version title</span>
                <input value={activeVersion.title || ""} onChange={(e) => updateVersionField("title", e.target.value)} />
              </div>
              <div>
                <span className="label">Target company</span>
                <input value={activeVersion.targetCompany || ""} onChange={(e) => updateVersionField("targetCompany", e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <span className="label">Target role</span>
              <input value={activeVersion.targetRole || ""} onChange={(e) => updateVersionField("targetRole", e.target.value)} />
            </div>
            <div style={{ marginTop: 12 }}>
              <span className="label">Job description</span>
              <textarea
                value={activeVersion.jobDescription || ""}
                onChange={(e) => updateVersionField("jobDescription", e.target.value)}
                placeholder="Paste the job description here..."
              />
            </div>
            {deferredKeywords.length > 0 && (
              <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {deferredKeywords.map((keyword) => (
                  <span key={keyword} className="pill">{keyword}</span>
                ))}
              </div>
            )}
          </section>

          <section className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 700 }}>Tailored content</div>
                <div className="muted mini">Edit the live version that gets analyzed and exported.</div>
              </div>
            </div>

            {activeSection === "summary" && (
              <div>
                <span className="label">Professional summary</span>
                <textarea
                  value={activeVersion.sections.summary || ""}
                  onChange={(e) => updateSection("summary", e.target.value)}
                />
              </div>
            )}

            {activeSection === "skills" && (
              <div>
                <span className="label">Skills</span>
                <textarea
                  value={joinLines(activeVersion.sections.skills)}
                  onChange={(e) => updateSection("skills", parseLines(e.target.value))}
                  placeholder="One skill per line"
                />
              </div>
            )}

            {activeSection === "certifications" && (
              <div>
                <span className="label">Certifications</span>
                <textarea
                  value={joinLines(activeVersion.sections.certifications)}
                  onChange={(e) => updateSection("certifications", parseLines(e.target.value))}
                  placeholder="One certification per line"
                />
              </div>
            )}

            {activeSection === "experience" && (
              <div className="stack">
                {(activeVersion.sections.experience || []).map((item, index) => (
                  <div key={`experience-${index}`} className="entry">
                    <div className="two-col">
                      <div>
                        <span className="label">Company</span>
                        <input value={item.company || ""} onChange={(e) => updateExperience(index, "company", e.target.value)} />
                      </div>
                      <div>
                        <span className="label">Title</span>
                        <input value={item.title || ""} onChange={(e) => updateExperience(index, "title", e.target.value)} />
                      </div>
                      <div>
                        <span className="label">Location</span>
                        <input value={item.location || ""} onChange={(e) => updateExperience(index, "location", e.target.value)} />
                      </div>
                      <div>
                        <span className="label">Dates</span>
                        <input
                          value={`${item.startDate || ""}${item.startDate || item.endDate ? " - " : ""}${item.current ? "Present" : item.endDate || ""}`}
                          onChange={(e) => {
                            const [startDate, endDate] = e.target.value.split(" - ");
                            updateExperience(index, "startDate", startDate || "");
                            updateExperience(index, "endDate", endDate || "");
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <span className="label">Scope</span>
                      <textarea value={item.summary || ""} onChange={(e) => updateExperience(index, "summary", e.target.value)} />
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <span className="label">Impact bullets</span>
                      <textarea
                        value={joinLines(item.achievements)}
                        onChange={(e) => updateExperience(index, "achievements", parseLines(e.target.value))}
                      />
                    </div>
                  </div>
                ))}
                <button
                  className="btn"
                  onClick={() => updateSection("experience", [...(activeVersion.sections.experience || []), emptyExperience()])}
                >
                  <Plus size={16} />
                  Add experience
                </button>
              </div>
            )}

            {activeSection === "projects" && (
              <div className="stack">
                {(activeVersion.sections.projects || []).map((item, index) => (
                  <div key={`project-${index}`} className="entry">
                    <div className="two-col">
                      <div>
                        <span className="label">Project</span>
                        <input value={item.name || ""} onChange={(e) => updateProject(index, "name", e.target.value)} />
                      </div>
                      <div>
                        <span className="label">Link</span>
                        <input value={item.link || ""} onChange={(e) => updateProject(index, "link", e.target.value)} />
                      </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <span className="label">Summary</span>
                      <textarea value={item.summary || ""} onChange={(e) => updateProject(index, "summary", e.target.value)} />
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <span className="label">Highlights</span>
                      <textarea
                        value={joinLines(item.highlights)}
                        onChange={(e) => updateProject(index, "highlights", parseLines(e.target.value))}
                      />
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <span className="label">Technologies</span>
                      <input
                        value={(item.technologies || []).join(", ")}
                        onChange={(e) => updateProject(index, "technologies", parseTags(e.target.value))}
                      />
                    </div>
                  </div>
                ))}
                <button
                  className="btn"
                  onClick={() => updateSection("projects", [...(activeVersion.sections.projects || []), emptyProject()])}
                >
                  <Plus size={16} />
                  Add project
                </button>
              </div>
            )}

            {activeSection === "education" && (
              <div className="stack">
                {(activeVersion.sections.education || []).map((item, index) => (
                  <div key={`education-${index}`} className="entry">
                    <div className="two-col">
                      <div>
                        <span className="label">School</span>
                        <input value={item.school || ""} onChange={(e) => updateEducation(index, "school", e.target.value)} />
                      </div>
                      <div>
                        <span className="label">Degree</span>
                        <input value={item.degree || ""} onChange={(e) => updateEducation(index, "degree", e.target.value)} />
                      </div>
                      <div>
                        <span className="label">Field</span>
                        <input value={item.field || ""} onChange={(e) => updateEducation(index, "field", e.target.value)} />
                      </div>
                      <div>
                        <span className="label">Grade</span>
                        <input value={item.grade || ""} onChange={(e) => updateEducation(index, "grade", e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  className="btn"
                  onClick={() => updateSection("education", [...(activeVersion.sections.education || []), emptyEducation()])}
                >
                  <Plus size={16} />
                  Add education
                </button>
              </div>
            )}
          </section>
        </main>

        <aside className="stack rail">
          <section className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 700 }}>Fit score</div>
                <div className="muted mini">{activeVersion.analysis?.fitLabel || "Awaiting analysis"}</div>
              </div>
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 24,
                  background: tone.bg,
                  color: tone.color,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 28,
                  fontWeight: 700,
                }}
              >
                {versionScore}
              </div>
            </div>
            <div className="score">
              {[
                ["Keyword coverage", activeVersion.scorecard?.keywordCoverage || 0],
                ["Impact", activeVersion.scorecard?.impactScore || 0],
                ["Completeness", activeVersion.scorecard?.completenessScore || 0],
                ["ATS", activeVersion.scorecard?.atsScore || 0],
                ["Bullet quality", activeVersion.scorecard?.bulletQualityScore || 0],
                ["Role fit", activeVersion.scorecard?.roleAlignmentScore || 0],
              ].map(([label, value]) => (
                <div key={label} className="score-card">
                  <div className="mini muted">{label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{value}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Insights</div>
            <div className="list">
              {(activeVersion.insights || []).map((insight, index) => (
                <div key={`${insight.title}-${index}`} className="entry" style={{ padding: 14 }}>
                  <div className="pill" style={{ marginBottom: 10, background: insight.type === "strong" ? "rgba(20,108,67,.10)" : "rgba(194,97,45,.12)", color: insight.type === "strong" ? "#146c43" : "#c2612d" }}>
                    {insight.type}
                  </div>
                  <div style={{ fontWeight: 700 }}>{insight.title}</div>
                  <div className="muted mini" style={{ marginTop: 6, lineHeight: 1.6 }}>{insight.body}</div>
                </div>
              ))}
              {(!activeVersion.insights || activeVersion.insights.length === 0) && (
                <div className="muted mini">Run JD analysis to generate narrative diagnostics.</div>
              )}
            </div>
          </section>

          <section className="card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Template</div>
            <div className="diag">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{activeTemplate?.name || "Classic"}</div>
                  <div className="muted mini" style={{ marginTop: 4 }}>{activeTemplate?.description}</div>
                </div>
                <span className="pill" style={{ background: `${activeTemplate?.accent || "#c2612d"}18`, color: activeTemplate?.accent || "#c2612d" }}>
                  {activeTemplate?.previewTone || "Default"}
                </span>
              </div>
            </div>
          </section>

          <section className="card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Recommendations</div>
            <div className="list">
              {(activeVersion.analysis?.recommendations || []).map((item, index) => (
                <div key={`${item}-${index}`} className="mini" style={{ lineHeight: 1.7 }}>
                  {index + 1}. {item}
                </div>
              ))}
              {(!activeVersion.analysis?.recommendations || activeVersion.analysis.recommendations.length === 0) && (
                <div className="muted mini">The engine will surface rewrite guidance here.</div>
              )}
            </div>
          </section>

          <section className="card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Diagnostics</div>
            <div className="list">
              {(activeVersion.analysis?.diagnostics || []).map((item, index) => (
                <div key={`${item.message}-${index}`} className="diag">
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span
                      className="pill"
                      style={{
                        background: item.severity === "warning" ? "rgba(183,121,31,.12)" : "rgba(20,18,16,.06)",
                        color: item.severity === "warning" ? "#b7791f" : "#141210",
                      }}
                    >
                      {item.section}
                    </span>
                    <span className="mini muted">{item.severity}</span>
                  </div>
                  <div className="mini" style={{ marginTop: 10, lineHeight: 1.7 }}>{item.message}</div>
                  {item.bullet ? (
                    <div className="mini muted" style={{ marginTop: 8, lineHeight: 1.6, fontStyle: "italic" }}>
                      {item.bullet}
                    </div>
                  ) : null}
                </div>
              ))}
              {(!activeVersion.analysis?.diagnostics || activeVersion.analysis.diagnostics.length === 0) && (
                <div className="muted mini">Run analysis to surface duplicate, weak, and missing-proof signals.</div>
              )}
            </div>
          </section>

          <section className="card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Live preview</div>
            <div className="preview-section">
              <div style={{ fontFamily: '"Fraunces",serif', fontSize: 28 }}>{profile.basics.fullName}</div>
              <div className="muted mini" style={{ marginTop: 6 }}>
                {[profile.basics.email, profile.basics.phone, profile.basics.location].filter(Boolean).join(" · ")}
              </div>
            </div>
            <div className="preview-section">
              <div className="label">Summary</div>
              <div className="mini" style={{ lineHeight: 1.8 }}>{activeVersion.sections.summary || "No summary yet"}</div>
            </div>
            <div className="preview-section">
              <div className="label">Layout</div>
              <div className="mini muted">
                {activeVersion.templateId || "classic"} · {activeVersion.layout?.columns || 1} column
                {activeVersion.layout?.showSidebar ? " · sidebar" : ""}
                {activeVersion.layout?.compact ? " · compact" : ""}
              </div>
            </div>
            <div className="preview-section">
              <div className="label">Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(activeVersion.sections.skills || []).slice(0, 12).map((skill) => (
                  <span key={skill} className="pill">{skill}</span>
                ))}
              </div>
            </div>
            <div className="preview-section">
              <div className="label">Experience bullets</div>
              <div className="list">
                {(activeVersion.sections.experience || [])
                  .flatMap((item) => item.achievements || [])
                  .slice(0, 4)
                  .map((item, index) => (
                    <div key={`${item}-${index}`} className="mini">{item}</div>
                  ))}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default Resume;
