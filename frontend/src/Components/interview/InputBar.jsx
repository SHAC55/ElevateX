import { useState } from "react";

export default function InputBar({ input, setInput, onSend }) {
  const [focused, setFocused] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div
      style={{
        padding: "14px 16px",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(0,0,0,0.2)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "6px 6px 6px 16px",
          borderRadius: 14,
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${focused ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)"}`,
          boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Type your answer."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.6,
            letterSpacing: "0.01em",
            caretColor: "#6366f1",
            padding: "6px 0",
          }}
        />

        {/* Send button */}
        <button
          onClick={onSend}
          disabled={!input.trim()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            border: "none",
            background: input.trim()
              ? "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)"
              : "rgba(255,255,255,0.06)",
            cursor: input.trim() ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s ease",
            boxShadow: input.trim() ? "0 4px 12px rgba(79,70,229,0.4)" : "none",
          }}
          onMouseEnter={(e) => {
            if (input.trim()) e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
              stroke={input.trim() ? "#fff" : "rgba(255,255,255,0.25)"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.68rem",
          color: "rgba(255,255,255,0.2)",
          textAlign: "center",
          marginTop: 8,
          letterSpacing: "0.03em",
        }}
      >
        Press Enter to send
      </p>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        input::placeholder { color: rgba(255,255,255,0.22); }
      `}</style>
    </div>
  );
}
