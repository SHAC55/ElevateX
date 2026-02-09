export default function SkillNode({ data }) {
  const { label, difficulty, progress, status } = data;

  return (
    <div className="rounded-lg border bg-white p-3 w-56 shadow">
      <div className="font-semibold">{label}</div>

      <div className="text-xs text-gray-500">{difficulty}</div>

      <div className="mt-2 h-2 bg-gray-200 rounded">
        <div
          className="h-2 bg-blue-500 rounded"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-1 text-xs">{status.replace("_", " ")}</div>
    </div>
  );
}
