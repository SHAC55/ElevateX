import MessageBubble from "./MessageBubble";
import StreamingBubble from "./StreamingBubble";

export default function ChatWindow({
  messages,
  streamingText,
  loading,
  bottomRef,
}) {
  return (
    <div
      className="flex-1 overflow-y-auto px-6 py-6"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.08) transparent",
      }}
    >
      {/* Empty state */}
      {messages.length === 0 && !loading && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            padding: "48px 24px",
            opacity: 0.6,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 32px rgba(99,102,241,0.3)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 5v5l3 3"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
            }}
          >
            Your interview session will begin here.
          </p>
        </div>
      )}

      {/* Messages */}
      {messages.map((msg, i) => (
        <MessageBubble key={i} {...msg} />
      ))}

      {/* Streaming */}
      <StreamingBubble text={streamingText} />

      {/* Thinking indicator */}
      {loading && !streamingText && (
        <div
          className="flex items-end gap-3"
          style={{ animation: "fadeSlideIn 0.25s ease both" }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              boxShadow: "0 0 0 1px rgba(99,102,241,0.4)",
            }}
          >
            AI
          </div>
          <div
            style={{
              padding: "12px 18px",
              borderRadius: "18px 18px 18px 4px",
              background: "rgba(255,255,255,0.045)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "rgba(99,102,241,0.7)",
                  display: "inline-block",
                  animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} />

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
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}
