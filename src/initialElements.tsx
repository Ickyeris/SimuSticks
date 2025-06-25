import { Edge } from "@xyflow/react";
export const initialNodes = [
  {
    id: "node-1",
    type: "input_node",
    position: { x: 0, y: 450 },
    dragHandle: ".drag-handle__custom",
    data: {
      active: false,
    },
  },

  {
    id: "node-3",
    type: "axis_1d_node",
    position: { x: 300, y: 450 },
    dragHandle: ".drag-handle__custom",
    data: {
      active: false,
    },
  },

  {
    id: "node-2",
    type: "velocity",
    data: {
      active: false,
    },
    position: { x: 333, y: 200 },
    dragHandle: ".drag-handle__custom",
  },

  {
    id: "node-4",
    type: "message",
    data: {
      active: false,
    },
    position: { x: 133, y: 200 },
    dragHandle: ".drag-handle__custom",
  },
];

export const initialEdges: Edge[] = [];