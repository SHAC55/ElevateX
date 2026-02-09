// import ReactFlow, { Background, Controls } from "reactflow";
// import "reactflow/dist/style.css";
// import SkillNode from "./SkillNode";
// import { buildFlowGraph } from "./useRoadmapLayout";
//
// const nodeTypes = {
//   skill: SkillNode,
// };
//
// export default function RoadmapCanvas({ data }) {
//   const { flowNodes, flowEdges } = buildFlowGraph(data.nodes, data.edges);
//
//   return (
//     <div className="h-[90vh] w-full">
//       <ReactFlow
//         nodes={flowNodes}
//         edges={flowEdges}
//         nodeTypes={nodeTypes}
//         fitView
//       >
//         <Background />
//         <Controls />
//       </ReactFlow>
//     </div>
//   );
// }
//

// src/Components/Learning/Roadmap/RoadmapCanvas.jsx
import React, { useMemo } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import dagre from "dagre";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import "reactflow/dist/style.css";

/* ===========================
   DAGRE LAYOUT
=========================== */

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const layoutGraph = (nodes, edges) => {
  dagreGraph.setGraph({
    rankdir: "TB",
    ranksep: 90,
    nodesep: 60,
  });

  nodes.forEach((n) => {
    dagreGraph.setNode(n.id, { width: 240, height: 120 });
  });

  edges.forEach((e) => {
    dagreGraph.setEdge(e.source, e.target);
  });

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((n) => {
      const pos = dagreGraph.node(n.id);
      return {
        ...n,
        position: { x: pos.x - 120, y: pos.y - 60 },
      };
    }),
    edges,
  };
};

/* ===========================
   UTILITIES
=========================== */

const difficultyColors = {
  beginner: "border-green-500 text-green-600",
  intermediate: "border-blue-500 text-blue-600",
  advanced: "border-purple-500 text-purple-600",
  soft_skills: "border-amber-500 text-amber-600",
};

const computeUnlocked = (nodes, edges) => {
  const status = Object.fromEntries(nodes.map((n) => [n.id, n.data.status]));
  const prereqs = {};

  edges.forEach((e) => {
    if (!prereqs[e.target]) prereqs[e.target] = [];
    prereqs[e.target].push(e.source);
  });

  const unlocked = {};
  nodes.forEach((n) => {
    const reqs = prereqs[n.id] || [];
    unlocked[n.id] =
      reqs.length === 0 || reqs.every((id) => status[id] === "completed");
  });

  return unlocked;
};

/* ===========================
   SKILL NODE
=========================== */

const SkillNode = ({ data }) => {
  const locked = data.locked;
  const colorClass = difficultyColors[data.difficulty] || "border-gray-300";

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (data.progress / 100) * circumference;

  return (
    <div
      className={`relative w-[240px] rounded-xl border bg-white px-4 py-3 shadow-md
        ${colorClass}
        ${locked ? "opacity-50 blur-[0.5px]" : "cursor-pointer hover:shadow-lg"}
      `}
    >
      {locked && (
        <div className="absolute top-2 right-2 text-gray-500">
          <Lock size={16} />
        </div>
      )}

      <div className="font-semibold text-gray-900 text-center">
        {data.label}
      </div>

      <div className="text-xs text-center capitalize mt-1">
        {data.difficulty.replace("_", " ")}
      </div>

      {/* Progress Ring */}
      <div className="flex justify-center mt-3">
        <svg width="54" height="54">
          <circle
            cx="27"
            cy="27"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="27"
            cy="27"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
          <text
            x="27"
            y="31"
            textAnchor="middle"
            fontSize="12"
            fill="currentColor"
            className="font-semibold"
          >
            {data.progress}%
          </text>
        </svg>
      </div>
    </div>
  );
};

const nodeTypes = { skill: SkillNode };

/* ===========================
   MAIN CANVAS
=========================== */

export default function RoadmapCanvas({ data }) {
  const navigate = useNavigate();

  const rawNodes = data.nodes || [];
  const rawEdges = data.edges || [];

  const rfNodes = rawNodes.map((n) => ({
    id: n.id,
    type: "skill",
    data: { ...n },
    position: { x: 0, y: 0 },
  }));

  const rfEdges = rawEdges.map((e) => ({
    id: `${e.source}-${e.target}`,
    source: e.source,
    target: e.target,
    animated: true,
    style: { stroke: "#94a3b8" },
  }));

  const unlockedMap = computeUnlocked(rfNodes, rfEdges);

  rfNodes.forEach((n) => {
    n.data.locked = !unlockedMap[n.id];
  });

  const { nodes, edges } = useMemo(() => layoutGraph(rfNodes, rfEdges), [data]);

  return (
    <div className="h-[calc(100vh-120px)] bg-gray-50 rounded-xl overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        onNodeClick={(_, node) => {
          if (!node.data.locked) {
            navigate(`/career/plan/skills/${node.id}`);
          }
        }}
      >
        <Background gap={20} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
