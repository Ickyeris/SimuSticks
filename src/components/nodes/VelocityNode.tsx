import { Handle, Position } from "@xyflow/react";

import SpeedIcon from "@mui/icons-material/Speed";
import { useRef, useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
const VelocityNode = ({ id, data }) => {
  const [active, setActive] = useState(false);
  const [tapRate, setTapRate] = useState(0.2)
  return (
    <div
      className={`cursor-default flex flex-col min-w-32 border-2 border-black box-border bg-white`}
    >
      {/* Title Bar */}
      <div className="drag-handle__custom flex items-center justify-between p-1 bg-gray-300 gap-2">
        <h1 className="font-bold">Velocity</h1>
        <SpeedIcon />
      </div>

      <div className="flex flex-col p-2">
        {active && "active"}
        <LinearProgress value={0.5}/>
      </div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

export default VelocityNode;
