export default function InputBar({ input, setInput, onSend }) {
  return (
    <div className="p-4 border-t border-white/10 flex gap-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 p-3 rounded bg-black/40 outline-none"
        placeholder="Your answer..."
      />
      <button onClick={onSend} className="px-4 bg-white text-black rounded">
        Send
      </button>
    </div>
  );
}
