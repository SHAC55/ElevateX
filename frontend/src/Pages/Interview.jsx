import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  startInterviewSession,
  sendInterviewMessage,
  evaluateInterview,
} from "../api/interviewSession";

const parseFeedback = (raw) => {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  try {
    const cleaned = raw.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { score: null, nextFocus: raw, dimensions: {} };
  }
};

// ÄÄ Ambient background orbs ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ
function AmbientOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div style={{
        position: "absolute", top: -180, left: -120,
        width: 560, height: 560, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(163,230,53,0.13) 0%, transparent 70%)",
        filter: "blur(40px)",
      }}/>
      <div style={{
        position: "absolute", bottom: -200, right: -100,
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 70%)",
        filter: "blur(50px)",
      }}/>
      <div style={{
        position: "absolute", top: "30%", left: "50%",
        transform: "translateX(-50%)",
        width: 700, height: 300, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(232,255,71,0.04) 0%, transparent 70%)",
        filter: "blur(60px)",
      }}/>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.025 }}>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)"/>
      </svg>
    </div>
  );
}

// ÄÄ Interview header bar ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ
function InterviewHeader({ questionCount, phase }) {
  const progress = Math.min(questionCount * 12.5, 100);
  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", height: 56, flexShrink: 0,
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(8,8,14,0.85)", backdropFilter: "blur(24px)",
      position: "relative", zIndex: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: "linear-gradient(135deg, #e8ff47 0%, #a3e635 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 14px rgba(232,255,71,0.4)",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#0a0a0f" strokeWidth="2.2" strokeLinejoin="round"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={{
          fontFamily: "'Syne', sans-serif", fontSize: "0.85rem",
          fontWeight: 700, color: "rgba(255,255,255,0.8)",
        }}>
          AI Interview{" "}
          <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400 }}>ú Live</span>
        </span>
      </div>

      {phase !== "idle" && (
        <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, maxWidth: 320, margin: "0 32px" }}>
          <div style={{ flex: 1, height: 3, borderRadius: 100, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: "100%", borderRadius: 100,
                background: "linear-gradient(90deg, #e8ff47, #a3e635)",
                boxShadow: "0 0 10px rgba(232,255,71,0.5)",
              }}
            />
          </div>
          <span style={{
            fontFamily: "'Syne', sans-serif", fontSize: "0.68rem",
            color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap",
          }}>{questionCount} / 8</span>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <motion.span
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 6, height: 6, borderRadius: "50%", background: "#a3e635",
            display: "inline-block", boxShadow: "0 0 8px rgba(163,230,53,0.8)",
          }}
        />
        <span style={{
          fontFamily: "'Syne', sans-serif", fontSize: "0.68rem",
          color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em", textTransform: "uppercase",
        }}>Active</span>
      </div>
    </header>
  );
}

// ÄÄ Idle / start screen ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ
function IdleScreen({ onStart, loading }) {
  const stats = [
    { n: "~8", l: "Questions" },
    { n: "20m", l: "Avg length" },
    { n: "AI", l: "Feedback" },
  ];

  return (
    <motion.div
      key="idle"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.97 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 28, padding: "32px 24px", minHeight: 0,
      }}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          width: 80, height: 80, borderRadius: 22,
          background: "linear-gradient(135deg, #e8ff47 0%, #a3e635 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 0 1px rgba(232,255,71,0.4), 0 8px 48px rgba(232,255,71,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#0a0a0f" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.5 }}
        style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 10 }}
      >
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(2rem, 4vw, 2.8rem)",
          fontWeight: 800, color: "#fff",
          letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0,
        }}>
          Ready to{" "}
          <span style={{
            background: "linear-gradient(135deg, #e8ff47, #a3e635)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>impress?</span>
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem",
          color: "rgba(255,255,255,0.38)", lineHeight: 1.65,
          maxWidth: 320, margin: "0 auto",
        }}>
          AI-powered mock interviews with real-time, brutally honest feedback on every answer.
        </p>
      </motion.div>

      {/* Tags */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.26 }}
        style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}
      >
        {[
          { label: "Frontend Engineer", color: "rgba(232,255,71,0.1)", border: "rgba(232,255,71,0.28)", text: "#d4f542" },
          { label: "Normal Mode", color: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.28)", text: "#c4b5fd" },
        ].map(({ label, color, border, text }) => (
          <span key={label} style={{
            padding: "5px 14px", borderRadius: 100,
            background: color, border: `1px solid ${border}`,
            fontFamily: "'Syne', sans-serif", fontSize: "0.68rem",
            fontWeight: 600, letterSpacing: "0.06em",
            textTransform: "uppercase", color: text,
          }}>{label}</span>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34, duration: 0.5 }}
      >
        <motion.button
          onClick={onStart}
          disabled={loading}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{
            padding: "15px 52px", borderRadius: 16, border: "none",
            background: loading
              ? "rgba(255,255,255,0.07)"
              : "linear-gradient(135deg, #e8ff47 0%, #a3e635 100%)",
            color: loading ? "rgba(255,255,255,0.25)" : "#0a0a0f",
            fontFamily: "'Syne', sans-serif",
            fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.02em",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: loading
              ? "none"
              : "0 4px 32px rgba(232,255,71,0.45), 0 0 0 1px rgba(232,255,71,0.3), inset 0 1px 0 rgba(255,255,255,0.4)",
          }}
        >
          {loading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{
                  width: 16, height: 16, borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.12)",
                  borderTopColor: "rgba(255,255,255,0.4)",
                  display: "inline-block",
                }}
              />
              Starting session.
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polygon points="5,3 19,12 5,21" fill="#0a0a0f"/>
              </svg>
              Begin Session
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.44 }}
        style={{ display: "flex", gap: 32, alignItems: "center" }}
      >
        {stats.map(({ n, l }, i) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontSize: "1.4rem",
                fontWeight: 800, color: "rgba(255,255,255,0.85)", lineHeight: 1,
              }}>{n}</div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem",
                color: "rgba(255,255,255,0.25)", textTransform: "uppercase",
                letterSpacing: "0.08em", marginTop: 4,
              }}>{l}</div>
            </div>
            {i < stats.length - 1 && (
              <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.07)" }}/>
            )}
          </div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem",
          color: "rgba(255,255,255,0.15)", textAlign: "center", maxWidth: 280,
        }}
      >
        Powered by GPT-4 ú Responses are private ú No data stored
      </motion.p>
    </motion.div>
  );
}

// ÄÄ Single message bubble ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ
function Bubble({ role, content, index }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: Math.min(index * 0.04, 0.3) }}
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-end", gap: 10,
      }}
    >
      {!isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #e8ff47, #a3e635)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 0 1px rgba(232,255,71,0.3), 0 4px 16px rgba(232,255,71,0.2)",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#0a0a0f" strokeWidth="2.2" strokeLinejoin="round"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      <div style={{
        maxWidth: "70%", padding: "12px 18px",
        borderRadius: isUser ? "20px 20px 5px 20px" : "20px 20px 20px 5px",
        background: isUser
          ? "linear-gradient(135deg, #e8ff47 0%, #a3e635 100%)"
          : "rgba(255,255,255,0.055)",
        border: isUser
          ? "1px solid rgba(232,255,71,0.4)"
          : "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(16px)",
        boxShadow: isUser
          ? "0 4px 24px rgba(232,255,71,0.18), inset 0 1px 0 rgba(255,255,255,0.35)"
          : "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
        fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem",
        lineHeight: 1.7, color: isUser ? "#0a0a0f" : "rgba(255,255,255,0.88)",
        fontWeight: isUser ? 500 : 400, wordBreak: "break-word",
      }}>
        {content}
      </div>
    </motion.div>
  );
}

// ÄÄ Streaming bubble ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ
function StreamingBubble({ text }) {
  if (!text) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: "flex", alignItems: "flex-end", gap: 10 }}
    >
      <div style={{
        width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg, #e8ff47, #a3e635)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 0 1px rgba(232,255,71,0.3)",
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#0a0a0f" strokeWidth="2.2" strokeLinejoin="round"/>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{
        maxWidth: "70%", padding: "12px 18px",
        borderRadius: "20px 20px 20px 5px",
        background: "rgba(255,255,255,0.055)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(16px)",
        fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem",
        lineHeight: 1.7, color: "rgba(255,255,255,0.88)",
        display: "flex", alignItems: "flex-end", gap: 8, wordBreak: "break-word",
      }}>
        <span>{text}</span>
        <span style={{ display: "flex", gap: 3, flexShrink: 0, marginBottom: 2 }}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
              style={{ width: 4, height: 4, borderRadius: "50%", background: "#a3e635", display: "inline-block" }}
            />
          ))}
        </span>
      </div>
    </motion.div>
  );
}

// ÄÄ Thinking dots ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ
function ThinkingDots() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{ display: "flex", alignItems: "flex-end", gap: 10 }}
    >
      <div style={{
        width: 30, height: 30, borderRadius: "50%",
        background: "linear-gradient(135deg, #e8ff47, #a3e635)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#0a0a0f" strokeWidth="2.2" strokeLinejoin="round"/>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{
        padding: "14px 18px", borderRadius: "20px 20px 20px 5px",
        background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.07)",
        display: "flex", gap: 5, alignItems: "center",
      }}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
            style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.45)", display: "inline-block" }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ÄÄ Chat area ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ
function ChatArea({ messages, streamingText, loading, bottomRef }) {
  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: "28px 32px",
      display: "flex", flexDirection: "column", gap: 14,
      minHeight: 0,
      scrollbarWidth: "thin",
      scrollbarColor: "rgba(255,255,255,0.06) transparent",
    }}>
      <AnimatePresence initial={false}>
        {messages.length === 0 && !loading && !streamingText && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 10, padding: "60px 0",
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                  stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem",
              color: "rgba(255,255,255,0.18)", textAlign: "center",
            }}>Your interview begins here</p>
          </motion.div>
        )}
      </AnimatePresence>

      {messages.map((msg, i) => (
        <Bubble key={i} {...msg} index={i} />
      ))}

      <StreamingBubble text={streamingText} />

      <AnimatePresence>
        {loading && !streamingText && <ThinkingDots key="thinking" />}
      </AnimatePresence>

      <div ref={bottomRef} />
    </div>
  );
}

// ÄÄ Input area ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ
function InputArea({ input, setInput, onSend }) {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 120) + "px"; }
  }, [input]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      style={{
        padding: "16px 24px 20px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,8,14,0.75)",
        backdropFilter: "blur(24px)",
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{
          borderColor: focused ? "rgba(232,255,71,0.4)" : "rgba(255,255,255,0.08)",
          boxShadow: focused ? "0 0 0 3px rgba(232,255,71,0.07)" : "none",
        }}
        transition={{ duration: 0.2 }}
        style={{
          display: "flex", alignItems: "flex-end", gap: 12,
          padding: "12px 12px 12px 20px",
          borderRadius: 18, background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Type your answer. (Enter to send)"
          rows={1}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem",
            color: "rgba(255,255,255,0.88)", lineHeight: 1.65,
            caretColor: "#e8ff47", resize: "none", overflow: "hidden",
          }}
        />
        <motion.button
          onClick={onSend}
          disabled={!input.trim()}
          whileHover={input.trim() ? { scale: 1.07 } : {}}
          whileTap={input.trim() ? { scale: 0.93 } : {}}
          style={{
            width: 42, height: 42, borderRadius: 12, border: "none", flexShrink: 0,
            background: input.trim()
              ? "linear-gradient(135deg, #e8ff47 0%, #a3e635 100%)"
              : "rgba(255,255,255,0.06)",
            cursor: input.trim() ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: input.trim() ? "0 4px 16px rgba(232,255,71,0.35)" : "none",
            transition: "background 0.2s, box-shadow 0.2s",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
              stroke={input.trim() ? "#0a0a0f" : "rgba(255,255,255,0.2)"}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </motion.div>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: "0.67rem",
        color: "rgba(255,255,255,0.14)", textAlign: "center", marginTop: 8,
      }}>
        Enter to send ú Shift+Enter for newline
      </p>
    </motion.div>
  );
}

// ÄÄ Evaluating bar ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ
function EvaluatingBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        padding: "14px 28px", borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,8,14,0.7)", backdropFilter: "blur(16px)",
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
        style={{
          width: 14, height: 14, borderRadius: "50%",
          border: "2px solid rgba(232,255,71,0.15)",
          borderTopColor: "#e8ff47", flexShrink: 0,
        }}
      />
      <span style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem",
        color: "rgba(255,255,255,0.28)", letterSpacing: "0.02em",
      }}>
        Evaluating your answer.
      </span>
    </motion.div>
  );
}

// ÄÄ Feedback panel ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ
function FeedbackArea({ feedback, onNext }) {
  const score = typeof feedback?.score === "number" ? feedback.score : null;
  const nextFocus = feedback?.nextFocus || feedback?.improvement || null;
  const strengths = Array.isArray(feedback?.strengths) ? feedback.strengths : [];
  const weaknesses = Array.isArray(feedback?.weaknesses) ? feedback.weaknesses : [];
  const scoreColor = score === null ? "#a3e635" : score >= 8 ? "#a3e635" : score >= 5 ? "#f59e0b" : "#ef4444";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(8,8,14,0.88)",
        backdropFilter: "blur(28px)",
        padding: "20px 28px 24px",
        flexShrink: 0, overflowY: "auto", maxHeight: "46vh",
        scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent",
      }}
    >
      {/* Score row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{
            fontFamily: "'Syne', sans-serif", fontSize: "2.6rem",
            fontWeight: 800, color: scoreColor, lineHeight: 1,
            filter: `drop-shadow(0 0 16px ${scoreColor}80)`,
          }}>
            {score !== null ? score : "-"}
          </span>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem",
            color: "rgba(255,255,255,0.22)", fontWeight: 500,
          }}>/ 10</span>
        </div>

        {score !== null && (
          <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
            <span style={{
              fontFamily: "'Syne', sans-serif", fontSize: "0.62rem",
              color: "rgba(255,255,255,0.22)", textTransform: "uppercase", letterSpacing: "0.08em",
            }}>Answer Score</span>
            <div style={{ width: 160, height: 4, borderRadius: 100, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score * 10}%` }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: "100%", borderRadius: 100,
                  background: `linear-gradient(90deg, ${scoreColor}70, ${scoreColor})`,
                  boxShadow: `0 0 10px ${scoreColor}55`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Strengths + Weaknesses */}
      {(strengths.length > 0 || weaknesses.length > 0) && (
        <div style={{
          display: "grid",
          gridTemplateColumns: strengths.length && weaknesses.length ? "1fr 1fr" : "1fr",
          gap: 12, marginBottom: 14,
        }}>
          {strengths.length > 0 && (
            <div style={{
              padding: "14px 16px", borderRadius: 14,
              background: "rgba(163,230,53,0.06)", border: "1px solid rgba(163,230,53,0.14)",
            }}>
              <p style={{
                fontFamily: "'Syne', sans-serif", fontSize: "0.62rem",
                color: "#a3e635", textTransform: "uppercase", letterSpacing: "0.08em",
                fontWeight: 700, marginBottom: 8, margin: "0 0 8px",
              }}>Strengths</p>
              {strengths.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                  <span style={{ color: "#a3e635", fontSize: "0.72rem", marginTop: 2, flexShrink: 0 }}>û</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          )}
          {weaknesses.length > 0 && (
            <div style={{
              padding: "14px 16px", borderRadius: 14,
              background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.14)",
            }}>
              <p style={{
                fontFamily: "'Syne', sans-serif", fontSize: "0.62rem",
                color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.08em",
                fontWeight: 700, margin: "0 0 8px",
              }}>To Improve</p>
              {weaknesses.map((w, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                  <span style={{ color: "#f59e0b", fontSize: "0.75rem", marginTop: 2, flexShrink: 0 }}>?</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.5 }}>{w}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Next focus */}
      {nextFocus && (
        <div style={{
          padding: "12px 16px", borderRadius: 12, marginBottom: 16,
          background: "rgba(232,255,71,0.05)", border: "1px solid rgba(232,255,71,0.14)",
          display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#e8ff47" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.52)", margin: 0, lineHeight: 1.55 }}>
            <span style={{ color: "#e8ff47", fontWeight: 600 }}>Focus next: </span>{nextFocus}
          </p>
        </div>
      )}

      {/* Next question button */}
      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: "100%", padding: "13px 0", borderRadius: 14, border: "none",
          background: "linear-gradient(135deg, #e8ff47 0%, #a3e635 100%)",
          color: "#0a0a0f", fontFamily: "'Syne', sans-serif",
          fontSize: "0.88rem", fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: "0 4px 24px rgba(232,255,71,0.32), inset 0 1px 0 rgba(255,255,255,0.3)",
          letterSpacing: "0.01em",
        }}
      >
        Next Question
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="#0a0a0f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>
    </motion.div>
  );
}

// ÄÄ Root ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ
export default function InterviewPage() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [streamingText, setStreamingText] = useState("");
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const streamText = async (text) => {
    let i = 0;
    setStreamingText("");
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        i += 2;
        setStreamingText(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); resolve(); }
      }, 10);
    });
  };

  const startInterview = async () => {
    setLoading(true);
    const res = await startInterviewSession({ role: "frontend", mode: "normal" });
    setSessionId(res.sessionId);
    setPhase("chat");
    await askAI(res.sessionId, "Start interview. Ask first question.");
  };

  const askAI = async (id, message) => {
    setLoading(true);
    const res = await sendInterviewMessage(id, message);
    await streamText(res.response);
    setMessages((prev) => [...prev, { role: "assistant", content: res.response }]);
    setStreamingText("");
    setLoading(false);
  };

  const sendAnswer = async () => {
    if (!input.trim() || loading) return;
    const answer = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: answer }]);
    setInput("");
    setPhase("feedback");
    setLoading(true);
    const lastQuestion = [...messages].reverse().find((m) => m.role === "assistant")?.content;
    const raw = await evaluateInterview(sessionId, lastQuestion, answer);
    const parsed = parseFeedback(raw);
    setFeedback(parsed);
    setQuestionCount((n) => n + 1);
    setLoading(false);
  };

  const nextQuestion = async () => {
    setFeedback(null);
    setPhase("chat");
    await askAI(sessionId, "Ask next question.");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
        textarea::placeholder { color: rgba(255,255,255,0.18) !important; }
        .iv-scroll::-webkit-scrollbar { width: 3px; }
        .iv-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 3px; }
        .iv-scroll::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      <div style={{
        height: "100%", display: "flex", flexDirection: "column",
        background: "#08080e", color: "#fff",
        position: "relative", overflow: "hidden", minHeight: 0,
      }}>
        <AmbientOrbs />

        <InterviewHeader questionCount={questionCount} phase={phase} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, position: "relative", zIndex: 1 }}>
          <AnimatePresence mode="wait">
            {phase === "idle" ? (
              <IdleScreen key="idle" onStart={startInterview} loading={loading} />
            ) : (
              <motion.div
                key="session"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
              >
                <ChatArea
                  messages={messages}
                  streamingText={streamingText}
                  loading={loading && phase === "chat"}
                  bottomRef={bottomRef}
                />

                <AnimatePresence mode="wait">
                  {phase === "chat" && !loading && (
                    <InputArea key="input" input={input} setInput={setInput} onSend={sendAnswer} />
                  )}
                  {phase === "feedback" && loading && !feedback && (
                    <EvaluatingBar key="evaluating" />
                  )}
                  {phase === "feedback" && !loading && feedback && (
                    <FeedbackArea key="feedback" feedback={feedback} onNext={nextQuestion} />
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
