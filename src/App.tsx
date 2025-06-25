import { useRef, useCallback, useState, MouseEventHandler,} from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Node,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { invoke } from "@tauri-apps/api/tauri";
import { initialNodes, initialEdges } from "./initialElements";
import ContextMenu from "./components/ContextMenu";

import MessageNode from "./components/nodes/MessageNode";
import InputNode from "./components/nodes/InputNode";
import VelocityNode from "./components/nodes/VelocityNode";
import Input1DAxisNode from "./components/nodes/Input1DAxisNode";

const nodeTypes = {
  message: MessageNode,
  input_node: InputNode,
  axis_1d_node: Input1DAxisNode,
  velocity: VelocityNode,
};

const nodeOrigin: [number, number] = [0.5, 0];

const App = () => {
  const reactFlowWrapper = useRef(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [menu, setMenu] = useState({
    visible: false,
    id: "",
    bounds: {
      left: 0,
      top: 0,
    },
  });

  const sync = (nodes: Node[], edges: Edge[]) => {
    // Serialize nodes for backend
    const nodeData = nodes.map(({ id, type, data }) => ({
      id,
      type,
      data,
    }));

    // Serialize edges for backend
    const edgeData = edges.map(({ source, target }) => ({
      source,
      target,
    }));

    // Send nodes and edges data for backend
    invoke("update_graph", { nodes: nodeData, edges: edgeData })
      .then(() => console.log("Data synced!"))
      .catch(console.error);
  };

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) => {
        const updatedEdges = addEdge(params, eds);
        sync(nodes, updatedEdges);
        return updatedEdges;
      }),
    [setEdges, nodes]
  );

  const onContextMenu = useCallback(
    (event: any) => {
      // Prevent native context menu from showing
      event.preventDefault();
      
      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const bounds = contextMenuRef.current?.getBoundingClientRect();
      if (bounds) {
        setMenu({
          visible: true,
          id: "",
          bounds: {
            left:
              event.clientX < window.innerWidth - bounds.width
                ? event.clientX
                : window.innerWidth - bounds.width,
            top:
              event.clientY < window.innerHeight - bounds.height
                ? event.clientY
                : window.innerHeight - bounds.height,
          },
        });
      }
    },
    [setMenu]
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(
    () => setMenu({ ...menu, visible: false }),
    [setMenu]
  );

  return (
    <ReactFlowProvider>
      <div className="wrapper w-full h-dvh" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          nodeOrigin={nodeOrigin}
          onConnect={onConnect}
          onContextMenu={onContextMenu}
          onPaneClick={onPaneClick}
          onNodeDrag={onPaneClick}
          onMoveStart={onPaneClick}
        />
        <Background />
        <ContextMenu ref={contextMenuRef} onClick={onPaneClick} {...menu} />
      </div>
    </ReactFlowProvider>
  );
};

export default App;
