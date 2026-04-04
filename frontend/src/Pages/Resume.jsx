import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');
    .rv-root,.rv-root *,.rv-root *::before,.rv-root *::after{box-sizing:border-box}
    .rv-root *{margin:0;padding:0}.rv-root{--cream:#f5f0e8;--cream-dim:#ede8dc;--ink:#0f0e0c;--ink-2:#2a2925;--ink-3:#4a4840;--ink-4:#7a7770;--ink-5:#a8a49c;--gold:#c9a84c;--gold-dim:rgba(201,168,76,.15);--gold-border:rgba(201,168,76,.3);--green:#2d6a4f;--green-bg:rgba(45,106,79,.08);--green-border:rgba(45,106,79,.2);--red:#9b2335;--red-bg:rgba(155,35,53,.07);--surface:#faf8f3;--border:rgba(15,14,12,.1);--border-2:rgba(15,14,12,.06);--shadow-sm:0 1px 3px rgba(15,14,12,.06),0 1px 2px rgba(15,14,12,.04);--shadow-md:0 4px 16px rgba(15,14,12,.08),0 2px 6px rgba(15,14,12,.05);--font-serif:"Instrument Serif",Georgia,serif;--font-sans:"Geist",system-ui,sans-serif;--font-mono:"Geist Mono",monospace;min-height:100vh;background:var(--cream);color:var(--ink);font-family:var(--font-sans);font-size:14px;line-height:1.6;-webkit-font-smoothing:antialiased}
    .rv-root::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:.022;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");background-repeat:repeat;background-size:128px}
    .rv-root ::-webkit-scrollbar{width:4px}.rv-root ::-webkit-scrollbar-track{background:transparent}.rv-root ::-webkit-scrollbar-thumb{background:var(--ink-5);border-radius:4px}
    .rv-root textarea,.rv-root input{width:100%;font-family:var(--font-sans);font-size:13px;color:var(--ink);background:transparent;border:none;outline:none;resize:none}
    .rv-root textarea::placeholder,.rv-root input::placeholder{color:var(--ink-5)}
    .rv-root .label{font-family:var(--font-mono);font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-4)}
    .rv-root .serif{font-family:var(--font-serif)}
    .rv-shell{max-width:1600px;margin:0 auto;padding:0 28px 60px}
    .rv-topbar{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:20px 0 6px;border-bottom:1px solid var(--border);margin-bottom:28px}
    .rv-topbar-meta{display:flex;gap:10px;align-items:center;flex-shrink:0}
    .rv-grid{display:grid;grid-template-columns:230px minmax(0,1fr) 320px;gap:18px;align-items:start}
    .rv-column{display:flex;flex-direction:column;gap:16px}
    .rv-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px}
    .rv-actions{display:flex;gap:8px;flex-shrink:0}
    .rv-identity,.rv-scorecard{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .rv-scorecard{gap:8px}
    @media (max-width:1200px){.rv-grid{grid-template-columns:220px minmax(0,1fr)}.rv-right{grid-column:1 / -1}}
    @media (max-width:920px){.rv-shell{padding:0 16px 40px}.rv-topbar{flex-direction:column;align-items:flex-start}.rv-topbar-meta{width:100%;flex-wrap:wrap}.rv-grid{grid-template-columns:1fr}.rv-header{flex-direction:column}.rv-actions{width:100%;flex-wrap:wrap}.rv-identity,.rv-scorecard{grid-template-columns:1fr}}
  `}</style>
);

// BACKEND: replace these mocked versions with GET /resume/versions.
const VERSIONS = [
  { id: 1, name: "Head of Product", company: "Stripe", fit: 94, status: "Ready", color: "#2d6a4f" },
  { id: 2, name: "Growth PM", company: "Notion", fit: 89, status: "Draft", color: "#c9a84c" },
  { id: 3, name: "Product Lead", company: "Zepto", fit: 86, status: "Review", color: "#9b2335" },
];

const SECTIONS = [
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
];

// BACKEND: replace with JD analysis + scoring response.
const INSIGHTS = [
  { type: "gap", icon: "01", title: "Missing evidence", body: "Add one bullet proving you designed an experiment, shipped it, and quantified the outcome." },
  { type: "strong", icon: "02", title: "Strong match", body: "Platform strategy, cross-functional leadership, and 0-to-1 launches map directly to this role." },
  { type: "fix", icon: "03", title: "Narrative fix", body: "Open your summary with growth systems and business outcomes, not a generic identity line." },
];

// BACKEND: hydrate from GET /resume/versions/:id.
const INITIAL_STATE = {
  fullName: "Aanya Mehta",
  headline: "Product leader focused on growth systems, platform bets, and measurable execution.",
  summary: "Product leader with 7+ years translating ambiguous market signals into roadmaps, experiments, and launches that improve user activation, retention, and revenue quality.",
  experience: "Led cross-functional pod of 9 across product, design, and engineering to redesign onboarding, increasing activation 27% and reducing time-to-value from 3.4 to 1.9 days.\n\nBuilt phased experimentation roadmap for marketplace growth, lifting qualified supply 31% and improving first-week conversion 19%.",
  skills: "Growth strategy | Experimentation | Roadmapping | Product analytics | Cross-functional leadership | Stakeholder management",
  projects: "Marketplace architecture rebuild\nCreator onboarding funnel optimization\nExperimentation framework rollout",
  roleTitle: "Head of Product",
  targetCompany: "Stripe",
};

// BACKEND: seed from selected application or saved JD.
const INITIAL_JD = "We need a product leader who has driven 0 to 1 launches, built experimentation systems, partnered deeply with engineering and design, and translated ambiguous market signals into roadmap decisions with measurable growth outcomes.";

function Card({ children, style = {} }) {
  return <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, boxShadow: "var(--shadow-sm)", ...style }}>{children}</div>;
}

function Pill({ children, variant = "default" }) {
  const tones = {
    default: { bg: "rgba(15,14,12,.06)", color: "var(--ink-3)", border: "var(--border-2)" },
    gold: { bg: "var(--gold-dim)", color: "var(--gold)", border: "var(--gold-border)" },
    green: { bg: "var(--green-bg)", color: "var(--green)", border: "var(--green-border)" },
  };
  const tone = tones[variant];
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "5px 12px", borderRadius: 100, background: tone.bg, color: tone.color, border: `1px solid ${tone.border}`, fontSize: 12, fontWeight: 500 }}>{children}</span>;
}

function Btn({ children, solid = false }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 12, background: solid ? "var(--ink)" : "transparent", color: solid ? "var(--cream)" : "var(--ink-3)", border: solid ? "none" : "1px solid var(--border)", fontSize: 12.5, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}
    >
      {children}
    </motion.button>
  );
}

function FitBar({ value }) {
  const color = value >= 90 ? "var(--green)" : value >= 80 ? "var(--gold)" : "var(--red)";
  return <div style={{ width: "100%", height: 2, background: "var(--border)", borderRadius: 100, overflow: "hidden" }}><motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }} style={{ height: "100%", background: color }} /></div>;
}

function ScoreRing({ value }) {
  const size = 52;
  const stroke = 4;
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = value >= 90 ? "var(--green)" : value >= 80 ? "var(--gold)" : "var(--red)";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color }}>{value}%</div>
    </div>
  );
}

function VersionSidebar({ activeId, setActiveId }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ padding: "0 4px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="label">Versions</span>
        {/* BACKEND: POST /resume/versions/new should create a new draft version. */}
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }} style={{ width: 26, height: 26, borderRadius: 8, background: "var(--ink)", color: "var(--cream)", border: "none", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>+</motion.button>
      </div>
      {VERSIONS.map((version, i) => {
        const active = version.id === activeId;
        return (
          <motion.button key={version.id} onClick={() => setActiveId(version.id)} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ x: 2 }} style={{ width: "100%", textAlign: "left", cursor: "pointer", padding: "14px 16px", borderRadius: 16, background: active ? "var(--ink)" : "var(--surface)", border: `1px solid ${active ? "var(--ink)" : "var(--border)"}`, boxShadow: active ? "var(--shadow-md)" : "var(--shadow-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: active ? "var(--cream)" : "var(--ink)", lineHeight: 1.3 }}>{version.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: active ? "rgba(245,240,232,.5)" : "var(--ink-5)", marginTop: 2 }}>{version.company}</div>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: active ? "var(--gold)" : version.color }}>{version.fit}%</div>
            </div>
            <div style={{ marginTop: 10 }}><FitBar value={version.fit} /></div>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: active ? "rgba(245,240,232,.4)" : "var(--ink-5)", letterSpacing: ".06em", textTransform: "uppercase" }}>{version.status}</span>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: version.status === "Ready" ? "var(--green)" : version.status === "Draft" ? "var(--gold)" : "var(--red)" }} />
            </div>
          </motion.button>
        );
      })}
      <div style={{ marginTop: 16, padding: "0 4px 10px" }}><span className="label">Sections</span></div>
    </div>
  );
}

function SectionNav({ active, setActive }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {SECTIONS.map((section) => {
        const isActive = section.id === active;
        return (
          <motion.button key={section.id} onClick={() => setActive(section.id)} whileHover={{ x: 2 }} style={{ width: "100%", textAlign: "left", cursor: "pointer", padding: "10px 14px", borderRadius: 12, background: isActive ? "var(--gold-dim)" : "transparent", border: `1px solid ${isActive ? "var(--gold-border)" : "transparent"}`, fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? "var(--gold)" : "var(--ink-3)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{section.label}</span>
            {isActive && <span style={{ fontSize: 8, letterSpacing: ".2em", color: "var(--gold)", fontFamily: "var(--font-mono)" }}>EDITING</span>}
          </motion.button>
        );
      })}
    </div>
  );
}

function JDPanel({ jd, setJd }) {
  // BACKEND: extracted keywords should come from POST /resume/analyze-jd.
  const keywords = ["Product strategy", "Experimentation", "0 to 1", "Analytics", "Cross-functional"];
  return (
    <Card style={{ padding: "28px 28px 24px" }}>
      <div className="rv-header">
        <div>
          <span className="label" style={{ display: "block", marginBottom: 8 }}>Step 1 | Target role</span>
          <h2 className="serif" style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.25 }}>Paste the job description</h2>
          <p style={{ marginTop: 6, fontSize: 13, color: "var(--ink-4)", lineHeight: 1.7 }}>Every tailoring decision starts here. The AI reads this to align your language, keywords, and evidence.</p>
        </div>
        <div className="rv-actions">
          {/* BACKEND: POST /resume/analyze-jd returns structured JD analysis. */}
          <Btn>Analyze</Btn>
          {/* BACKEND: POST /resume/generate returns the first tailored draft. */}
          <Btn solid>Generate</Btn>
        </div>
      </div>
      <div style={{ borderRadius: 14, border: "1px solid var(--border)", background: "var(--cream)", padding: "16px 18px" }}>
        <textarea value={jd} onChange={(event) => setJd(event.target.value)} rows={5} style={{ lineHeight: 1.75, color: "var(--ink-2)", fontSize: 13 }} placeholder="Paste job description..." />
      </div>
      <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
        <span className="label" style={{ alignSelf: "center", marginRight: 4 }}>Extracted keywords</span>
        {keywords.map((keyword) => <Pill key={keyword} variant="gold">{keyword}</Pill>)}
      </div>
    </Card>
  );
}

function EditorPanel({ state, update, activeSection, setActiveSection }) {
  const field = useMemo(() => ({
    summary: { key: "summary", placeholder: "A sharp 3-line pitch: who you are, what you lead, and the outcomes you create.", helper: "Tie identity to the role. No generic opener." },
    experience: { key: "experience", placeholder: "Impact-first bullets with scope, metrics, and business outcomes.", helper: "Prioritize the achievements most relevant to the JD." },
    skills: { key: "skills", placeholder: "Add skills separated by |", helper: "Keep this role-specific. ATS reads this early." },
    projects: { key: "projects", placeholder: "Projects that strengthen this version's story.", helper: "Only keep projects that matter for this role." },
  }[activeSection]), [activeSection]);

  return (
    <Card style={{ padding: "28px" }}>
      <div className="rv-header">
        <div>
          <span className="label" style={{ display: "block", marginBottom: 8 }}>Step 2 | Resume content</span>
          <h2 className="serif" style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.25 }}>Edit and refine</h2>
          <p style={{ marginTop: 6, fontSize: 13, color: "var(--ink-4)", lineHeight: 1.7 }}>Sharpen the generated draft. Every field updates the live preview instantly.</p>
        </div>
      </div>

      <div className="rv-identity">
        {[{ label: "Full name", key: "fullName" }, { label: "Headline", key: "headline" }, { label: "Target role", key: "roleTitle" }, { label: "Target company", key: "targetCompany" }].map(({ label, key }) => (
          <div key={key} style={{ padding: "12px 16px", borderRadius: 12, background: "var(--cream)", border: "1px solid var(--border)" }}>
            <div className="label" style={{ marginBottom: 5 }}>{label}</div>
            <input value={state[key]} onChange={(event) => update(key, event.target.value)} style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 4, margin: "14px 0", padding: "4px", background: "var(--cream-dim)", borderRadius: 12, border: "1px solid var(--border-2)", flexWrap: "wrap" }}>
        {SECTIONS.map((section) => {
          const isActive = section.id === activeSection;
          return <motion.button key={section.id} onClick={() => setActiveSection(section.id)} layout style={{ flex: 1, minWidth: 120, padding: "7px 0", borderRadius: 9, background: isActive ? "var(--surface)" : "transparent", border: isActive ? "1px solid var(--border)" : "1px solid transparent", boxShadow: isActive ? "var(--shadow-sm)" : "none", fontSize: 12.5, fontWeight: isActive ? 600 : 400, color: isActive ? "var(--ink)" : "var(--ink-4)", cursor: "pointer" }}>{section.label}</motion.button>;
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          <div style={{ borderRadius: 14, border: "1px solid var(--border)", background: "var(--cream)", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid var(--border-2)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "var(--ink-4)" }}>{field.helper}</span>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {/* BACKEND: POST /resume/rewrite-section should accept section id + content. */}
                {["Add metrics", "Sound more senior", "Shorten for ATS"].map((chip) => <Pill key={chip}>{chip}</Pill>)}
              </div>
            </div>
            <textarea value={state[field.key]} onChange={(event) => update(field.key, event.target.value)} rows={8} style={{ display: "block", padding: "16px 18px", lineHeight: 1.8, fontSize: 13.5, color: "var(--ink-2)" }} placeholder={field.placeholder} />
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {/* BACKEND: POST /resume/rewrite-section returns rewritten content. */}
            <Btn solid>Rewrite section</Btn>
            {/* BACKEND: POST /resume/suggest-bullets returns bullet alternatives. */}
            <Btn>Suggest bullets</Btn>
            {/* BACKEND: POST /resume/check-ats returns ATS warnings. */}
            <Btn>Check ATS</Btn>
            <div style={{ marginLeft: "auto", display: "flex", gap: 5, flexWrap: "wrap" }}>
              {["Tailor to JD", "Active voice"].map((chip) => <Pill key={chip}>{chip}</Pill>)}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}

function PreviewPanel({ state }) {
  return (
    <Card style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <span className="label" style={{ display: "block", marginBottom: 6 }}>Step 3 | Live preview</span>
          <h3 className="serif" style={{ fontSize: 18, fontWeight: 400 }}>Recruiter view</h3>
        </div>
        <Pill variant="green">ATS-safe</Pill>
      </div>
      <div style={{ borderRadius: 14, border: "1px solid var(--border)", background: "#fff", padding: "20px 20px 22px", boxShadow: "var(--shadow-sm)" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 400 }}>{state.fullName}</p>
        <p style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 5, lineHeight: 1.6 }}>{state.headline}</p>
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border-2)" }}>
          {[{ label: "Summary", value: state.summary }, { label: "Experience", value: state.experience }, { label: "Skills", value: state.skills }, { label: "Projects", value: state.projects }].map((item) => (
            <div key={item.label} style={{ marginBottom: 14 }}>
              <span className="label" style={{ display: "block", marginBottom: 5 }}>{item.label}</span>
              <p style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.75, whiteSpace: "pre-line" }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
        {/* BACKEND: POST /resume/versions/:id/save persists the current draft. */}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1, padding: "10px 0", borderRadius: 12, background: "var(--ink)", color: "var(--cream)", border: "none", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Save version</motion.button>
        {/* BACKEND: GET /resume/versions/:id/export returns PDF or DOCX. */}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ padding: "10px 16px", borderRadius: 12, background: "transparent", color: "var(--ink-3)", border: "1px solid var(--border)", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>PDF</motion.button>
      </div>
    </Card>
  );
}

function ScorecardPanel({ activeVersion }) {
  // BACKEND: replace with fit analysis response for the selected version.
  const metrics = [
    { label: "ATS fit", value: `${activeVersion.fit}%`, color: activeVersion.fit >= 90 ? "var(--green)" : "var(--gold)" },
    { label: "Evidence strength", value: "8.9 / 10", color: "var(--gold)" },
    { label: "Narrative clarity", value: "Strong", color: "var(--green)" },
    { label: "Keyword density", value: "High", color: "var(--green)" },
  ];
  return (
    <Card style={{ padding: "22px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <ScoreRing value={activeVersion.fit} />
        <div>
          <span className="label" style={{ display: "block", marginBottom: 4 }}>Scorecard</span>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>Version quality</h3>
          <p style={{ fontSize: 12, color: "var(--ink-5)", marginTop: 2 }}>vs {activeVersion.company} JD</p>
        </div>
      </div>
      <div className="rv-scorecard">
        {metrics.map((metric) => <div key={metric.label} style={{ padding: "11px 13px", borderRadius: 12, background: "var(--cream)", border: "1px solid var(--border-2)" }}><div className="label" style={{ marginBottom: 4 }}>{metric.label}</div><div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: metric.color }}>{metric.value}</div></div>)}
      </div>
    </Card>
  );
}

function InsightsPanel() {
  const iconColors = { gap: "var(--gold)", strong: "var(--green)", fix: "var(--red)" };
  const bgColors = { gap: "var(--gold-dim)", strong: "var(--green-bg)", fix: "var(--red-bg)" };
  return (
    <Card style={{ padding: "22px 24px" }}>
      <span className="label" style={{ display: "block", marginBottom: 10 }}>AI guidance</span>
      <h3 className="serif" style={{ fontSize: 18, fontWeight: 400, marginBottom: 16 }}>What to improve</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {INSIGHTS.map((insight, i) => (
          <motion.div key={insight.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} style={{ padding: "14px 15px", borderRadius: 14, background: bgColors[insight.type], border: `1px solid ${insight.type === "gap" ? "var(--gold-border)" : insight.type === "strong" ? "var(--green-border)" : "rgba(155,35,53,.18)"}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: iconColors[insight.type] }}>{insight.icon}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-2)" }}>{insight.title}</span>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.65 }}>{insight.body}</p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

function AppKitPanel() {
  // BACKEND: wire these actions to cover letter and interview-kit generation endpoints.
  const items = ["Cover letter draft", "Interview question pack", "STAR story bank"];
  return (
    <div style={{ borderRadius: 20, background: "var(--ink-2)", border: "1px solid rgba(255,255,255,.06)", padding: "22px 24px", boxShadow: "var(--shadow-md)" }}>
      <span className="label" style={{ color: "rgba(245,240,232,.62)" }}>Application kit</span>
      <h3 className="serif" style={{ fontSize: 18, fontWeight: 400, color: "var(--cream)", marginTop: 6, marginBottom: 8 }}>Generate next</h3>
      <p style={{ fontSize: 12.5, color: "rgba(245,240,232,.82)", lineHeight: 1.65, marginBottom: 16 }}>Once the resume is sharp, generate the full application kit from the same tailored story.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item) => (
          <motion.button key={item} whileHover={{ x: 3 }} style={{ width: "100%", textAlign: "left", padding: "11px 14px", borderRadius: 12, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", color: "rgba(245,240,232,.96)", fontSize: 12.5, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{item}</span>
            <span>{">"}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function TopBar({ activeVersion }) {
  return (
    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rv-topbar">
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 500, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gold)", padding: "3px 9px", borderRadius: 100, background: "var(--gold-dim)", border: "1px solid var(--gold-border)" }}>Resume Workspace</span>
        </div>
        <h1 className="serif" style={{ fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 400, lineHeight: 1.15 }}>Build a resume that<br /><span style={{ fontStyle: "italic", color: "var(--ink-3)" }}>gets the interview.</span></h1>
      </div>
      <div className="rv-topbar-meta">
        <div style={{ padding: "10px 16px", borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}><div className="label" style={{ marginBottom: 2 }}>Active version</div><div style={{ fontWeight: 600, fontSize: 13 }}>{activeVersion.name} | {activeVersion.company}</div></div>
        <div style={{ padding: "10px 16px", borderRadius: 14, background: "var(--green-bg)", border: "1px solid var(--green-border)" }}><div className="label" style={{ marginBottom: 2, color: "var(--green)" }}>ATS fit</div><div style={{ fontWeight: 700, fontSize: 16, fontFamily: "var(--font-mono)", color: "var(--green)" }}>{activeVersion.fit}%</div></div>
        <div style={{ padding: "10px 16px", borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)" }}><div className="label" style={{ marginBottom: 2 }}>Next action</div><div style={{ fontWeight: 600, fontSize: 12.5 }}>Rewrite experience</div></div>
      </div>
    </motion.div>
  );
}

export default function Resume() {
  const [activeVersionId, setActiveVersionId] = useState(1);
  const [activeSection, setActiveSection] = useState("experience");
  const [jd, setJd] = useState(INITIAL_JD);
  const [state, setState] = useState(INITIAL_STATE);

  const activeVersion = VERSIONS.find((version) => version.id === activeVersionId) || VERSIONS[0];

  // BACKEND: replace local updates with save/autosave mutations when the API is ready.
  const update = (key, value) => setState((current) => ({ ...current, [key]: value }));

  return (
    <div className="rv-root">
      <Styles />
      <div className="rv-shell">
        <TopBar activeVersion={activeVersion} />
        <div className="rv-grid">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="rv-column">
            <VersionSidebar activeId={activeVersionId} setActiveId={setActiveVersionId} />
            <SectionNav active={activeSection} setActive={setActiveSection} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08 }} className="rv-column">
            <JDPanel jd={jd} setJd={setJd} />
            <EditorPanel state={state} update={update} activeSection={activeSection} setActiveSection={setActiveSection} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.14 }} className="rv-column rv-right">
            <PreviewPanel state={state} />
            <ScorecardPanel activeVersion={activeVersion} />
            <InsightsPanel />
            <AppKitPanel />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

