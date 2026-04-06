// src/pages/Roadmap.jsx
import { useEffect, useState } from "react";
import { getModuleRoadmap } from "../../api/learning";
import RoadmapCanvas from "../../Components/Learning/Roadmap/RoadmapCanvas";
import { useParams } from "react-router-dom";

export default function Roadmap() {
  const { moduleId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getModuleRoadmap(moduleId).then(setData).catch(() => setError("Failed to load roadmap"));
  }, [moduleId]);

  if (error) return <div className="p-6 text-rose-600">{error}</div>;
  if (!data) return <div className="p-6 text-slate-600">Loading roadmap...</div>;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <RoadmapCanvas data={data} />
      </div>
    </div>
  );
}
