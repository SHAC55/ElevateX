export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div
      className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      style={{ animation: "bubbleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both" }}
    >
      {/* Avatar */}
      {!isUser && (
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
      )}

      {/* Bubble */}
      <div
        style={{
          maxWidth: "72%",
          padding: "11px 16px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser
            ? "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)"
            : "rgba(255,255,255,0.045)",
          border: isUser
            ? "1px solid rgba(99,102,241,0.5)"
            : "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          boxShadow: isUser
            ? "0 4px 24px rgba(79,70,229,0.35), inset 0 1px 0 rgba(255,255,255,0.15)"
            : "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.875rem",
          lineHeight: 1.65,
          color: isUser ? "#fff" : "rgba(255,255,255,0.88)",
          letterSpacing: "0.01em",
          wordBreak: "break-word",
          position: "relative",
        }}
      >
        {content}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
