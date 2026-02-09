// src/pages/Roadmap.jsx
import { useEffect, useState } from "react";
import { getModuleRoadmap } from "../../api/learning";
import RoadmapCanvas from "../../Components/Learning/Roadmap/RoadmapCanvas";
import { useParams } from "react-router-dom";

export default function Roadmap() {
  const { moduleId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getModuleRoadmap(moduleId).then(setData);
  }, [moduleId]);

  if (!data) return <div>Loading roadmap...</div>;

  return <RoadmapCanvas data={data} />;
}
