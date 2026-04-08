import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProductHeader from "../Components/ui/ProductHeader";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');
  .mp-root,.mp-root *,.mp-root *::before,.mp-root *::after{box-sizing:border-box}
  .mp-root *{margin:0;padding:0}
  .mp-root{--cream:#f5f0e8;--cream-dim:#ede8dc;--cream-deep:#e4ddd0;--ink:#0f0e0c;--ink-2:#2a2925;--ink-3:#4a4840;--ink-4:#7a7770;--ink-5:#a8a49c;--gold:#c9a84c;--gold-light:#e8c96a;--gold-dim:rgba(201,168,76,.15);--gold-border:rgba(201,168,76,.3);--green:#2d6a4f;--green-bg:rgba(45,106,79,.08);--green-border:rgba(45,106,79,.2);--red:#9b2335;--red-bg:rgba(155,35,53,.07);--surface:#faf8f3;--border:rgba(15,14,12,.1);--border-2:rgba(15,14,12,.06);--shadow-sm:0 1px 3px rgba(15,14,12,.06),0 1px 2px rgba(15,14,12,.04);--shadow-md:0 4px 16px rgba(15,14,12,.08),0 2px 6px rgba(15,14,12,.05);--shadow-lg:0 20px 60px rgba(15,14,12,.1),0 8px 24px rgba(15,14,12,.06);--font-serif:"Instrument Serif",Georgia,serif;--font-sans:"Geist",system-ui,sans-serif;--font-mono:"Geist Mono",monospace;min-height:100vh;background:var(--cream);color:var(--ink);font-family:var(--font-sans);position:relative;overflow:hidden;-webkit-font-smoothing:antialiased}
  .mp-root::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.022;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");background-repeat:repeat;background-size:128px}
  .mp-root input,.mp-root textarea,.mp-root button{font-family:var(--font-sans)}
  .mp-root input{outline:none}
  .mp-root .label{font-family:var(--font-mono);font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-4)}
  .mp-root .serif{font-family:var(--font-serif)}
  .mp-root ::-webkit-scrollbar{width:4px}.mp-root ::-webkit-scrollbar-track{background:transparent}.mp-root ::-webkit-scrollbar-thumb{background:var(--ink-5);border-radius:4px}
  .mp-shell{max-width:1600px;margin:0 auto;padding:0 28px 60px;position:relative;z-index:1}
  .mp-main{display:grid;grid-template-columns:280px minmax(0,1fr);gap:18px;align-items:start}
  .mp-column{display:flex;flex-direction:column;gap:16px}
  .mp-products{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
  .mp-feature-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:16px}
  .mp-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;box-shadow:var(--shadow-sm)}
  .mp-modal-backdrop{position:fixed;inset:0;background:rgba(15,14,12,.32);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;z-index:40}
  @media (max-width:1200px){.mp-main{grid-template-columns:1fr}.mp-products{grid-template-columns:repeat(2,minmax(0,1fr))}.mp-feature-grid{grid-template-columns:1fr}}
  @media (max-width:820px){.mp-shell{padding:0 16px 40px}.mp-products{grid-template-columns:1fr}}
`;

const categories = [
  "Resume kits",
  "Portfolio assets",
  "Career templates",
  "Interview prep",
  "Student deals",
  "Creator tools",
];

const spotlightCollections = [
  { title: "Career launch stack", desc: "Resume, portfolio, and interview assets bundled together.", badge: "Hot" },
  { title: "Student seller circle", desc: "Trusted student creators shipping practical digital products.", badge: "Trusted" },
  { title: "Instant-use templates", desc: "Assets you can plug into your workflow today, no setup drama.", badge: "Ready" },
];

const products = [
  {
    id: "resume-ops-pack",
    name: "Resume Ops Premium Pack",
    seller: "Aanya Studio",
    category: "Resume kits",
    price: "$19",
    rating: "4.9",
    reviews: 184,
    badge: "Best seller",
    accent: "gold",
    summary: "ATS-safe resume templates, recruiter copy blocks, and job-tailoring checklists in one polished pack.",
  },
  {
    id: "portfolio-motion-kit",
    name: "Portfolio Motion Kit",
    seller: "Design Sprint Lab",
    category: "Portfolio assets",
    price: "$24",
    rating: "4.8",
    reviews: 96,
    badge: "New drop",
    accent: "green",
    summary: "Premium landing sections, motion presets, and case study layouts built for standout portfolios.",
  },
  {
    id: "interview-story-bank",
    name: "Interview Story Bank",
    seller: "Career Foundry Co.",
    category: "Interview prep",
    price: "$14",
    rating: "4.7",
    reviews: 132,
    badge: "Fast mover",
    accent: "ink",
    summary: "STAR answer structures, confidence prompts, and role-specific story frameworks for high-stakes interviews.",
  },
  {
    id: "student-sidehustle-bundle",
    name: "Student Side-Hustle Bundle",
    seller: "Campus Creator Guild",
    category: "Student deals",
    price: "$11",
    rating: "4.9",
    reviews: 71,
    badge: "Student fave",
    accent: "gold",
    summary: "Editable templates, digital products, and pricing guides for students selling online for the first time.",
  },
  {
    id: "creator-launch-notion",
    name: "Creator Launch Workspace",
    seller: "Mini Venture Lab",
    category: "Creator tools",
    price: "$29",
    rating: "4.8",
    reviews: 54,
    badge: "Premium",
    accent: "green",
    summary: "A premium workspace for product launches, audience tracking, shipping logs, and growth experiments.",
  },
  {
    id: "career-template-vault",
    name: "Career Template Vault",
    seller: "Elevate Studio",
    category: "Career templates",
    price: "$17",
    rating: "4.9",
    reviews: 208,
    badge: "Top rated",
    accent: "ink",
    summary: "A polished vault of outreach templates, application trackers, scorecards, and recruiter follow-up scripts.",
  },
];

const accentMap = {
  gold: {
    bg: "var(--gold-dim)",
    border: "var(--gold-border)",
    text: "var(--gold)",
  },
  green: {
    bg: "var(--green-bg)",
    border: "var(--green-border)",
    text: "var(--green)",
  },
  ink: {
    bg: "rgba(15,14,12,.06)",
    border: "var(--border)",
    text: "var(--ink-3)",
  },
};

function Card({ children, style = {}, className = "" }) {
  return (
    <div className={`mp-card ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}

function Pill({ children, variant = "default" }) {
  const tones = {
    default: { bg: "rgba(15,14,12,.06)", color: "var(--ink-3)", border: "var(--border-2)" },
    gold: { bg: "var(--gold-dim)", color: "var(--gold)", border: "var(--gold-border)" },
    green: { bg: "var(--green-bg)", color: "var(--green)", border: "var(--green-border)" },
  };
  const tone = tones[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 12px",
        borderRadius: 100,
        background: tone.bg,
        color: tone.color,
        border: `1px solid ${tone.border}`,
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

function ActionButton({ children, solid = false, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        padding: "10px 16px",
        borderRadius: 12,
        background: solid ? "var(--ink)" : "transparent",
        color: solid ? "var(--cream)" : "var(--ink-3)",
        border: solid ? "none" : "1px solid var(--border)",
        fontSize: 12.5,
        fontWeight: 500,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

function MarketplaceModal({ open, title, body, onClose }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="mp-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          onClick={(event) => event.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 460,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 24,
            boxShadow: "var(--shadow-lg)",
            padding: 24,
          }}
        >
          <span className="label" style={{ display: "block", marginBottom: 10 }}>
            Marketplace action
          </span>
          <h3 className="serif" style={{ fontSize: 28, fontWeight: 400, lineHeight: 1.05 }}>
            {title}
          </h3>
          <p style={{ marginTop: 12, fontSize: 14, color: "var(--ink-4)", lineHeight: 1.75 }}>
            {body}
          </p>
          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <ActionButton solid onClick={onClose}>
              Got it
            </ActionButton>
            <ActionButton onClick={onClose}>Keep browsing</ActionButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function SellerSpotlightCard({ title, desc, badge }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      style={{
        padding: "16px 18px",
        borderRadius: 16,
        background: "var(--cream-dim)",
        border: "1px solid var(--border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-2)" }}>{title}</div>
        <Pill variant="gold">{badge}</Pill>
      </div>
      <p style={{ marginTop: 8, fontSize: 12.8, color: "var(--ink-4)", lineHeight: 1.7 }}>{desc}</p>
    </motion.div>
  );
}

function ProductCard({ product, onComingSoon }) {
  const accent = accentMap[product.accent];

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.18 }}>
      <Card style={{ padding: 18, height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <Pill variant={product.accent === "green" ? "green" : product.accent === "gold" ? "gold" : "default"}>
            {product.badge}
          </Pill>
          <div
            style={{
              padding: "6px 10px",
              borderRadius: 999,
              background: accent.bg,
              border: `1px solid ${accent.border}`,
              color: accent.text,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {product.price}
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            minHeight: 168,
            borderRadius: 18,
            background:
              product.accent === "green"
                ? "linear-gradient(135deg, rgba(45,106,79,.14), rgba(245,240,232,.7))"
                : product.accent === "gold"
                  ? "linear-gradient(135deg, rgba(201,168,76,.18), rgba(245,240,232,.72))"
                  : "linear-gradient(135deg, rgba(15,14,12,.08), rgba(245,240,232,.72))",
            border: "1px solid var(--border)",
            padding: 18,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div className="label" style={{ marginBottom: 6 }}>
              {product.category}
            </div>
            <h3 className="serif" style={{ fontSize: 28, fontWeight: 400, lineHeight: 1.02 }}>
              {product.name}
            </h3>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--ink-5)" }}>Sold by</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>{product.seller}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "var(--ink-5)" }}>Rating</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>
                {product.rating} / 5
              </div>
            </div>
          </div>
        </div>

        <p style={{ marginTop: 14, fontSize: 13.2, color: "var(--ink-4)", lineHeight: 1.72 }}>
          {product.summary}
        </p>

        <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ fontSize: 12.5, color: "var(--ink-5)" }}>{product.reviews} verified reviews</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <ActionButton onClick={() => onComingSoon(`Purchase ${product.name}`, "Checkout, payment, and secure order processing are coming soon. For now, the marketplace is a premium frontend showcase.")}>
              Buy now
            </ActionButton>
            <ActionButton solid onClick={() => onComingSoon(`Unlock ${product.name}`, "Instant purchase, seller messaging, and delivery flows will be connected once marketplace backend work begins.")}>
              Get product
            </ActionButton>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function Marketplace() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [modalState, setModalState] = useState({ open: false, title: "", body: "" });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        product.name.toLowerCase().includes(q) ||
        product.seller.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.summary.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const openComingSoon = (title, body) => {
    setModalState({ open: true, title, body });
  };

  return (
    <div className="mp-root">
      <style>{styles}</style>

      <div
        style={{
          position: "absolute",
          top: -160,
          left: -120,
          width: 540,
          height: 540,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.14) 0%, transparent 70%)",
          filter: "blur(42px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -80,
          top: 120,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(45,106,79,0.11) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <div className="mp-shell">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ marginBottom: 28 }}
        >
          <ProductHeader
            theme="light"
            eyebrow="Marketplace"
            title="Discover practical assets that strengthen how users learn, apply, and ship."
            description="Browse curated digital products, keep seller actions close, and shape the marketplace around execution instead of clutter."
            stats={[
              {
                label: "Inventory",
                value: `${products.length}`,
                detail: "Curated products in the current showcase.",
              },
              {
                label: "Status",
                value: "Live",
                detail: "Frontend experience is available now.",
              },
              {
                label: "Next Phase",
                value: "Orders",
                detail: "Payments and transaction flows come next.",
              },
              {
                label: "Categories",
                value: categories.length,
                detail: "Focused browsing lanes for different needs.",
              },
            ]}
            actions={[
              {
                label: "List a product",
                onClick: () => navigate("/marketplace/addproduct"),
              },
              {
                label: "My listings",
                onClick: () => navigate("/marketplace/mylistedproduct"),
                variant: "secondary",
              },
            ]}
          />
        </motion.div>

        <div className="mp-main">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mp-column"
          >
            <Card style={{ padding: 24 }}>
              <span className="label" style={{ display: "block", marginBottom: 10 }}>
                Seller actions
              </span>
              <h3 className="serif" style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.12 }}>
                Run your market lane
              </h3>
              <p style={{ marginTop: 10, fontSize: 13, color: "var(--ink-4)", lineHeight: 1.72 }}>
                Keep your original seller flows easy to reach while the premium marketplace takes over the main experience.
              </p>
              <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                <ActionButton solid onClick={() => navigate("/marketplace/addproduct")}>List a product</ActionButton>
                <ActionButton onClick={() => navigate("/marketplace/mylistedproduct")}>My listed products</ActionButton>
                <ActionButton onClick={() => navigate("/marketplace/mysoldproduct")}>My sold products</ActionButton>
              </div>
            </Card>

            <Card style={{ padding: 24 }}>
              <span className="label" style={{ display: "block", marginBottom: 10 }}>
                Categories
              </span>
              <h3 className="serif" style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.12 }}>
                Browse with intent
              </h3>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                {["All", ...categories].map((category) => {
                  const active = category === activeCategory;
                  return (
                    <motion.button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      whileHover={{ x: 2 }}
                      style={{
                        textAlign: "left",
                        cursor: "pointer",
                        padding: "12px 14px",
                        borderRadius: 14,
                        background: active ? "var(--gold-dim)" : "var(--cream-dim)",
                        border: `1px solid ${active ? "var(--gold-border)" : "var(--border)"}`,
                        color: active ? "var(--gold)" : "var(--ink-3)",
                        fontSize: 13,
                        fontWeight: active ? 600 : 500,
                      }}
                    >
                      {category}
                    </motion.button>
                  );
                })}
              </div>
            </Card>

            <Card style={{ padding: 24 }}>
              <span className="label" style={{ display: "block", marginBottom: 10 }}>
                Curated collections
              </span>
              <h3 className="serif" style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.12 }}>
                Premium marketplace energy
              </h3>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                {spotlightCollections.map((item) => (
                  <SellerSpotlightCard key={item.title} {...item} />
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="mp-column"
          >
            <Card style={{ padding: 24 }}>
              <div className="mp-feature-grid">
                <div>
                  <span className="label" style={{ display: "block", marginBottom: 10 }}>
                    Featured marketplace
                  </span>
                  <h2 className="serif" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 400, lineHeight: 1.02 }}>
                    Discover high-signal digital products from ambitious builders.
                  </h2>
                  <p style={{ marginTop: 14, maxWidth: 640, fontSize: 14, color: "var(--ink-4)", lineHeight: 1.8 }}>
                    This module is designed to feel like a serious marketplace, not a dump of cards. Search fast, browse curated collections, and explore products that help people get hired, build, ship, and sell.
                  </p>
                  <div style={{ marginTop: 18, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Pill variant="gold">Curated storefront</Pill>
                    <Pill variant="green">Student-friendly pricing</Pill>
                    <Pill>Frontend-only for now</Pill>
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: 20,
                    background: "linear-gradient(135deg, rgba(201,168,76,.18), rgba(45,106,79,.08), rgba(245,240,232,.78))",
                    border: "1px solid var(--border)",
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 220,
                  }}
                >
                  <div>
                    <div className="label" style={{ marginBottom: 8 }}>
                      Marketplace signal
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-2)", lineHeight: 1.45 }}>
                      Premium discovery, strong seller positioning, and a cleaner buying journey than most student marketplaces.
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      ["Top-rated", "4.8+"],
                      ["Price band", "$11-$29"],
                      ["Collections", "3"],
                      ["Ready flow", "Frontend"],
                    ].map(([label, value]) => (
                      <div key={label} style={{ padding: "11px 12px", borderRadius: 14, background: "rgba(255,255,255,.58)", border: "1px solid rgba(15,14,12,.08)" }}>
                        <div className="label" style={{ marginBottom: 4 }}>{label}</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: "var(--ink-2)" }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <span className="label" style={{ display: "block", marginBottom: 6 }}>
                    Search and discovery
                  </span>
                  <h3 className="serif" style={{ fontSize: 24, fontWeight: 400 }}>Find the right product faster</h3>
                </div>
                <div style={{ minWidth: "min(100%, 360px)", flex: "1 1 360px" }}>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search products, sellers, or categories..."
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: 14,
                      border: "1px solid var(--border)",
                      background: "#fff",
                      boxShadow: "var(--shadow-sm)",
                      color: "var(--ink-2)",
                    }}
                  />
                </div>
              </div>
            </Card>

            <div className="mp-products">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onComingSoon={openComingSoon} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <Card style={{ padding: 28, textAlign: "center" }}>
                <span className="label" style={{ display: "block", marginBottom: 10 }}>
                  No results
                </span>
                <h3 className="serif" style={{ fontSize: 28, fontWeight: 400 }}>Nothing matched that search.</h3>
                <p style={{ marginTop: 10, fontSize: 13.5, color: "var(--ink-4)", lineHeight: 1.7 }}>
                  Try another keyword or switch categories to explore more products.
                </p>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      <MarketplaceModal
        open={modalState.open}
        title={modalState.title}
        body={modalState.body}
        onClose={() => setModalState({ open: false, title: "", body: "" })}
      />
    </div>
  );
}
