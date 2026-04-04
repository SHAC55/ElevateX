export default function HeaderBar() {
  return (
    <div
      style={{
        padding: "0 24px",
        height: 62,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(20px)",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Left - brand + status */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Logo mark */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 0 0 1px rgba(99,102,241,0.5), 0 4px 16px rgba(79,70,229,0.4)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3L4 7v10l8 4 8-4V7l-8-4z"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M12 3v18M4 7l8 4 8-4"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div>
          <h1
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "-0.01em",
              margin: 0,
              lineHeight: 1,
            }}
          >
            AI Interview
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.35)",
              margin: 0,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            Live Session
          </p>
        </div>
      </div>

      {/* Right - live indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "5px 12px",
          borderRadius: 100,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#22c55e",
            display: "inline-block",
            boxShadow: "0 0 8px rgba(34,197,94,0.7)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.72rem",
            fontWeight: 500,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Active
        </span>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px rgba(34,197,94,0.7); }
          50%       { opacity: 0.6; box-shadow: 0 0 12px rgba(34,197,94,0.9); }
        }
      `}</style>
    </div>
  );
}
