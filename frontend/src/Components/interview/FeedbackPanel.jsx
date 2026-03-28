export default function FeedbackPanel({ feedback, onNext }) {
  return (
    <div className="p-6 border-t border-white/10 bg-white/5">
      <div className="flex justify-between mb-4">
        <h2>Score {feedback.score}/10</h2>

        <div className="w-40 h-2 bg-white/10 rounded">
          <div
            className="h-full bg-green-400"
            style={{ width: `${feedback.score * 10}%` }}
          />
        </div>
      </div>

      <div className="text-sm space-y-2">
        <p className="text-green-400">
          Clarity: {feedback.dimensions?.clarity}
        </p>
        <p className="text-yellow-400">Next: {feedback.nextFocus}</p>
      </div>

      <button
        onClick={onNext}
        className="mt-4 px-4 py-2 bg-white text-black rounded"
      >
        Next Question →
      </button>
    </div>
  );
}
