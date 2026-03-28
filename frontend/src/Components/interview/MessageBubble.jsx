export default function MessageBubble({ role, content }) {
  return (
    <div
      className={`max-w-xl p-3 rounded-xl ${
        role === "user" ? "ml-auto bg-blue-600" : "bg-white/5"
      }`}
    >
      {content}
    </div>
  );
}
