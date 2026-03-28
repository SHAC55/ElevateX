export default function StreamingBubble({ text }) {
  if (!text) return null;

  return (
    <div className="max-w-xl p-3 rounded-xl bg-white/5">
      {text}
      <span className="animate-pulse ml-1">?</span>
    </div>
  );
}
