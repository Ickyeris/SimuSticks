import { ReactFlow } from '@xyflow/react';
import { Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import MessageNode from './nodes/MessageNode';

const nodeTypes = {
  message: MessageNode
};


const initialNodes = [
  {
    id: 'node-1',
    type: 'message',
    position: { x: 300, y: 0 },
    data: {},
  },

  {
    id: 'node-1',
    type: 'message',
    position: { x: 100, y: 0 },
    data: {},
  },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 
const Canvas = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow 
      nodes={initialNodes}
      edges={initialEdges} 
      nodeTypes={nodeTypes}
      />
    </div>
  );
}

export default Canvas;