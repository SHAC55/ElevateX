export function streamAssistant({ skillId, threadId, message, preset }) {
  const controller = new AbortController();

  async function start(onToken) {
    const resp = await fetch(`http://localhost:5000/api/learning/assistant/${skillId}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId, message, preset }),
      signal: controller.signal
    });

    if (!resp.ok || !resp.body) throw new Error(`HTTP ${resp.status}`);

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let idx;
      while ((idx = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 2);
        const dataLine = frame.split("\n").find(l => l.startsWith("data: "));
        if (!dataLine) continue;
        const json = JSON.parse(dataLine.slice(6));
        if (json.token) onToken(json.token);
        if (json.done) return;
        if (json.error) throw new Error(json.error);
      }
    }
  }

  return {
    onToken(cb) { start(cb).catch(console.error); return this; },
    cancel() { controller.abort(); }
  };
}
