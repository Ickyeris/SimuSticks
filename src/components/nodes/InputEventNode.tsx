import { useEffect, useState, useRef } from "react";
import Button from "../ui/Button";

import { useInputEvent } from "../../hooks/useInputEvent";
import { InputType } from "../../hooks/InputEventBus";

import KeyboardIcon from "@mui/icons-material/Keyboard";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const InputEventNode = () => {
  const [inputs, setInputs] = useState([""]);
  const [listeningIndex, setListeningIndex] = useState(-1);
  const [inputsHidden, setInputsHidden] = useState(false);
  const [pressedInputs, setPressedInputs] = useState(new Map());

  const [active, setActive] = useState(false)

  useInputEvent("keyDown", (e: InputType) => {
      const isEscape = e.name === "Escape";
      if (isEscape) {
        return;
      }
      if (listeningIndex != -1 && !inputs.includes(e.name)) {
        const newInputs = [...inputs];
        newInputs[listeningIndex] = e.name;
        setInputs(newInputs);
        setListeningIndex(-1);  
      }
      else if (inputs.includes(e.name)) {
        const newPressedInputs = new Map(pressedInputs);
        newPressedInputs.set(e.name, e);
        setPressedInputs(newPressedInputs);
        updateActiveState(newPressedInputs);
      }
    },
    true
  );

  useInputEvent("keyUp", (e: InputType) => {
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
    if (inputs.some(str => newPressedInputs.has(str))) {
      setActive(true);
    }
    else {
      setActive(false);
    }
  }

  const handleAddInput = () => {
    setInputs([...inputs, ""]);
    setListeningIndex(-1);
  };

  const handleRemoveInput = (indexToRemove: number) => {
    setInputs((prev) => prev.filter((_, i) => i !== indexToRemove));
    setListeningIndex(-1);
  };

  return (
    <div className={`cursor-default flex flex-col border-2 border-black box-border ${active ? 'bg-green-200' : 'bg-white'}`}>
      {/* Title Bar */}
      <div className="drag-handle__custom flex items-center justify-between p-1 bg-gray-300 gap-2">
        <h1 className="font-bold">Input Event</h1>
        <KeyboardIcon />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-2">
        {/* Event Name Input */}
        <div>
          <label className="font-bold block">Event Name</label>
          <input
            type="text"
            placeholder="event_name"
            className="border-b border-black w-full"
          />
        </div>

        {/* Inputs Section Header (optional future dynamic input fields) */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-row">
            <h2 className="font-bold w-full">Inputs</h2>
            <ArrowDropDownIcon/>
          </div>
          {
            inputs.map((value: string, index: number) => {
              return (
                <div key={index} onPointerUp={() => setListeningIndex(index)} className="flex flex-row hover:bg-gray-400 p-1">
                  <div className="w-full">
                  {listeningIndex == index ? "Listening..." : value ? value : <span className="text-gray-400">Empty</span>}
                  </div>
                  <div onPointerUp={() => handleRemoveInput(index)} className="hover:bg-gray-200">
                    <CloseIcon/>
                  </div>
                </div>
              );
          })}
          <Button onClick={handleAddInput}>Add Input</Button>
        </div>
      </div>
      <strong className="w-full flex justify-end p-2">output</strong>
    </div>
  );
};

export default InputEventNode;
