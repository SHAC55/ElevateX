import React from "react";
import { FolderKanban, Plus, Sparkles, Trophy } from "lucide-react";
import ProductHeader from "../Components/ui/ProductHeader";

const portfolioSections = [
  {
    title: "Proof assets",
    description: "Case studies, project walkthroughs, and links that support your applications.",
    value: "Build evidence",
  },
  {
    title: "Story quality",
    description: "Turn raw work into clear impact, process, and outcomes.",
    value: "Sharpen narrative",
  },
  {
    title: "Presentation",
    description: "Make your strongest work easy to scan and hard to forget.",
    value: "Improve layout",
  },
];

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.1),_transparent_20%),linear-gradient(180deg,_#fffaf2_0%,_#f3e7d2_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <ProductHeader
          eyebrow={
            <>
              <FolderKanban size={14} />
              Portfolio
            </>
          }
          title="Turn your work into proof that helps opportunities move."
          description="Use this space to shape case studies, highlight wins, and make your strongest projects easy to understand."
          stats={[
            {
              label: "Focus",
              value: "Proof",
              detail: "Show what you built, why it mattered, and what changed.",
            },
            {
              label: "Best Use",
              value: "Applications",
              detail: "Portfolio work should support resumes and interviews directly.",
            },
            {
              label: "Standard",
              value: "Clarity",
              detail: "Strong portfolios reduce explanation cost for the viewer.",
            },
            {
              label: "Next",
              value: "Expansion",
              detail: "This workspace is ready for richer portfolio tooling.",
            },
          ]}
          actions={[
            {
              label: "Add proof",
              onClick: () => window.location.assign("/home#pipeline"),
              icon: <Plus size={16} />,
            },
            {
              label: "Open dashboard",
              to: "/home",
              icon: <Sparkles size={16} />,
              variant: "secondary",
            },
          ]}
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {portfolioSections.map((item) => (
            <div
              key={item.title}
              className="rounded-[30px] border border-[#eadfce] bg-white/92 p-6 shadow-[0_24px_70px_rgba(89,60,27,0.08)]"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1f160f] text-white">
                <Trophy size={18} />
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-[#1f160f]">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#6b5844]">{item.description}</p>
              <div className="mt-4 inline-flex rounded-full bg-[#fff1dc] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#9a5313]">
                {item.value}
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-[34px] border border-[#eadfce] bg-white/92 p-6 shadow-[0_24px_70px_rgba(89,60,27,0.08)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8e775c]">
            Workspace direction
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-[#1f160f]">Portfolio is the next surface to deepen.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6b5844]">
            The shared header system is now in place here. The next logical step is turning this
            page into a full portfolio builder with asset management, case study editing, and
            application linking, using the same product shell as the rest of the app.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Portfolio;
