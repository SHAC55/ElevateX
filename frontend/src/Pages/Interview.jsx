// import { useState, useEffect, useRef } from "react";
// import {
//   getInterviewProfile,
//   streamInterview,
//   evaluateInterview,
// } from "../api/interview";
//
// export default function MockInterview() {
//   const [profile, setProfile] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [feedback, setFeedback] = useState(null);
//   const [streamingText, setStreamingText] = useState("");
//   const [phase, setPhase] = useState("loading");
//   const [loading, setLoading] = useState(false);
//
//   const bottomRef = useRef(null);
//
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, streamingText]);
//
//   useEffect(() => {
//     getInterviewProfile()
//       .then((res) => {
//         setProfile(res.profile);
//         setPhase("ready");
//       })
//       .catch(() => setPhase("ready"));
//   }, []);
//
//   const handleStream = async (msgs) => {
//     setStreamingText("");
//     setLoading(true);
//
//     let fullText = "";
//     let buffer = "";
//     let lastFlush = Date.now();
//
//     await streamInterview(msgs, (text) => {
//       buffer += text;
//
//       if (Date.now() - lastFlush > 40) {
//         fullText += buffer;
//         buffer = "";
//         setStreamingText(fullText);
//         lastFlush = Date.now();
//       }
//     });
//
//     fullText += buffer;
//
//     setMessages((prev) => [...prev, { role: "assistant", content: fullText }]);
//
//     setStreamingText("");
//     setLoading(false);
//   };
//
//   const startInterview = async () => {
//     setMessages([]);
//     await handleStream([
//       { role: "user", content: "Start interview. Ask first question." },
//     ]);
//     setPhase("chat");
//   };
//
//   const sendAnswer = async () => {
//     if (!input.trim()) return;
//
//     const userMsg = { role: "user", content: input };
//
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setFeedback(null);
//     setLoading(true);
//
//     try {
//       const lastQuestion = [...messages]
//         .reverse()
//         .find((m) => m.role === "assistant")?.content;
//
//       const result = await evaluateInterview(lastQuestion, input);
//       setFeedback(result);
//     } catch (err) {
//       console.error(err);
//     }
//
//     setLoading(false);
//   };
//
//   const nextQuestion = async () => {
//     setFeedback(null);
//
//     await handleStream([
//       ...messages,
//       { role: "user", content: "Ask next interview question." },
//     ]);
//   };
//
//   return (
//     <div className="h-screen bg-[#05070a] text-white flex flex-col pt-20 overflow-hidden">
//       {/* CSS */}
//       <style>{`
//         .bg-glow::before {
//           content: "";
//           position: fixed;
//           inset: 0;
//           background:
//             radial-gradient(circle at 20% 10%, rgba(0,255,200,0.08), transparent 40%),
//             radial-gradient(circle at 80% 90%, rgba(0,150,255,0.08), transparent 40%);
//           z-index: 0;
//         }
//
//         .glass {
//           background: rgba(255,255,255,0.04);
//           backdrop-filter: blur(12px);
//           border: 1px solid rgba(255,255,255,0.08);
//         }
//
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(12px) scale(0.98); }
//           to { opacity: 1; transform: translateY(0) scale(1); }
//         }
//
//         .animate-fadeUp {
//           animation: fadeUp 0.4s ease;
//         }
//
//         @keyframes blink {
//           0%,100% { opacity: 0.2 }
//           50% { opacity: 1 }
//         }
//
//         .cursor {
//           animation: blink 1s infinite;
//         }
//
//         .btn {
//           transition: all 0.2s ease;
//         }
//
//         .btn:active {
//           transform: scale(0.94);
//         }
//       `}</style>
//
//       <div className="bg-glow absolute inset-0 pointer-events-none" />
//
//       {/* HEADER */}
//       <div className="px-6 py-4 border-b border-white/10 glass z-10">
//         <h1 className="text-lg font-semibold">AI Interview</h1>
//         {profile && (
//           <p className="text-xs text-white/50 mt-1">
//             {profile.skills.join(", ")}  {profile.careerGoal}
//           </p>
//         )}
//       </div>
//
//       {/* START */}
//       {phase === "ready" && (
//         <div className="flex-1 flex items-center justify-center z-10">
//           <button
//             onClick={startInterview}
//             className="btn px-6 py-3 rounded-xl glass hover:bg-white/10"
//           >
//             Start Interview
//           </button>
//         </div>
//       )}
//
//       {/* CHAT */}
//       {phase === "chat" && (
//         <>
//           <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 z-10">
//             {messages.map((msg, i) => (
//               <div
//                 key={i}
//                 className={`max-w-xl px-4 py-3 rounded-xl animate-fadeUp glass ${
//                   msg.role === "user" ? "ml-auto bg-blue-500/30" : ""
//                 }`}
//               >
//                 {msg.content}
//               </div>
//             ))}
//
//             {streamingText && (
//               <div className="max-w-xl px-4 py-3 rounded-xl glass animate-fadeUp">
//                 {streamingText}
//                 <span className="cursor ml-1">?</span>
//               </div>
//             )}
//
//             {loading && !streamingText && (
//               <div className="text-white/40 text-sm animate-pulse">
//                 thinking...
//               </div>
//             )}
//
//             <div ref={bottomRef} />
//           </div>
//
//           {!feedback && (
//             <div className="p-4 border-t border-white/10 glass flex gap-2 z-10">
//               <input
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 className="flex-1 p-3 rounded-lg bg-black/40 outline-none"
//               />
//               <button
//                 onClick={sendAnswer}
//                 className="btn px-4 rounded-lg bg-white text-black"
//               >
//                 Send
//               </button>
//             </div>
//           )}
//
//           {feedback && (
//             <div className="p-6 border-t border-white/10 glass animate-fadeUp z-10">
//               <div className="flex justify-between mb-4">
//                 <h2 className="text-lg font-bold">Score {feedback.score}/10</h2>
//
//                 <div className="w-40 h-2 bg-white/10 rounded overflow-hidden">
//                   <div
//                     className="h-full bg-green-400 transition-all duration-700"
//                     style={{ width: `${feedback.score * 10}%` }}
//                   />
//                 </div>
//               </div>
//
//               <div className="text-sm space-y-2">
//                 <div className="text-green-400">{feedback.strengths?.[0]}</div>
//                 <div className="text-yellow-400">{feedback.improvement}</div>
//               </div>
//
//               <button
//                 onClick={nextQuestion}
//                 className="btn mt-4 px-4 py-2 rounded bg-white text-black"
//               >
//                 Next 
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
//

import { useState, useRef, useEffect } from "react";
import {
  startInterviewSession,
  sendInterviewMessage,
  evaluateInterview,
} from "../api/interviewSession";

import HeaderBar from "../Components/interview/HeaderBar";
import ChatWindow from "../Components/interview/ChatWindow";
import InputBar from "../Components/interview/InputBar";
import FeedbackPanel from "../Components/interview/FeedbackPanel";

export default function InterviewPage() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [streamingText, setStreamingText] = useState("");
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  // fake streaming (fast MVP)
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
    const res = await startInterviewSession({
      role: "frontend",
      mode: "normal",
    });

    setSessionId(res.sessionId);

    await askAI(res.sessionId, "Start interview. Ask first question.");
    setPhase("chat");
  };

  const askAI = async (id, message) => {
    setLoading(true);

    const res = await sendInterviewMessage(id, message);

    await streamText(res.response);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: res.response },
    ]);

    setStreamingText("");
    setLoading(false);
  };

  const sendAnswer = async () => {
    if (!input.trim()) return;

    const answer = input;

    setMessages((prev) => [...prev, { role: "user", content: answer }]);
    setInput("");
    setPhase("feedback");
    setLoading(true);

    const lastQuestion = [...messages]
      .reverse()
      .find((m) => m.role === "assistant")?.content;

    const res = await evaluateInterview(sessionId, lastQuestion, answer);

    setFeedback(res);
    setLoading(false);
  };

  const nextQuestion = async () => {
    setFeedback(null);
    setPhase("chat");

    await askAI(sessionId, "Ask next question.");
  };

  return (
    <div className="h-screen flex flex-col bg-[#05070a] text-white pt-20">
      <HeaderBar />

      {phase === "idle" && (
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={startInterview}
            className="px-6 py-3 bg-white text-black rounded"
          >
            Start Interview
          </button>
        </div>
      )}

      {phase !== "idle" && (
        <>
          <ChatWindow
            messages={messages}
            streamingText={streamingText}
            loading={loading}
            bottomRef={bottomRef}
          />

          {phase === "chat" && (
            <InputBar input={input} setInput={setInput} onSend={sendAnswer} />
          )}

          {phase === "feedback" && feedback && (
            <FeedbackPanel feedback={feedback} onNext={nextQuestion} />
          )}
        </>
      )}
    </div>
  );
}
