import React from "react";

const FallbackNote = ({ note, raw }) => {
  if (!note && !raw) return null;

  return (
    <section className="mt-8 p-4 border-l-4 border-yellow-500 bg-yellow-50 text-yellow-900">
      <h3 className="font-bold">⚠️ AI Fallback Notice</h3>
      <p>{note}</p>
      {raw && (
        <details className="mt-2 text-sm">
          <summary className="cursor-pointer underline">View raw AI output</summary>
          <pre className="mt-2 overflow-auto max-h-60 bg-white p-2 text-xs rounded border">{JSON.stringify(raw, null, 2)}</pre>
        </details>
      )}
    </section>
  );
};

export default FallbackNote;
