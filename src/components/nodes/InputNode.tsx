import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import Button from "../ui/Button";

import { useInputEvent } from "../../hooks/useInputEvent";
import { InputType } from "../../hooks/InputEventBus";

import KeyboardIcon from "@mui/icons-material/Keyboard";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const InputNode = ({ id, data }) => {
  const [inputs, setInputs] = useState<string[]>([]);
  const [listening, setListening] = useState(false);
  const [hideInputs, setHideInputs] = useState(false);
  const [pressedInputs, setPressedInputs] = useState(new Map());
  const [active, setActive] = useState(false);

  useInputEvent(
    "keyDown",
    (e: InputType) => {
      console.log("press");
      const isEscape = e.name === "Escape";
      if (isEscape) {
        return;
      }

      if (listening && !inputs.includes(e.name)) {
        const newInputs = [...inputs, e.name];
        setInputs(newInputs);
        setListening(false);
      } else if (inputs.includes(e.name)) {
        const newPressedInputs = new Map(pressedInputs);
        newPressedInputs.set(e.name, e);
        setPressedInputs(newPressedInputs);
        updateActiveState(newPressedInputs);
      }
    },
    true
  );

  useInputEvent(
    "keyUp",
    (e: InputType) => {
      if (inputs.includes(e.name)) {
        const newPressedInputs = new Map(pressedInputs);
        newPressedInputs.delete(e.name);
        setPressedInputs(newPressedInputs);
        updateActiveState(newPressedInputs);
      }
    },
    true
  );

  const updateActiveState = (newPressedInputs: any) => {
    if (inputs.some((str) => newPressedInputs.has(str))) {
      setActive(true);
    } else {
      setActive(false);
    }
  };

  const handleAddInput = () => {
    setListening(true);
  };

  const handleRemoveInput = (indexToRemove: number) => {
    setInputs((prev) => prev.filter((_, i) => i !== indexToRemove));
    setListening(false);
  };

  const primaryColor = active ? "bg-green-300" : "bg-white";
  const secondaryColor = active ? "bg-green-500" : "bg-gray-300";

  return (
    <div
      className={`cursor-default flex flex-col border-2 border-black box-border w-48 ${primaryColor}`}
    >
      {/* Title Bar */}
      <div
        className={`drag-handle__custom flex items-center justify-between p-1 ${secondaryColor} gap-2`}
      >
        <h1 className="font-bold">Input Map</h1>
        <KeyboardIcon />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-2">
        {/* Inputs Section Header (optional future dynamic input fields) */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-row">
            <h2 className="font-bold w-full">Inputs</h2>
            <button onClick={() => setHideInputs(!hideInputs)}>
              <ArrowDropDownIcon />
            </button>
          </div>
          {!hideInputs ? (
            inputs.map((value: string, index: number) => {
              return (
                <div
                  key={index}
                  className={`flex flex-row ${
                    pressedInputs.has(value) ? "bg-green-500" : ""
                  } p-1`}
                >
                  <div className="w-full">
                    {value ? (
                      value
                    ) : (
                      <span className="text-gray-400">Empty</span>
                    )}
                  </div>
                  <div
                    onPointerUp={() => handleRemoveInput(index)}
                    className="hover:bg-gray-200"
                  >
                    <CloseIcon />
                  </div>
                </div>
              );
            })
          ) : (
            <div>{inputs.length} keys...</div>
          )}
          <Button onClick={handleAddInput}>
            {listening ? "Listening..." : "Add Input"}
          </Button>
        </div>
      </div>
      <strong className="w-full flex justify-end p-1">output</strong>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default InputNode;
