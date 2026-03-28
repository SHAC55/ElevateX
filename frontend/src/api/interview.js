import api from "./api";

// �����������������������������
// Get Profile
// �����������������������������
export const getInterviewProfile = async () => {
  const res = await api.get("/interview/profile");
  return res.data;
};

// �����������������������������
// Chat (normal)
// �����������������������������
export const sendInterviewMessage = async (messages) => {
  const res = await api.post("/interview/chat", { messages });
  return res.data.response;
};

// �����������������������������
// Streaming (optional later)
// �����������������������������

export const streamInterview = async (messages, onChunk) => {
  try {
    const token = localStorage.getItem("token");

    // ? reuse baseURL from axios
    const url = `${api.defaults.baseURL}/interview/chat/stream`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) {
      throw new Error("Streaming failed");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split("\n\n");

      for (let i = 0; i < parts.length - 1; i++) {
        const line = parts[i].replace("data: ", "").trim();

        if (line === "[DONE]") return;

        try {
          const parsed = JSON.parse(line);
          if (parsed.text) {
            onChunk(parsed.text); // ? clean text only
          }
        } catch {
          // ignore partial chunks
        }
      }

      buffer = parts[parts.length - 1];
    }
  } catch (err) {
    console.error("Streaming error:", err);
    throw err;
  }
};
// �����������������������������
// Evaluate Answer
// �����������������������������
export const evaluateInterview = async (question, answer) => {
  const res = await api.post("/interview/evaluate", {
    question,
    answer,
  });
  return res.data;
};
