import MessageBubble from "./MessageBubble";
import StreamingBubble from "./StreamingBubble";

export default function ChatWindow({
  messages,
  streamingText,
  loading,
  bottomRef,
}) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
      {messages.map((msg, i) => (
        <MessageBubble key={i} {...msg} />
      ))}

      <StreamingBubble text={streamingText} />

      {loading && !streamingText && (
        <div className="text-white/40 text-sm">Thinking...</div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
