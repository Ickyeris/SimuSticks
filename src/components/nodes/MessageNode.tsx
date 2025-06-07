import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

import EditIcon from '@mui/icons-material/Edit';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const handleStyle = { left: 10 };
 
const MessageNode = ({ data, isConnectable }) => {
  const [title, setTitle] = useState("Message")
  const [text, setText] = useState("")
  const [size, setSize] = useState({
    width: 96,
    height: 64
  })

  const onChange = useCallback((event: any) => {
    setText(event.target.value);
  }, []);
 
  return (
    <div className={`flex flex-col`}>
      <div className={`w-[${size.width}] h-[${size.height}] border-black border-2 box-border`}>

        {/* Titlebar */}
        <div className='p-1 flex bg-gray-300 '>
          <div className='flex flex-row items-end gap-2 w-full'>
            <h1 className='font-bold'>{title}</h1>  
            
          </div>
          <button><ArrowDropDownIcon/> </button> 
        </div>

        <hr></hr>

        {/* Text area */}
        <textarea id={text} name="text" placeholder='Enter message...' onChange={onChange} className='p-2 m-0'/>

        <hr></hr>


      <div className='flex flex-col p-1'>
          <div className='flex flex-row relative'>
            <div className=''>position</div>
            <button><ArrowDropDownIcon/> </button> 
            <Handle
              type="source"
              position={Position.Left}
              id="b"
              isConnectable={isConnectable}
              style={{position:"absolute", width:"8px", height:"8px", bottom:0, left:-5, backgroundColor:"green"}}
            >
            </Handle>
          </div>

          <div className='flex flex-row relative'>
            <div className=''>color</div>
            <button><ArrowDropDownIcon/> </button> 
            <Handle
              type="source"
              position={Position.Left}
              id="b"
              isConnectable={isConnectable}
              style={{position:"absolute", width:"8px", height:"8px", bottom:0, left:-5}}
            >
            </Handle>
          </div>
        </div>
      </div>

    </div>
  );
}
 
export default MessageNode;