export default function FeedbackPanel({ feedback, onNext }) {
  // Safely extract fields - the API may return different shapes
  const score = typeof feedback?.score === "number" ? feedback.score : null;
  const nextFocus = feedback?.nextFocus || feedback?.improvement || null;
  const dimensions = feedback?.dimensions ?? {};

  // Also surface strengths/weaknesses arrays if present (common API shape)
  const strengths = Array.isArray(feedback?.strengths)
    ? feedback.strengths
    : [];
  const weaknesses = Array.isArray(feedback?.weaknesses)
    ? feedback.weaknesses
    : [];

  const scoreColor =
    score === null
      ? "#6366f1"
      : score >= 8
        ? "#22c55e"
        : score >= 5
          ? "#f59e0b"
          : "#ef4444";

  const dimensionEntries = Object.entries(dimensions);

  return (
    <div
      style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(0,0,0,0.25)",
        backdropFilter: "blur(20px)",
        padding: "18px 20px 20px",
        flexShrink: 0,
        overflowY: "auto",
        maxHeight: "45vh",
        animation: "iv-up 0.35s cubic-bezier(0.34,1.2,0.64,1) both",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');
        @keyframes iv-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Score row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
          <span
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "2rem",
              color: scoreColor,
              lineHeight: 1,
              filter: `drop-shadow(0 0 12px ${scoreColor}66)`,
            }}
          >
            {score !== null ? score : "-"}
          </span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem",
              color: "rgba(255,255,255,0.3)",
              fontWeight: 500,
            }}
          >
            / 10
          </span>
        </div>

        {score !== null && (
          <div
            style={{
              width: 130,
              height: 5,
              borderRadius: 100,
              background: "rgba(255,255,255,0.07)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${score * 10}%`,
                borderRadius: 100,
                background: `linear-gradient(90deg, ${scoreColor}99, ${scoreColor})`,
                boxShadow: `0 0 10px ${scoreColor}66`,
                transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </div>
        )}
      </div>

      {/* Dimension rows */}
      {dimensionEntries.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 7,
            marginBottom: 12,
          }}
        >
          {dimensionEntries.map(([key, val]) => (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.7rem",
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {key}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.72)",
                  fontWeight: 500,
                  textAlign: "right",
                }}
              >
                {typeof val === "object" ? JSON.stringify(val) : val}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Strengths */}
      {strengths.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {strengths.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  color: "#22c55e",
                  fontSize: "0.75rem",
                  marginTop: 1,
                  flexShrink: 0,
                }}
              >
                �
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.5,
                }}
              >
                {s}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Weaknesses */}
      {weaknesses.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {weaknesses.map((w, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  color: "#f59e0b",
                  fontSize: "0.75rem",
                  marginTop: 1,
                  flexShrink: 0,
                }}
              >
                !
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.5,
                }}
              >
                {w}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Next focus */}
      {nextFocus && (
        <div
          style={{
            padding: "10px 13px",
            borderRadius: 10,
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.2)",
            marginBottom: 14,
            display: "flex",
            gap: 9,
            alignItems: "flex-start",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            style={{ flexShrink: 0, marginTop: 2 }}
          >
            <path
              d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
              stroke="#818cf8"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem",
              color: "rgba(255,255,255,0.58)",
              margin: 0,
              lineHeight: 1.55,
            }}
          >
            <span style={{ color: "#818cf8", fontWeight: 600 }}>
              Focus next:{" "}
            </span>
            {nextFocus}
          </p>
        </div>
      )}

      {/* Next question button */}
      <button
        onClick={onNext}
        style={{
          width: "100%",
          padding: "11px 0",
          borderRadius: 11,
          border: "none",
          background: "linear-gradient(135deg, #4f46e5, #6366f1)",
          color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          boxShadow:
            "0 4px 20px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow =
            "0 8px 28px rgba(79,70,229,0.5), inset 0 1px 0 rgba(255,255,255,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 4px 20px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.15)";
        }}
      >
        Next Question
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
