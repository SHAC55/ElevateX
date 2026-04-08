import React from "react";
import { Link } from "react-router-dom";

const ProductHeader = ({
  eyebrow,
  title,
  description,
  stats = [],
  actions = [],
  theme = "dark",
  className = "",
}) => {
  const themes = {
    dark: {
      wrapper:
        "border-[#ead8c0] bg-[#1b140f] text-white shadow-[0_30px_90px_rgba(61,36,10,0.24)]",
      badge: "border-[#fdba74] bg-[#fff1dc] text-[#7c2d12]",
      text: "text-[#efe4d7]",
      subtle: "text-[#f5dec5]",
      card: "border-white/10 bg-white/5",
      primary: "bg-white text-[#1b140f]",
      secondary: "border border-white/15 bg-white/5 text-white",
    },
    light: {
      wrapper:
        "border-[#eadfce] bg-[linear-gradient(135deg,#fffaf4_0%,#f8eee0_100%)] text-[#1f160f] shadow-[0_24px_70px_rgba(89,60,27,0.08)]",
      badge: "border-[#e8c9a7] bg-white text-[#8a5a2b]",
      text: "text-[#6b5844]",
      subtle: "text-[#8e775c]",
      card: "border-[#eadfce] bg-white/75",
      primary: "bg-[#1f160f] text-white",
      secondary: "border border-[#eadfce] bg-white text-[#1f160f]",
    },
  };

  const palette = themes[theme] || themes.dark;

  return (
    <section
      className={`overflow-hidden rounded-[38px] border px-6 py-7 lg:px-8 lg:py-8 ${palette.wrapper} ${className}`.trim()}
    >
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          {eyebrow ? (
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] ${palette.badge}`}
            >
              {eyebrow}
            </div>
          ) : null}

          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>

          {description ? (
            <p className={`mt-4 max-w-2xl text-sm leading-7 sm:text-base ${palette.text}`}>
              {description}
            </p>
          ) : null}

          {actions.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {actions.map((action) => {
                const classes = `inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                  action.variant === "secondary" ? palette.secondary : palette.primary
                }`;

                if (action.to) {
                  return (
                    <Link key={action.label} to={action.to} className={classes}>
                      {action.icon}
                      {action.label}
                    </Link>
                  );
                }

                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={action.onClick}
                    className={classes}
                    disabled={action.disabled}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {stats.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-[24px] border p-5 ${palette.card}`}
              >
                <div className={`text-[11px] uppercase tracking-[0.24em] ${palette.subtle}`}>
                  {stat.label}
                </div>
                <div className="mt-3 text-3xl font-semibold">{stat.value}</div>
                {stat.detail ? (
                  <div className={`mt-2 text-sm ${palette.text}`}>{stat.detail}</div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ProductHeader;
