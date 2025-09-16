// AILearningAssistantPanel.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompressAlt, faLightbulb, faGraduationCap, faBookOpen,
  faTriangleExclamation, faSitemap, faClock, faPaperPlane, faSpinner
} from "@fortawesome/free-solid-svg-icons";

/** tiny time-ago */
const timeAgo = (d) => {
  const diff = Math.max(0, Date.now() - new Date(d).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

/**
 * Use a relative base with a dev proxy if you prefer:
 * const API_BASE = "/api/learning/assistant";
 */
const API_BASE = "http://localhost:5000/api/learning/assistant";

/** POST SSE helper */
function streamAssistantPOST({ skillId, threadId, message, preset }) {
  const path = `${API_BASE}/${skillId}/query`;
  const controller = new AbortController();

  async function start(onToken, onDone, onError) {
    try {
      if (!skillId) throw new Error("Missing skillId");
      const authToken = localStorage.getItem("token");

      const payload = {
        threadId: threadId || undefined,
        message: typeof message === "string" && message.trim() ? message : undefined,
        preset: typeof preset === "string" && preset.trim() ? preset : undefined
      };
      // Optional: inspect what we actually send
      // console.log("SSE payload ->", payload);

      const resp = await fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        cache: "no-store",
        mode: "cors"
      });

      if (!resp.ok || !resp.body) {
        let text = "";
        try { text = await resp.text(); } catch {}
        throw new Error(`HTTP ${resp.status}${text ? `: ${text}` : ""}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let sawFrame = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx;
        while ((idx = buffer.indexOf("\n\n")) !== -1) {
          const frame = buffer.slice(0, idx).trim();
          buffer = buffer.slice(idx + 2);
          if (!frame) continue;

          const lines = frame.split(/\r?\n/);
          const dataLine = lines.find(l => l.startsWith("data:"));
          if (!dataLine) continue;

          const jsonStr = dataLine.replace(/^data:\s?/, "");
          let json;
          try { json = JSON.parse(jsonStr); } catch { continue; }

          sawFrame = true;
          if (json.token) onToken(json.token);
          if (json.error) throw new Error(json.error);
          if (json.done) { onDone(json); return; }
        }
      }

      if (!sawFrame) throw new Error("Stream ended without any frames");
      onDone();
    } catch (e) {
      onError(e);
    }
  }

  return {
    start,
    cancel() { controller.abort(); }
  };
}

export default function AILearningAssistantPanel({
  skill,
  skillId,
  isDetailExpanded,
  setIsDetailExpanded,
}) {
  const [threads, setThreads] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [threadId, setThreadId] = useState();

  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [uiError, setUiError] = useState("");
  const streamRef = useRef(null);

  /** fetch threads */
  const fetchThreads = async () => {
    if (!skillId) return;
    try {
      setLoadingThreads(true);
      const authToken = localStorage.getItem("token");
      const r = await fetch(`${API_BASE}/${skillId}/threads`, {
        headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) }
      });
      if (!r.ok) throw new Error("Failed to load threads");
      const data = await r.json();
      setThreads(data.threads || []);
    } catch {
      // ignore
    } finally {
      setLoadingThreads(false);
    }
  };

  useEffect(() => {
    if (!skillId) return;
    let mounted = true;
    (async () => {
      await fetchThreads();
      if (!mounted) return;
    })();
    return () => { mounted = false; };
  }, [skillId]);

  /** start stream */
  const startStream = ({ message, preset }) => {
    if (!skillId) return;
    if (isStreaming) {
      streamRef.current?.cancel();
      setIsStreaming(false);
    }
    setStreamText("");
    setUiError("");
    setIsStreaming(true);

    const s = streamAssistantPOST({ skillId, threadId, message, preset });
    streamRef.current = s;

    s.start(
      token => setStreamText(prev => prev + token),
      info => {
        setIsStreaming(false);
        setUiError("");
        if (info && info.threadId && !threadId) setThreadId(info.threadId);
        fetchThreads();
      },
      err => {
        setIsStreaming(false);
        setUiError(err.message || "Request failed");
        console.error("SSE error:", err);
      }
    );
  };

  const handleSend = () => {
    const msg = input.trim();
    if (!msg || !skillId) return;
    setInput("");
    startStream({ message: msg });
  };

  const handlePreset = (preset) => startStream({ preset });

  if (!skillId) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-6">
        <p className="text-sm text-slate-600">Loading assistant…</p>
      </div>
    );
  }

  return (
    <motion.div
      className={`${isDetailExpanded ? "lg:col-span-4" : "lg:col-span-3"}`}
      layout
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden relative">
        {isDetailExpanded && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDetailExpanded(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            title="Collapse view"
          >
            <FontAwesomeIcon icon={faCompressAlt} className="h-4 w-4 text-slate-600" />
          </motion.button>
        )}

        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 grid place-items-center">
              <FontAwesomeIcon icon={faLightbulb} className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">AI Learning Assistant</h2>
              <p className="text-sm text-slate-600">Get personalized guidance for {skill?.name || "your skill"}</p>
            </div>
          </div>

          {/* Input */}
          <div className="flex items-stretch gap-2 mb-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
              placeholder={`Ask about ${skill?.name || "this skill"}...`}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isStreaming}
            />
            <button
              onClick={handleSend}
              disabled={isStreaming || !input.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {isStreaming
                ? <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
                : <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />}
              Send
            </button>
          </div>

          {/* Error message */}
          {uiError && (
            <div className="mb-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded p-2">
              {uiError}
            </div>
          )}

          {/* Presets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <button onClick={() => handlePreset("beginner")} className="p-4 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left">
              <FontAwesomeIcon icon={faGraduationCap} className="h-4 w-4 mr-2 text-indigo-500" />
              Explain like I'm beginner
            </button>
            <button onClick={() => handlePreset("practice")} className="p-4 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left">
              <FontAwesomeIcon icon={faBookOpen} className="h-4 w-4 mr-2 text-indigo-500" />
              Give me a practice exercise
            </button>
            <button onClick={() => handlePreset("mistakes")} className="p-4 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left">
              <FontAwesomeIcon icon={faTriangleExclamation} className="h-4 w-4 mr-2 text-indigo-500" />
              Common mistakes to avoid
            </button>
            <button onClick={() => handlePreset("advanced")} className="p-4 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left">
              <FontAwesomeIcon icon={faLightbulb} className="h-4 w-4 mr-2 text-indigo-500" />
              Advanced techniques
            </button>
            <button onClick={() => handlePreset("realworld")} className="p-4 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left">
              <FontAwesomeIcon icon={faSitemap} className="h-4 w-4 mr-2 text-indigo-500" />
              Real-world applications
            </button>
            <button onClick={() => handlePreset("roadmap")} className="p-4 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left">
              <FontAwesomeIcon icon={faClock} className="h-4 w-4 mr-2 text-indigo-500" />
              Learning roadmap
            </button>
          </div>

          {/* Streaming answer */}
          <div className="mt-4 p-4 bg-slate-50 rounded-lg min-h-[120px]">
            {isStreaming ? (
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {streamText || "Thinking..."}<span className="animate-pulse">▍</span>
              </p>
            ) : streamText ? (
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{streamText}</p>
            ) : (
              <p className="text-sm text-slate-500">
                Ask me anything about {skill?.name || "this skill"} or use a preset.
              </p>
            )}
          </div>

          {/* Recent conversations */}
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <h3 className="font-semibold text-indigo-900 mb-2">Recent Conversations</h3>
            {loadingThreads && <p className="text-xs text-slate-600">Loading...</p>}
            <div className="space-y-2">
              {threads.length === 0 && !loadingThreads && (
                <div className="p-3 bg-white rounded border border-indigo-100">
                  <p className="text-sm text-slate-600">No conversations yet. Start one.</p>
                </div>
              )}
              {threads.slice(0, 5).map(t => (
                <button
                  key={t.id}
                  onClick={() => setThreadId(t.id)}
                  className={`w-full text-left p-3 bg-white rounded border border-indigo-100 hover:bg-indigo-50 transition ${threadId === t.id ? "ring-2 ring-indigo-300" : ""}`}
                >
                  <p className="text-sm text-slate-700 truncate">{t.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{timeAgo(t.lastMessageAt)}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}