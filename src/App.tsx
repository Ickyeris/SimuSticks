import { useRef } from 'react';
import { ReactFlow, ReactFlowProvider, Background, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import MessageNode from './components/nodes/MessageNode';
import InputEventNode from './components/nodes/InputEventNode';


const nodeTypes = {
  message: MessageNode,
  inputevent: InputEventNode,
};

const initialNodes = [
  {
    id: 'node-1',
    type: 'inputevent',
    data: {},
    position: { x: 0, y: 450 },
    dragHandle: '.drag-handle__custom',
  },
];
 
const nodeOrigin: [number, number] = [0.5, 0];

const App = () => {
  const reactFlowWrapper = useRef(null);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);


  return (
    <ReactFlowProvider>
      <div className='wrapper w-full h-dvh' ref={reactFlowWrapper}>
        <ReactFlow 
        nodes={nodes}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        nodeOrigin={nodeOrigin}
        fitView
        
        />
        <Background/>
      </div>
    </ReactFlowProvider>
  );
}

export default App;