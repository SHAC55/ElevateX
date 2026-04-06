import React, { useMemo } from "react";
import ReactFlow, { Background, Controls, MiniMap, Position, Handle } from "reactflow";
import dagre from "dagre";
import { useNavigate } from "react-router-dom";
import "reactflow/dist/style.css";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const layoutGraph = (nodes, edges) => {
  dagreGraph.setGraph({
    rankdir: "LR",
    ranksep: 120,
    nodesep: 80,
  });

  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: 330, height: 170 }));
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));
  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const position = dagreGraph.node(node.id);
      return {
        ...node,
        position: { x: position.x - 165, y: position.y - 85 },
      };
    }),
    edges,
  };
};

const getTheme = (difficulty) => {
  const value = String(difficulty || "").toLowerCase();
  if (value === "beginner") return { border: "#14b8a6", chip: "#ccfbf1", text: "#0f766e" };
  if (value === "advanced") return { border: "#8b5cf6", chip: "#ede9fe", text: "#6d28d9" };
  if (value === "soft_skills") return { border: "#f59e0b", chip: "#fef3c7", text: "#b45309" };
  return { border: "#3b82f6", chip: "#dbeafe", text: "#1d4ed8" };
};

const SkillNode = ({ data }) => {
  const theme = getTheme(data.difficulty);

  return (
    <div
      className="w-[330px] rounded-[28px] border bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
      style={{ borderColor: theme.border }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: theme.text }}>
            {String(data.difficulty || "intermediate").replace("_", " ")}
          </div>
          <div className="mt-2 text-xl font-semibold text-slate-900">{data.label}</div>
        </div>
        <div
          className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
          style={{
            backgroundColor:
              data.status === "completed"
                ? "#16a34a"
                : data.isNext
                  ? "#0f172a"
                  : theme.chip,
            color: data.status === "completed" || data.isNext ? "#ffffff" : theme.text,
          }}
        >
          {data.status === "completed" ? "done" : data.isNext ? "next" : data.status.replace("_", " ")}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
          <span>Mastery</span>
          <span>{data.progress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.max(0, Math.min(100, data.progress || 0))}%`,
              background: `linear-gradient(90deg, ${theme.border}, #f59e0b)`,
            }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Topics</div>
          <div className="mt-2 text-lg font-bold text-slate-900">
            {data.completedTopics}/{data.topicCount}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Next Action</div>
          <div className="mt-2 line-clamp-2 text-sm font-medium text-slate-900">
            {data.nextTopicLabel || "Skill complete"}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
};

const nodeTypes = { skill: SkillNode };

export default function RoadmapCanvas({ data }) {
  const navigate = useNavigate();

  const flow = useMemo(() => {
    const nextSkillId = data?.meta?.nextSkillId;

    const nodes = (data?.nodes || []).map((node) => ({
      id: node.id,
      type: "skill",
      data: {
        ...node,
        isNext: String(node.id) === String(nextSkillId),
      },
      position: { x: 0, y: 0 },
    }));

    const edges = (data?.edges || []).map((edge) => ({
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      animated: String(edge.target) === String(nextSkillId),
      style: { stroke: "#94a3b8", strokeWidth: 2 },
    }));

    return layoutGraph(nodes, edges);
  }, [data]);

  return (
    <div className="h-[calc(100vh-130px)] rounded-[34px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_24%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 px-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Graph Roadmap</div>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Follow the dependency path, not random scrolling</h2>
        </div>
        <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Next: {data?.meta?.nextSkillLabel || "Complete current lane"}
        </div>
      </div>

      <div className="h-[calc(100%-72px)] overflow-hidden rounded-[28px] border border-slate-200 bg-white">
        <ReactFlow
          nodes={flow.nodes}
          edges={flow.edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={false}
          nodesConnectable={false}
          onNodeClick={(_, node) => navigate(`/career/plan/skills/${node.id}`)}
        >
          <Background gap={24} color="#e2e8f0" />
          <MiniMap pannable zoomable nodeColor={(node) => (node.data?.isNext ? "#0f172a" : "#64748b")} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
