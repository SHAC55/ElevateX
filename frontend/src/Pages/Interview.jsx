// import { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   startInterviewSession,
//   sendInterviewMessage,
//   evaluateInterview,
// } from "../api/interviewSession";

// const parseFeedback = (raw) => {
//   if (!raw) return null;
//   if (typeof raw === "object") return raw;
//   try {
//     const cleaned = raw.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
//     return JSON.parse(cleaned);
//   } catch {
//     return { score: null, nextFocus: raw, dimensions: {} };
//   }
// };

// // �� Ambient background orbs ���������������������������������������������������
// function AmbientOrbs() {
//   return (
//     <div className="pointer-events-none absolute inset-0 overflow-hidden">
//       <div style={{
//         position: "absolute", top: -180, left: -120,
//         width: 560, height: 560, borderRadius: "50%",
//         background: "radial-gradient(circle, rgba(163,230,53,0.13) 0%, transparent 70%)",
//         filter: "blur(40px)",
//       }}/>
//       <div style={{
//         position: "absolute", bottom: -200, right: -100,
//         width: 500, height: 500, borderRadius: "50%",
//         background: "radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 70%)",
//         filter: "blur(50px)",
//       }}/>
//       <div style={{
//         position: "absolute", top: "30%", left: "50%",
//         transform: "translateX(-50%)",
//         width: 700, height: 300, borderRadius: "50%",
//         background: "radial-gradient(ellipse, rgba(232,255,71,0.04) 0%, transparent 70%)",
//         filter: "blur(60px)",
//       }}/>
//       <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.025 }}>
//         <filter id="noise">
//           <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
//           <feColorMatrix type="saturate" values="0"/>
//         </filter>
//         <rect width="100%" height="100%" filter="url(#noise)"/>
//       </svg>
//     </div>
//   );
// }

// // �� Interview header bar ������������������������������������������������������
// function InterviewHeader({ questionCount, phase }) {
//   const progress = Math.min(questionCount * 12.5, 100);
//   return (
//     <header style={{
//       display: "flex", alignItems: "center", justifyContent: "space-between",
//       padding: "0 28px", height: 56, flexShrink: 0,
//       borderBottom: "1px solid rgba(255,255,255,0.06)",
//       background: "rgba(8,8,14,0.85)", backdropFilter: "blur(24px)",
//       position: "relative", zIndex: 10,
//     }}>
//       <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//         <div style={{
//           width: 28, height: 28, borderRadius: 7,
//           background: "linear-gradient(135deg, #e8ff47 0%, #a3e635 100%)",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           boxShadow: "0 0 14px rgba(232,255,71,0.4)",
//         }}>
//           <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
//             <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#0a0a0f" strokeWidth="2.2" strokeLinejoin="round"/>
//             <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//         </div>
//         <span style={{
//           fontFamily: "'Syne', sans-serif", fontSize: "0.85rem",
//           fontWeight: 700, color: "rgba(255,255,255,0.8)",
//         }}>
//           AI Interview{" "}
//           <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400 }}>� Live</span>
//         </span>
//       </div>

//       {phase !== "idle" && (
//         <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, maxWidth: 320, margin: "0 32px" }}>
//           <div style={{ flex: 1, height: 3, borderRadius: 100, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
//             <motion.div
//               animate={{ width: `${progress}%` }}
//               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
//               style={{
//                 height: "100%", borderRadius: 100,
//                 background: "linear-gradient(90deg, #e8ff47, #a3e635)",
//                 boxShadow: "0 0 10px rgba(232,255,71,0.5)",
//               }}
//             />
//           </div>
//           <span style={{
//             fontFamily: "'Syne', sans-serif", fontSize: "0.68rem",
//             color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap",
//           }}>{questionCount} / 8</span>
//         </div>
//       )}

//       <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//         <motion.span
//           animate={{ opacity: [1, 0.4, 1] }}
//           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//           style={{
//             width: 6, height: 6, borderRadius: "50%", background: "#a3e635",
//             display: "inline-block", boxShadow: "0 0 8px rgba(163,230,53,0.8)",
//           }}
//         />
//         <span style={{
//           fontFamily: "'Syne', sans-serif", fontSize: "0.68rem",
//           color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em", textTransform: "uppercase",
//         }}>Active</span>
//       </div>
//     </header>
//   );
// }

// // �� Idle / start screen �������������������������������������������������������
// function IdleScreen({ onStart, loading }) {
//   const stats = [
//     { n: "~8", l: "Questions" },
//     { n: "20m", l: "Avg length" },
//     { n: "AI", l: "Feedback" },
//   ];

//   return (
//     <motion.div
//       key="idle"
//       initial={{ opacity: 0, y: 28 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20, scale: 0.97 }}
//       transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
//       style={{
//         flex: 1, display: "flex", flexDirection: "column",
//         alignItems: "center", justifyContent: "center",
//         gap: 28, padding: "32px 24px", minHeight: 0,
//       }}
//     >
//       {/* Icon */}
//       <motion.div
//         initial={{ scale: 0.7, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ delay: 0.1, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
//         style={{
//           width: 80, height: 80, borderRadius: 22,
//           background: "linear-gradient(135deg, #e8ff47 0%, #a3e635 100%)",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           boxShadow: "0 0 0 1px rgba(232,255,71,0.4), 0 8px 48px rgba(232,255,71,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
//         }}
//       >
//         <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
//           <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#0a0a0f" strokeWidth="2" strokeLinejoin="round"/>
//           <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       </motion.div>

//       {/* Headline */}
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.18, duration: 0.5 }}
//         style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 10 }}
//       >
//         <h1 style={{
//           fontFamily: "'Syne', sans-serif",
//           fontSize: "clamp(2rem, 4vw, 2.8rem)",
//           fontWeight: 800, color: "#fff",
//           letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0,
//         }}>
//           Ready to{" "}
//           <span style={{
//             background: "linear-gradient(135deg, #e8ff47, #a3e635)",
//             WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//           }}>impress?</span>
//         </h1>
//         <p style={{
//           fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem",
//           color: "rgba(255,255,255,0.38)", lineHeight: 1.65,
//           maxWidth: 320, margin: "0 auto",
//         }}>
//           AI-powered mock interviews with real-time, brutally honest feedback on every answer.
//         </p>
//       </motion.div>

//       {/* Tags */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.26 }}
//         style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}
//       >
//         {[
//           { label: "Frontend Engineer", color: "rgba(232,255,71,0.1)", border: "rgba(232,255,71,0.28)", text: "#d4f542" },
//           { label: "Normal Mode", color: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.28)", text: "#c4b5fd" },
//         ].map(({ label, color, border, text }) => (
//           <span key={label} style={{
//             padding: "5px 14px", borderRadius: 100,
//             background: color, border: `1px solid ${border}`,
//             fontFamily: "'Syne', sans-serif", fontSize: "0.68rem",
//             fontWeight: 600, letterSpacing: "0.06em",
//             textTransform: "uppercase", color: text,
//           }}>{label}</span>
//         ))}
//       </motion.div>

//       {/* CTA */}
//       <motion.div
//         initial={{ opacity: 0, y: 12 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.34, duration: 0.5 }}
//       >
//         <motion.button
//           onClick={onStart}
//           disabled={loading}
//           whileHover={{ scale: 1.04, y: -2 }}
//           whileTap={{ scale: 0.97 }}
//           transition={{ type: "spring", stiffness: 400, damping: 20 }}
//           style={{
//             padding: "15px 52px", borderRadius: 16, border: "none",
//             background: loading
//               ? "rgba(255,255,255,0.07)"
//               : "linear-gradient(135deg, #e8ff47 0%, #a3e635 100%)",
//             color: loading ? "rgba(255,255,255,0.25)" : "#0a0a0f",
//             fontFamily: "'Syne', sans-serif",
//             fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.02em",
//             cursor: loading ? "not-allowed" : "pointer",
//             display: "flex", alignItems: "center", gap: 10,
//             boxShadow: loading
//               ? "none"
//               : "0 4px 32px rgba(232,255,71,0.45), 0 0 0 1px rgba(232,255,71,0.3), inset 0 1px 0 rgba(255,255,255,0.4)",
//           }}
//         >
//           {loading ? (
//             <>
//               <motion.span
//                 animate={{ rotate: 360 }}
//                 transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//                 style={{
//                   width: 16, height: 16, borderRadius: "50%",
//                   border: "2px solid rgba(255,255,255,0.12)",
//                   borderTopColor: "rgba(255,255,255,0.4)",
//                   display: "inline-block",
//                 }}
//               />
//               Starting session.
//             </>
//           ) : (
//             <>
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                 <polygon points="5,3 19,12 5,21" fill="#0a0a0f"/>
//               </svg>
//               Begin Session
//             </>
//           )}
//         </motion.button>
//       </motion.div>

//       {/* Stats */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.44 }}
//         style={{ display: "flex", gap: 32, alignItems: "center" }}
//       >
//         {stats.map(({ n, l }, i) => (
//           <div key={l} style={{ display: "flex", alignItems: "center", gap: 32 }}>
//             <div style={{ textAlign: "center" }}>
//               <div style={{
//                 fontFamily: "'Syne', sans-serif", fontSize: "1.4rem",
//                 fontWeight: 800, color: "rgba(255,255,255,0.85)", lineHeight: 1,
//               }}>{n}</div>
//               <div style={{
//                 fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem",
//                 color: "rgba(255,255,255,0.25)", textTransform: "uppercase",
//                 letterSpacing: "0.08em", marginTop: 4,
//               }}>{l}</div>
//             </div>
//             {i < stats.length - 1 && (
//               <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.07)" }}/>
//             )}
//           </div>
//         ))}
//       </motion.div>

//       <motion.p
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.5 }}
//         style={{
//           fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem",
//           color: "rgba(255,255,255,0.15)", textAlign: "center", maxWidth: 280,
//         }}
//       >
//         Powered by GPT-4 � Responses are private � No data stored
//       </motion.p>
//     </motion.div>
//   );
// }

// // �� Single message bubble �����������������������������������������������������
// function Bubble({ role, content, index }) {
//   const isUser = role === "user";
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 14, scale: 0.97 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: Math.min(index * 0.04, 0.3) }}
//       style={{
//         display: "flex",
//         flexDirection: isUser ? "row-reverse" : "row",
//         alignItems: "flex-end", gap: 10,
//       }}
//     >
//       {!isUser && (
//         <div style={{
//           width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
//           background: "linear-gradient(135deg, #e8ff47, #a3e635)",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           boxShadow: "0 0 0 1px rgba(232,255,71,0.3), 0 4px 16px rgba(232,255,71,0.2)",
//         }}>
//           <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
//             <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#0a0a0f" strokeWidth="2.2" strokeLinejoin="round"/>
//             <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//         </div>
//       )}
//       <div style={{
//         maxWidth: "70%", padding: "12px 18px",
//         borderRadius: isUser ? "20px 20px 5px 20px" : "20px 20px 20px 5px",
//         background: isUser
//           ? "linear-gradient(135deg, #e8ff47 0%, #a3e635 100%)"
//           : "rgba(255,255,255,0.055)",
//         border: isUser
//           ? "1px solid rgba(232,255,71,0.4)"
//           : "1px solid rgba(255,255,255,0.07)",
//         backdropFilter: "blur(16px)",
//         boxShadow: isUser
//           ? "0 4px 24px rgba(232,255,71,0.18), inset 0 1px 0 rgba(255,255,255,0.35)"
//           : "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
//         fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem",
//         lineHeight: 1.7, color: isUser ? "#0a0a0f" : "rgba(255,255,255,0.88)",
//         fontWeight: isUser ? 500 : 400, wordBreak: "break-word",
//       }}>
//         {content}
//       </div>
//     </motion.div>
//   );
// }

// // �� Streaming bubble ����������������������������������������������������������
// function StreamingBubble({ text }) {
//   if (!text) return null;
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       style={{ display: "flex", alignItems: "flex-end", gap: 10 }}
//     >
//       <div style={{
//         width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
//         background: "linear-gradient(135deg, #e8ff47, #a3e635)",
//         display: "flex", alignItems: "center", justifyContent: "center",
//         boxShadow: "0 0 0 1px rgba(232,255,71,0.3)",
//       }}>
//         <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
//           <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#0a0a0f" strokeWidth="2.2" strokeLinejoin="round"/>
//           <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       </div>
//       <div style={{
//         maxWidth: "70%", padding: "12px 18px",
//         borderRadius: "20px 20px 20px 5px",
//         background: "rgba(255,255,255,0.055)",
//         border: "1px solid rgba(255,255,255,0.07)",
//         backdropFilter: "blur(16px)",
//         fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem",
//         lineHeight: 1.7, color: "rgba(255,255,255,0.88)",
//         display: "flex", alignItems: "flex-end", gap: 8, wordBreak: "break-word",
//       }}>
//         <span>{text}</span>
//         <span style={{ display: "flex", gap: 3, flexShrink: 0, marginBottom: 2 }}>
//           {[0, 1, 2].map((i) => (
//             <motion.span
//               key={i}
//               animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
//               transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
//               style={{ width: 4, height: 4, borderRadius: "50%", background: "#a3e635", display: "inline-block" }}
//             />
//           ))}
//         </span>
//       </div>
//     </motion.div>
//   );
// }

// // �� Thinking dots �������������������������������������������������������������
// function ThinkingDots() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0 }}
//       style={{ display: "flex", alignItems: "flex-end", gap: 10 }}
//     >
//       <div style={{
//         width: 30, height: 30, borderRadius: "50%",
//         background: "linear-gradient(135deg, #e8ff47, #a3e635)",
//         display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//       }}>
//         <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
//           <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#0a0a0f" strokeWidth="2.2" strokeLinejoin="round"/>
//           <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       </div>
//       <div style={{
//         padding: "14px 18px", borderRadius: "20px 20px 20px 5px",
//         background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.07)",
//         display: "flex", gap: 5, alignItems: "center",
//       }}>
//         {[0, 1, 2].map((i) => (
//           <motion.span
//             key={i}
//             animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
//             transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
//             style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.45)", display: "inline-block" }}
//           />
//         ))}
//       </div>
//     </motion.div>
//   );
// }

// // �� Chat area �����������������������������������������������������������������
// function ChatArea({ messages, streamingText, loading, bottomRef }) {
//   return (
//     <div style={{
//       flex: 1, overflowY: "auto", padding: "28px 32px",
//       display: "flex", flexDirection: "column", gap: 14,
//       minHeight: 0,
//       scrollbarWidth: "thin",
//       scrollbarColor: "rgba(255,255,255,0.06) transparent",
//     }}>
//       <AnimatePresence initial={false}>
//         {messages.length === 0 && !loading && !streamingText && (
//           <motion.div
//             key="empty"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             style={{
//               flex: 1, display: "flex", flexDirection: "column",
//               alignItems: "center", justifyContent: "center",
//               gap: 10, padding: "60px 0",
//             }}
//           >
//             <div style={{
//               width: 44, height: 44, borderRadius: "50%",
//               background: "rgba(255,255,255,0.04)",
//               border: "1px solid rgba(255,255,255,0.07)",
//               display: "flex", alignItems: "center", justifyContent: "center",
//             }}>
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                 <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
//                   stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <p style={{
//               fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem",
//               color: "rgba(255,255,255,0.18)", textAlign: "center",
//             }}>Your interview begins here</p>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {messages.map((msg, i) => (
//         <Bubble key={i} {...msg} index={i} />
//       ))}

//       <StreamingBubble text={streamingText} />

//       <AnimatePresence>
//         {loading && !streamingText && <ThinkingDots key="thinking" />}
//       </AnimatePresence>

//       <div ref={bottomRef} />
//     </div>
//   );
// }

// // �� Input area ����������������������������������������������������������������
// function InputArea({ input, setInput, onSend }) {
//   const [focused, setFocused] = useState(false);
//   const textareaRef = useRef();

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
//   };

//   useEffect(() => {
//     const el = textareaRef.current;
//     if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 120) + "px"; }
//   }, [input]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 16 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 10 }}
//       style={{
//         padding: "16px 24px 20px",
//         borderTop: "1px solid rgba(255,255,255,0.06)",
//         background: "rgba(8,8,14,0.75)",
//         backdropFilter: "blur(24px)",
//         flexShrink: 0,
//       }}
//     >
//       <motion.div
//         animate={{
//           borderColor: focused ? "rgba(232,255,71,0.4)" : "rgba(255,255,255,0.08)",
//           boxShadow: focused ? "0 0 0 3px rgba(232,255,71,0.07)" : "none",
//         }}
//         transition={{ duration: 0.2 }}
//         style={{
//           display: "flex", alignItems: "flex-end", gap: 12,
//           padding: "12px 12px 12px 20px",
//           borderRadius: 18, background: "rgba(255,255,255,0.04)",
//           border: "1px solid rgba(255,255,255,0.08)",
//         }}
//       >
//         <textarea
//           ref={textareaRef}
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           placeholder="Type your answer. (Enter to send)"
//           rows={1}
//           style={{
//             flex: 1, background: "transparent", border: "none", outline: "none",
//             fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem",
//             color: "rgba(255,255,255,0.88)", lineHeight: 1.65,
//             caretColor: "#e8ff47", resize: "none", overflow: "hidden",
//           }}
//         />
//         <motion.button
//           onClick={onSend}
//           disabled={!input.trim()}
//           whileHover={input.trim() ? { scale: 1.07 } : {}}
//           whileTap={input.trim() ? { scale: 0.93 } : {}}
//           style={{
//             width: 42, height: 42, borderRadius: 12, border: "none", flexShrink: 0,
//             background: input.trim()
//               ? "linear-gradient(135deg, #e8ff47 0%, #a3e635 100%)"
//               : "rgba(255,255,255,0.06)",
//             cursor: input.trim() ? "pointer" : "default",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             boxShadow: input.trim() ? "0 4px 16px rgba(232,255,71,0.35)" : "none",
//             transition: "background 0.2s, box-shadow 0.2s",
//           }}
//         >
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//             <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
//               stroke={input.trim() ? "#0a0a0f" : "rgba(255,255,255,0.2)"}
//               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//         </motion.button>
//       </motion.div>
//       <p style={{
//         fontFamily: "'DM Sans', sans-serif", fontSize: "0.67rem",
//         color: "rgba(255,255,255,0.14)", textAlign: "center", marginTop: 8,
//       }}>
//         Enter to send � Shift+Enter for newline
//       </p>
//     </motion.div>
//   );
// }

// // �� Evaluating bar ������������������������������������������������������������
// function EvaluatingBar() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0 }}
//       style={{
//         padding: "14px 28px", borderTop: "1px solid rgba(255,255,255,0.06)",
//         background: "rgba(8,8,14,0.7)", backdropFilter: "blur(16px)",
//         display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
//       }}
//     >
//       <motion.div
//         animate={{ rotate: 360 }}
//         transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
//         style={{
//           width: 14, height: 14, borderRadius: "50%",
//           border: "2px solid rgba(232,255,71,0.15)",
//           borderTopColor: "#e8ff47", flexShrink: 0,
//         }}
//       />
//       <span style={{
//         fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem",
//         color: "rgba(255,255,255,0.28)", letterSpacing: "0.02em",
//       }}>
//         Evaluating your answer.
//       </span>
//     </motion.div>
//   );
// }

// // �� Feedback panel ������������������������������������������������������������
// function FeedbackArea({ feedback, onNext }) {
//   const score = typeof feedback?.score === "number" ? feedback.score : null;
//   const nextFocus = feedback?.nextFocus || feedback?.improvement || null;
//   const strengths = Array.isArray(feedback?.strengths) ? feedback.strengths : [];
//   const weaknesses = Array.isArray(feedback?.weaknesses) ? feedback.weaknesses : [];
//   const scoreColor = score === null ? "#a3e635" : score >= 8 ? "#a3e635" : score >= 5 ? "#f59e0b" : "#ef4444";

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 24 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 12 }}
//       transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
//       style={{
//         borderTop: "1px solid rgba(255,255,255,0.07)",
//         background: "rgba(8,8,14,0.88)",
//         backdropFilter: "blur(28px)",
//         padding: "20px 28px 24px",
//         flexShrink: 0, overflowY: "auto", maxHeight: "46vh",
//         scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent",
//       }}
//     >
//       {/* Score row */}
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
//         <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
//           <span style={{
//             fontFamily: "'Syne', sans-serif", fontSize: "2.6rem",
//             fontWeight: 800, color: scoreColor, lineHeight: 1,
//             filter: `drop-shadow(0 0 16px ${scoreColor}80)`,
//           }}>
//             {score !== null ? score : "-"}
//           </span>
//           <span style={{
//             fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem",
//             color: "rgba(255,255,255,0.22)", fontWeight: 500,
//           }}>/ 10</span>
//         </div>

//         {score !== null && (
//           <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
//             <span style={{
//               fontFamily: "'Syne', sans-serif", fontSize: "0.62rem",
//               color: "rgba(255,255,255,0.22)", textTransform: "uppercase", letterSpacing: "0.08em",
//             }}>Answer Score</span>
//             <div style={{ width: 160, height: 4, borderRadius: 100, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
//               <motion.div
//                 initial={{ width: 0 }}
//                 animate={{ width: `${score * 10}%` }}
//                 transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
//                 style={{
//                   height: "100%", borderRadius: 100,
//                   background: `linear-gradient(90deg, ${scoreColor}70, ${scoreColor})`,
//                   boxShadow: `0 0 10px ${scoreColor}55`,
//                 }}
//               />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Strengths + Weaknesses */}
//       {(strengths.length > 0 || weaknesses.length > 0) && (
//         <div style={{
//           display: "grid",
//           gridTemplateColumns: strengths.length && weaknesses.length ? "1fr 1fr" : "1fr",
//           gap: 12, marginBottom: 14,
//         }}>
//           {strengths.length > 0 && (
//             <div style={{
//               padding: "14px 16px", borderRadius: 14,
//               background: "rgba(163,230,53,0.06)", border: "1px solid rgba(163,230,53,0.14)",
//             }}>
//               <p style={{
//                 fontFamily: "'Syne', sans-serif", fontSize: "0.62rem",
//                 color: "#a3e635", textTransform: "uppercase", letterSpacing: "0.08em",
//                 fontWeight: 700, marginBottom: 8, margin: "0 0 8px",
//               }}>Strengths</p>
//               {strengths.map((s, i) => (
//                 <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
//                   <span style={{ color: "#a3e635", fontSize: "0.72rem", marginTop: 2, flexShrink: 0 }}>�</span>
//                   <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.5 }}>{s}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//           {weaknesses.length > 0 && (
//             <div style={{
//               padding: "14px 16px", borderRadius: 14,
//               background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.14)",
//             }}>
//               <p style={{
//                 fontFamily: "'Syne', sans-serif", fontSize: "0.62rem",
//                 color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.08em",
//                 fontWeight: 700, margin: "0 0 8px",
//               }}>To Improve</p>
//               {weaknesses.map((w, i) => (
//                 <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
//                   <span style={{ color: "#f59e0b", fontSize: "0.75rem", marginTop: 2, flexShrink: 0 }}>?</span>
//                   <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.5 }}>{w}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Next focus */}
//       {nextFocus && (
//         <div style={{
//           padding: "12px 16px", borderRadius: 12, marginBottom: 16,
//           background: "rgba(232,255,71,0.05)", border: "1px solid rgba(232,255,71,0.14)",
//           display: "flex", gap: 10, alignItems: "flex-start",
//         }}>
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
//             <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#e8ff47" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//           <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.52)", margin: 0, lineHeight: 1.55 }}>
//             <span style={{ color: "#e8ff47", fontWeight: 600 }}>Focus next: </span>{nextFocus}
//           </p>
//         </div>
//       )}

//       {/* Next question button */}
//       <motion.button
//         onClick={onNext}
//         whileHover={{ scale: 1.02, y: -1 }}
//         whileTap={{ scale: 0.98 }}
//         style={{
//           width: "100%", padding: "13px 0", borderRadius: 14, border: "none",
//           background: "linear-gradient(135deg, #e8ff47 0%, #a3e635 100%)",
//           color: "#0a0a0f", fontFamily: "'Syne', sans-serif",
//           fontSize: "0.88rem", fontWeight: 700, cursor: "pointer",
//           display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//           boxShadow: "0 4px 24px rgba(232,255,71,0.32), inset 0 1px 0 rgba(255,255,255,0.3)",
//           letterSpacing: "0.01em",
//         }}
//       >
//         Next Question
//         <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
//           <path d="M5 12h14M13 6l6 6-6 6" stroke="#0a0a0f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       </motion.button>
//     </motion.div>
//   );
// }

// // �� Root ����������������������������������������������������������������������
// export default function InterviewPage() {
//   const [sessionId, setSessionId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [streamingText, setStreamingText] = useState("");
//   const [input, setInput] = useState("");
//   const [feedback, setFeedback] = useState(null);
//   const [phase, setPhase] = useState("idle");
//   const [loading, setLoading] = useState(false);
//   const [questionCount, setQuestionCount] = useState(0);
//   const bottomRef = useRef();

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, streamingText]);

//   const streamText = async (text) => {
//     let i = 0;
//     setStreamingText("");
//     return new Promise((resolve) => {
//       const interval = setInterval(() => {
//         i += 2;
//         setStreamingText(text.slice(0, i));
//         if (i >= text.length) { clearInterval(interval); resolve(); }
//       }, 10);
//     });
//   };

//   const startInterview = async () => {
//     setLoading(true);
//     const res = await startInterviewSession({ role: "frontend", mode: "normal" });
//     setSessionId(res.sessionId);
//     setPhase("chat");
//     await askAI(res.sessionId, "Start interview. Ask first question.");
//   };

//   const askAI = async (id, message) => {
//     setLoading(true);
//     const res = await sendInterviewMessage(id, message);
//     await streamText(res.response);
//     setMessages((prev) => [...prev, { role: "assistant", content: res.response }]);
//     setStreamingText("");
//     setLoading(false);
//   };

//   const sendAnswer = async () => {
//     if (!input.trim() || loading) return;
//     const answer = input.trim();
//     setMessages((prev) => [...prev, { role: "user", content: answer }]);
//     setInput("");
//     setPhase("feedback");
//     setLoading(true);
//     const lastQuestion = [...messages].reverse().find((m) => m.role === "assistant")?.content;
//     const raw = await evaluateInterview(sessionId, lastQuestion, answer);
//     const parsed = parseFeedback(raw);
//     setFeedback(parsed);
//     setQuestionCount((n) => n + 1);
//     setLoading(false);
//   };

//   const nextQuestion = async () => {
//     setFeedback(null);
//     setPhase("chat");
//     await askAI(sessionId, "Ask next question.");
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
//         textarea::placeholder { color: rgba(255,255,255,0.18) !important; }
//         .iv-scroll::-webkit-scrollbar { width: 3px; }
//         .iv-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 3px; }
//         .iv-scroll::-webkit-scrollbar-track { background: transparent; }
//       `}</style>

//       <div style={{
//         height: "100%", display: "flex", flexDirection: "column",
//         background: "#08080e", color: "#fff",
//         position: "relative", overflow: "hidden", minHeight: 0,
//       }}>
//         <AmbientOrbs />

//         <InterviewHeader questionCount={questionCount} phase={phase} />

//         <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, position: "relative", zIndex: 1 }}>
//           <AnimatePresence mode="wait">
//             {phase === "idle" ? (
//               <IdleScreen key="idle" onStart={startInterview} loading={loading} />
//             ) : (
//               <motion.div
//                 key="session"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
//               >
//                 <ChatArea
//                   messages={messages}
//                   streamingText={streamingText}
//                   loading={loading && phase === "chat"}
//                   bottomRef={bottomRef}
//                 />

//                 <AnimatePresence mode="wait">
//                   {phase === "chat" && !loading && (
//                     <InputArea key="input" input={input} setInput={setInput} onSend={sendAnswer} />
//                   )}
//                   {phase === "feedback" && loading && !feedback && (
//                     <EvaluatingBar key="evaluating" />
//                   )}
//                   {phase === "feedback" && !loading && feedback && (
//                     <FeedbackArea key="feedback" feedback={feedback} onNext={nextQuestion} />
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </>
//   );
// }



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

function ThemeStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');

      .mi-root, .mi-root *, .mi-root *::before, .mi-root *::after { box-sizing: border-box; }
      .mi-root * { margin: 0; padding: 0; }

      .mi-root {
        --cream: #f5f0e8;
        --cream-dim: #ede8dc;
        --cream-deep: #e4ddd0;
        --ink: #0f0e0c;
        --ink-2: #2a2925;
        --ink-3: #4a4840;
        --ink-4: #7a7770;
        --ink-5: #a8a49c;
        --gold: #c9a84c;
        --gold-light: #e8c96a;
        --gold-dim: rgba(201,168,76,0.15);
        --gold-border: rgba(201,168,76,0.3);
        --green: #2d6a4f;
        --green-bg: rgba(45,106,79,0.08);
        --green-border: rgba(45,106,79,0.2);
        --red: #9b2335;
        --red-bg: rgba(155,35,53,0.07);
        --surface: #faf8f3;
        --surface-2: #f5f0e8;
        --border: rgba(15,14,12,0.1);
        --border-2: rgba(15,14,12,0.06);
        --shadow-sm: 0 1px 3px rgba(15,14,12,0.06), 0 1px 2px rgba(15,14,12,0.04);
        --shadow-md: 0 4px 16px rgba(15,14,12,0.08), 0 2px 6px rgba(15,14,12,0.05);
        --shadow-lg: 0 20px 60px rgba(15,14,12,0.1), 0 8px 24px rgba(15,14,12,0.06);
        --font-serif: 'Instrument Serif', Georgia, serif;
        --font-sans: 'Geist', system-ui, sans-serif;
        --font-mono: 'Geist Mono', monospace;

        min-height: 100%;
        background: var(--cream);
        color: var(--ink);
        font-family: var(--font-sans);
        font-size: 14px;
        line-height: 1.6;
        position: relative;
        overflow: hidden;
        -webkit-font-smoothing: antialiased;
      }

      .mi-root::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: 0.022;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        background-repeat: repeat;
        background-size: 128px;
      }

      .mi-root textarea, .mi-root input {
        width: 100%;
        font-family: var(--font-sans);
        font-size: 13px;
        color: var(--ink);
        background: transparent;
        border: none;
        outline: none;
        resize: none;
      }

      .mi-root textarea::placeholder, .mi-root input::placeholder {
        color: var(--ink-5);
      }

      .mi-root .label {
        font-family: var(--font-mono);
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ink-4);
      }

      .mi-root .serif { font-family: var(--font-serif); }

      .mi-root ::-webkit-scrollbar { width: 4px; }
      .mi-root ::-webkit-scrollbar-track { background: transparent; }
      .mi-root ::-webkit-scrollbar-thumb { background: var(--ink-5); border-radius: 4px; }

      .mi-scroll {
        scrollbar-width: thin;
        scrollbar-color: var(--ink-5) transparent;
      }

      .mi-shell {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 18px;
        padding: 20px 24px 24px;
        position: relative;
        z-index: 1;
      }

      .mi-topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
      }

      .mi-topbar-meta {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
      }

      .mi-grid {
        flex: 1;
        min-height: 0;
        display: grid;
        grid-template-columns: 280px minmax(0, 1fr) 320px;
        gap: 18px;
        align-items: start;
      }

      .mi-column {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-height: 0;
      }

      .mi-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 20px;
        box-shadow: var(--shadow-sm);
      }

      @media (max-width: 1200px) {
        .mi-grid {
          grid-template-columns: minmax(0, 1fr) 300px;
        }

        .mi-left {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: start;
        }
      }

      @media (max-width: 920px) {
        .mi-shell { padding: 16px; }
        .mi-topbar { flex-direction: column; align-items: flex-start; }
        .mi-grid { grid-template-columns: 1fr; }
        .mi-left { grid-template-columns: 1fr; }
      }
    `}</style>
  );
}

function Card({ children, style = {}, className = "" }) {
  return (
    <div className={`mi-card ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}

function Pill({ children, variant = "default" }) {
  const tones = {
    default: { bg: "rgba(15,14,12,0.06)", color: "var(--ink-3)", border: "var(--border-2)" },
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
        cursor: props.disabled ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
        opacity: props.disabled ? 0.6 : 1,
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

function ScoreRing({ value }) {
  const size = 52;
  const stroke = 4;
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = value >= 90 ? "var(--green)" : value >= 80 ? "var(--gold)" : "var(--red)";

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fontWeight: 600,
          color,
        }}
      >
        {value}%
      </div>
    </div>
  );
}

function AmbientOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        style={{
          position: "absolute",
          top: -180,
          left: -120,
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -200,
          right: -100,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(45,106,79,0.09) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}

function InterviewHeader({ questionCount, phase }) {
  const progress = Math.min(questionCount * 12.5, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mi-topbar"
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--gold)",
              padding: "3px 9px",
              borderRadius: 100,
              background: "var(--gold-dim)",
              border: "1px solid var(--gold-border)",
            }}
          >
            Mock Interview
          </span>
        </div>
        <h1 className="serif" style={{ fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 400, lineHeight: 1.1 }}>
          Practice the interview
          <br />
          <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>before it matters.</span>
        </h1>
      </div>

      <div className="mi-topbar-meta">
        <div
          style={{
            padding: "10px 16px",
            borderRadius: 14,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="label" style={{ marginBottom: 2 }}>
            Session
          </div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>
            {phase === "idle" ? "Ready" : phase === "feedback" ? "Reviewing" : "Active"}
          </div>
        </div>

        <div
          style={{
            padding: "10px 16px",
            borderRadius: 14,
            background: "var(--green-bg)",
            border: "1px solid var(--green-border)",
          }}
        >
          <div className="label" style={{ marginBottom: 2, color: "var(--green)" }}>
            Progress
          </div>
          <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "var(--font-mono)", color: "var(--green)" }}>
            {questionCount}/8
          </div>
        </div>

        <div
          style={{
            width: 180,
            padding: "12px 14px",
            borderRadius: 14,
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="label" style={{ marginBottom: 6 }}>
            Flow
          </div>
          <div style={{ width: "100%", height: 3, background: "var(--border)", borderRadius: 100, overflow: "hidden" }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: "100%", background: "var(--green)" }}
            />
          </div>
          <div style={{ marginTop: 6, fontSize: 12.5, color: "var(--ink-3)" }}>
            {phase === "idle" ? "Waiting to start" : phase === "feedback" ? "Feedback after answer" : "Question in progress"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

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
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        padding: "32px 24px",
        minHeight: 0,
      }}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 22,
          background: "var(--gold-dim)",
          border: "1px solid var(--gold-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <span className="serif" style={{ fontSize: 30, color: "var(--gold)" }}>
          Q
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.5 }}
        style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 10 }}
      >
        <h1
          className="serif"
          style={{
            fontSize: "clamp(2.3rem, 4vw, 3.2rem)",
            fontWeight: 400,
            color: "var(--ink)",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          Ready to
          <span style={{ color: "var(--gold)", fontStyle: "italic" }}> impress?</span>
        </h1>
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--ink-4)",
            lineHeight: 1.7,
            maxWidth: 360,
            margin: "0 auto",
          }}
        >
          AI-powered mock interviews with real-time, brutally honest feedback on every answer.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.26 }}
        style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}
      >
        <Pill variant="gold">Frontend Engineer</Pill>
        <Pill>Normal mode</Pill>
      </motion.div>

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
            padding: "15px 52px",
            borderRadius: 16,
            border: "none",
            background: loading ? "rgba(15,14,12,0.08)" : "var(--ink)",
            color: loading ? "var(--ink-5)" : "var(--cream)",
            fontFamily: "var(--font-sans)",
            fontSize: "0.95rem",
            fontWeight: 600,
            letterSpacing: "0.02em",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: loading ? "none" : "var(--shadow-md)",
          }}
        >
          {loading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: "2px solid rgba(15,14,12,0.12)",
                  borderTopColor: "var(--ink-3)",
                  display: "inline-block",
                }}
              />
              Starting session...
            </>
          ) : (
            <>Begin session</>
          )}
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.44 }}
        style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}
      >
        {stats.map(({ n, l }, i) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>
                {n}
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "var(--ink-5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginTop: 4,
                }}
              >
                {l}
              </div>
            </div>
            {i < stats.length - 1 && <div style={{ width: 1, height: 28, background: "var(--border)" }} />}
          </div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ fontSize: "0.7rem", color: "var(--ink-5)", textAlign: "center", maxWidth: 280 }}
      >
        Powered by GPT-4 | Responses are private | No data stored
      </motion.p>
    </motion.div>
  );
}

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
        alignItems: "flex-end",
        gap: 10,
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            flexShrink: 0,
            background: "var(--gold-dim)",
            border: "1px solid var(--gold-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-sm)",
            color: "var(--gold)",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          AI
        </div>
      )}
      <div
        style={{
          maxWidth: "70%",
          padding: "12px 18px",
          borderRadius: isUser ? "20px 20px 5px 20px" : "20px 20px 20px 5px",
          background: isUser ? "var(--ink)" : "var(--surface-2)",
          border: `1px solid ${isUser ? "var(--ink)" : "var(--border)"}`,
          boxShadow: "var(--shadow-sm)",
          fontSize: "0.9rem",
          lineHeight: 1.7,
          color: isUser ? "var(--cream)" : "var(--ink-2)",
          fontWeight: isUser ? 500 : 400,
          wordBreak: "break-word",
        }}
      >
        {content}
      </div>
    </motion.div>
  );
}

function StreamingBubble({ text }) {
  if (!text) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: "flex", alignItems: "flex-end", gap: 10 }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          flexShrink: 0,
          background: "var(--gold-dim)",
          border: "1px solid var(--gold-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--gold)",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        AI
      </div>
      <div
        style={{
          maxWidth: "70%",
          padding: "12px 18px",
          borderRadius: "20px 20px 20px 5px",
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
          fontSize: "0.9rem",
          lineHeight: 1.7,
          color: "var(--ink-2)",
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          wordBreak: "break-word",
        }}
      >
        <span>{text}</span>
        <span style={{ display: "flex", gap: 3, flexShrink: 0, marginBottom: 2 }}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "var(--gold)",
                display: "inline-block",
              }}
            />
          ))}
        </span>
      </div>
    </motion.div>
  );
}

function ThinkingDots() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{ display: "flex", alignItems: "flex-end", gap: 10 }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "var(--gold-dim)",
          border: "1px solid var(--gold-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "var(--gold)",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        AI
      </div>
      <div
        style={{
          padding: "14px 18px",
          borderRadius: "20px 20px 20px 5px",
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          display: "flex",
          gap: 5,
          alignItems: "center",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "var(--ink-4)",
              display: "inline-block",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ChatArea({ messages, streamingText, loading, bottomRef }) {
  return (
    <div
      className="mi-scroll"
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minHeight: 0,
      }}
    >
      <AnimatePresence initial={false}>
        {messages.length === 0 && !loading && !streamingText && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "60px 0",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--ink-4)",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
              }}
            >
              AI
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--ink-5)", textAlign: "center" }}>
              Your interview begins here
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {messages.map((msg, i) => (
        <Bubble key={i} {...msg} index={i} />
      ))}

      <StreamingBubble text={streamingText} />

      <AnimatePresence>{loading && !streamingText && <ThinkingDots key="thinking" />}</AnimatePresence>

      <div ref={bottomRef} />
    </div>
  );
}

function InputArea({ input, setInput, onSend }) {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  }, [input]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      style={{
        padding: "16px 24px 20px",
        borderTop: "1px solid var(--border)",
        background: "rgba(245,240,232,0.72)",
        backdropFilter: "blur(24px)",
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{
          borderColor: focused ? "var(--gold-border)" : "var(--border)",
          boxShadow: focused ? "0 0 0 3px rgba(201,168,76,0.08)" : "none",
        }}
        transition={{ duration: 0.2 }}
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 12,
          padding: "12px 12px 12px 20px",
          borderRadius: 18,
          background: "#fff",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
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
            flex: 1,
            fontSize: "0.9rem",
            color: "var(--ink-2)",
            lineHeight: 1.65,
            caretColor: "var(--gold)",
            overflow: "hidden",
          }}
        />
        <motion.button
          onClick={onSend}
          disabled={!input.trim()}
          whileHover={input.trim() ? { scale: 1.07 } : {}}
          whileTap={input.trim() ? { scale: 0.93 } : {}}
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            border: "none",
            flexShrink: 0,
            background: input.trim() ? "var(--ink)" : "rgba(15,14,12,0.08)",
            color: input.trim() ? "var(--cream)" : "var(--ink-5)",
            cursor: input.trim() ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: input.trim() ? "var(--shadow-sm)" : "none",
            transition: "background 0.2s, box-shadow 0.2s",
          }}
        >
          Send
        </motion.button>
      </motion.div>
      <p style={{ fontSize: "0.67rem", color: "var(--ink-5)", textAlign: "center", marginTop: 8 }}>
        Enter to send | Shift+Enter for newline
      </p>
    </motion.div>
  );
}

function EvaluatingBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        padding: "14px 28px",
        borderTop: "1px solid var(--border)",
        background: "rgba(245,240,232,0.78)",
        backdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: "2px solid rgba(201,168,76,0.18)",
          borderTopColor: "var(--gold)",
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: "0.82rem", color: "var(--ink-4)", letterSpacing: "0.02em" }}>
        Evaluating your answer...
      </span>
    </motion.div>
  );
}

function FeedbackArea({ feedback, onNext }) {
  const score = typeof feedback?.score === "number" ? feedback.score : null;
  const nextFocus = feedback?.nextFocus || feedback?.improvement || null;
  const strengths = Array.isArray(feedback?.strengths) ? feedback.strengths : [];
  const weaknesses = Array.isArray(feedback?.weaknesses) ? feedback.weaknesses : [];
  const scoreColor = score === null ? "var(--gold)" : score >= 8 ? "var(--green)" : score >= 5 ? "var(--gold)" : "var(--red)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderTop: "1px solid var(--border)",
        background: "rgba(245,240,232,0.88)",
        backdropFilter: "blur(28px)",
        padding: "20px 28px 24px",
        flexShrink: 0,
        overflowY: "auto",
        maxHeight: "46vh",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: "2.6rem", fontWeight: 700, color: scoreColor, lineHeight: 1 }}>
            {score !== null ? score : "-"}
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--ink-5)", fontWeight: 500 }}>/ 10</span>
        </div>

        {score !== null && (
          <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
            <span style={{ fontSize: "0.62rem", color: "var(--ink-5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Answer score
            </span>
            <div style={{ width: 160, height: 4, borderRadius: 100, background: "var(--border)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score * 10}%` }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: "100%", borderRadius: 100, background: scoreColor }}
              />
            </div>
          </div>
        )}
      </div>

      {(strengths.length > 0 || weaknesses.length > 0) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: strengths.length && weaknesses.length ? "1fr 1fr" : "1fr",
            gap: 12,
            marginBottom: 14,
          }}
        >
          {strengths.length > 0 && (
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 14,
                background: "var(--green-bg)",
                border: "1px solid var(--green-border)",
              }}
            >
              <p
                style={{
                  fontSize: "0.62rem",
                  color: "var(--green)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                Strengths
              </p>
              {strengths.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                  <span style={{ color: "var(--green)", fontSize: "0.72rem", marginTop: 2, flexShrink: 0 }}>+</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--ink-3)", lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          )}

          {weaknesses.length > 0 && (
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 14,
                background: "var(--red-bg)",
                border: "1px solid rgba(155,35,53,0.14)",
              }}
            >
              <p
                style={{
                  fontSize: "0.62rem",
                  color: "var(--red)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                To improve
              </p>
              {weaknesses.map((w, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                  <span style={{ color: "var(--red)", fontSize: "0.75rem", marginTop: 2, flexShrink: 0 }}>!</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--ink-3)", lineHeight: 1.5 }}>{w}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {nextFocus && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            marginBottom: 16,
            background: "var(--gold-dim)",
            border: "1px solid var(--gold-border)",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "var(--ink-3)", margin: 0, lineHeight: 1.55 }}>
            <span style={{ color: "var(--gold)", fontWeight: 600 }}>Focus next: </span>
            {nextFocus}
          </p>
        </div>
      )}

      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: "100%",
          padding: "13px 0",
          borderRadius: 14,
          border: "none",
          background: "var(--ink)",
          color: "var(--cream)",
          fontSize: "0.88rem",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          boxShadow: "var(--shadow-sm)",
          letterSpacing: "0.01em",
        }}
      >
        Next Question
      </motion.button>
    </motion.div>
  );
}

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
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
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
    <div className="mi-root" style={{ height: "100%" }}>
      <ThemeStyles />
      <AmbientOrbs />

      <div className="mi-shell">
        <InterviewHeader questionCount={questionCount} phase={phase} />

        <div className="mi-grid">
          <div className="mi-column mi-left">
            <Card style={{ padding: 24 }}>
              <span className="label" style={{ display: "block", marginBottom: 10 }}>
                Interview mode
              </span>
              <h3 className="serif" style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.15 }}>
                Current setup
              </h3>
              <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: "var(--cream-dim)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="label" style={{ marginBottom: 4 }}>
                    Role
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>Frontend Engineer</div>
                </div>
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: "var(--cream-dim)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="label" style={{ marginBottom: 4 }}>
                    Mode
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>Normal</div>
                </div>
              </div>
              <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 6 }}>
                <Pill variant="green">Live feedback</Pill>
                <Pill>8 questions</Pill>
                <Pill variant="gold">AI evaluator</Pill>
              </div>
            </Card>

            <Card style={{ padding: 24 }}>
              <span className="label" style={{ display: "block", marginBottom: 10 }}>
                Session summary
              </span>
              <h3 className="serif" style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.15 }}>
                Keep the interview under control
              </h3>
              <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: "var(--cream-dim)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="label" style={{ marginBottom: 4 }}>
                    Questions answered
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700 }}>{questionCount}</div>
                </div>
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: "var(--cream-dim)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="label" style={{ marginBottom: 4 }}>
                    Current phase
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ink-3)", fontWeight: 600 }}>
                    {phase === "idle" ? "Waiting to begin" : phase === "feedback" ? "Feedback review" : "Answering"}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card style={{ minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {phase === "idle" ? (
              <IdleScreen key="idle" onStart={startInterview} loading={loading} />
            ) : (
              <motion.div
                key="session"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
              >
                <div
                  style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <span className="label" style={{ display: "block", marginBottom: 6 }}>
                      Interview workspace
                    </span>
                    <h3 className="serif" style={{ fontSize: 22, fontWeight: 400 }}>
                      Practice and respond
                    </h3>
                  </div>
                  <Pill variant="green">Live session</Pill>
                </div>

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
                  {phase === "feedback" && loading && !feedback && <EvaluatingBar key="evaluating" />}
                  {phase === "feedback" && !loading && feedback && (
                    <FeedbackArea key="feedback" feedback={feedback} onNext={nextQuestion} />
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </Card>

          <div className="mi-column">
            <Card style={{ padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                <ScoreRing value={Math.min(questionCount * 12.5, 100)} />
                <div>
                  <span className="label" style={{ display: "block", marginBottom: 4 }}>
                    Progress
                  </span>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>Interview flow</h3>
                  <p style={{ fontSize: 12, color: "var(--ink-5)", marginTop: 2 }}>
                    {phase === "idle" ? "Session not started" : `${questionCount} answers submitted`}
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <div
                  style={{
                    padding: "11px 13px",
                    borderRadius: 12,
                    background: "var(--cream-dim)",
                    border: "1px solid var(--border-2)",
                  }}
                >
                  <div className="label" style={{ marginBottom: 4 }}>
                    Last step
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ink-3)", fontWeight: 600 }}>
                    {phase === "idle" ? "Ready to start" : phase === "feedback" ? "Reviewed answer" : "Respond to current question"}
                  </div>
                </div>

                <div
                  style={{
                    padding: "11px 13px",
                    borderRadius: 12,
                    background: "var(--cream-dim)",
                    border: "1px solid var(--border-2)",
                  }}
                >
                  <div className="label" style={{ marginBottom: 4 }}>
                    Session id
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ink-3)" }}>
                    {sessionId || "Not created yet"}
                  </div>
                </div>
              </div>
            </Card>

            <Card style={{ padding: 22 }}>
              <span className="label" style={{ display: "block", marginBottom: 10 }}>
                Latest AI guidance
              </span>
              <h3 className="serif" style={{ fontSize: 18, fontWeight: 400, marginBottom: 16 }}>
                What to improve
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {feedback ? (
                  <>
                    <div
                      style={{
                        padding: "14px 15px",
                        borderRadius: 14,
                        background: "var(--gold-dim)",
                        border: "1px solid var(--gold-border)",
                      }}
                    >
                      <div className="label" style={{ marginBottom: 6, color: "var(--gold)" }}>
                        Next focus
                      </div>
                      <p style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.65 }}>
                        {feedback?.nextFocus || feedback?.improvement || "Continue with a clearer, more structured answer."}
                      </p>
                    </div>

                    <div
                      style={{
                        padding: "14px 15px",
                        borderRadius: 14,
                        background: "var(--green-bg)",
                        border: "1px solid var(--green-border)",
                      }}
                    >
                      <div className="label" style={{ marginBottom: 6, color: "var(--green)" }}>
                        Signal
                      </div>
                      <p style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.65 }}>
                        You are in live-review mode. Use the next answer to correct the exact issue flagged above.
                      </p>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      padding: "14px 15px",
                      borderRadius: 14,
                      background: "var(--cream-dim)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <p style={{ fontSize: 12.5, color: "var(--ink-4)", lineHeight: 1.65 }}>
                      Answer a question to see targeted coaching here.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
