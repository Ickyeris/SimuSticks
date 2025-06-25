import Button from "../ui/Button";
import { Handle, NodeTypes, Position } from "@xyflow/react";
import { useState } from "react";
import { InputType } from "../../hooks/InputEventBus";
import { useInputEvent } from "../../hooks/useInputEvent";

const Input1DAxisNode = ({ id, data }: NodeTypes) => {
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [listening, setListening] = useState("");
  useInputEvent(
    "keyDown",
    (e: InputType) => {
      const isEscape = e.name === "Escape";
      if (isEscape) {
        setListening("");
        return;
      }

      switch (listening) {
        case "a":
          setInputA(e.name);
          setListening("");
          return;
        case "b":
          setInputB(e.name);
          setListening("");
          return;
      }
    },
    true
  );

  return (
    <div className="cursor-default flex flex-col border-2 border-black box-border w-48 bg-white">
      {/* Title Bar */}
      <div className="drag-handle__custom flex items-center justify-between p-1 bg-gray-300 gap-2">
        <h1 className="font-bold">Input 1D Axis</h1>
      </div>

      <div className="flex flex-row justify-center p-2 gap-2">
        <Button onClick={() => setListening("a")}>
          {listening == "a" ? "Listening..." : inputA || "Empty"}{" "}
        </Button>
        <Button onClick={() => setListening("b")}>
          {listening == "b" ? "Listening..." : inputB || "Empty"}
        </Button>
      </div>
      <strong className="w-full flex justify-end p-1">output</strong>
      <Handle type="source" position={Position.Right}/>
    </div>
  );
};

export default Input1DAxisNode;
