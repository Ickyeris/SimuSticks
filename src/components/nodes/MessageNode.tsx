import { useCallback, useState } from "react";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const MessageNode = () => {
  const [text, setText] = useState("");

  const onChange = useCallback((event: any) => {
    setText(event.target.value);
  }, []);

  return (
    <div className={`flex flex-col`}>
      <div className={`border-black border-2 box-border`}>
        {/* Titlebar */}
        <div className="drag-handle__custom p-1 flex bg-gray-300 ">
          <div className="flex flex-row items-end gap-2 w-full">
            <h1 className="font-bold">Message</h1>
          </div>
          <button>
            <ArrowDropDownIcon />{" "}
          </button>
        </div>

        <hr></hr>

        {/* Text area */}
        <textarea
          id={text}
          name="text"
          placeholder="Enter message..."
          onChange={onChange}
          className="w-full h-full p-1"
        />

        <hr></hr>

        <div className="w-full flex flex-row justify-between p-1">
          {/* Inputs */}
        </div>
      </div>
    </div>
  );
};

export default MessageNode;
