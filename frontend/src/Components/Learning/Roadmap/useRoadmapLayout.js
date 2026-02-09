import { MarkerType } from "reactflow";

export const buildFlowGraph = (nodes, edges) => {
  const flowNodes = nodes.map((n, idx) => ({
    id: n.id,
    type: "skill",
    data: n,
    position: {
      x: n.order * 260,
      y: idx * 140,
    },
  }));

  const flowEdges = edges.map((e) => ({
    id: `${e.source}-${e.target}`,
    source: e.source,
    target: e.target,
    markerEnd: { type: MarkerType.ArrowClosed },
    animated: true,
  }));

  return { flowNodes, flowEdges };
};
