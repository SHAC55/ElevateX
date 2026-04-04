export default function StreamingBubble({ text }) {
  if (!text) return null;

  return (
    <div
      className="flex items-end gap-3"
      style={{ animation: "fadeSlideIn 0.25s ease both" }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 11,
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "0.05em",
          boxShadow:
            "0 0 0 1px rgba(99,102,241,0.4), 0 4px 12px rgba(99,102,241,0.3)",
        }}
      >
        AI
      </div>

      {/* Bubble */}
      <div
        style={{
          maxWidth: "72%",
          padding: "11px 16px",
          borderRadius: "18px 18px 18px 4px",
          background: "rgba(255,255,255,0.045)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          boxShadow:
            "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.875rem",
          lineHeight: 1.65,
          color: "rgba(255,255,255,0.88)",
          letterSpacing: "0.01em",
          display: "flex",
          alignItems: "flex-end",
          gap: 6,
          wordBreak: "break-word",
        }}
      >
        <span>{text}</span>
        {/* Animated cursor */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            flexShrink: 0,
            marginBottom: 2,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#6366f1",
                display: "inline-block",
                animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </span>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
