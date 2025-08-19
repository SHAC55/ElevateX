import React from "react";

export default function SkillStudyModal({ open, onClose, title, content, loading }) {
  if (!open) return null;

  // content expected from useSkillAIContent(skillId)
  const body = content?.content || content?.text || content; // be lenient

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* panel */}
      <div className="relative w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-lg p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title || "Study Material"}</h3>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        <div className="mt-3 max-h-[60vh] overflow-auto">
          {loading ? (
            <div className="text-gray-500 text-sm">Generating study material…</div>
          ) : body ? (
            <pre className="whitespace-pre-wrap text-sm text-gray-800">{body}</pre>
          ) : (
            <p className="text-sm text-gray-500">
              No content yet. Try generating again in a moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
