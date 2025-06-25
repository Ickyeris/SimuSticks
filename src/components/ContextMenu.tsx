
import { HTMLProps, MouseEventHandler, forwardRef, Ref} from "react";


export type ContextMenuProps = {
    onClick: MouseEventHandler<HTMLDivElement>
    visible: boolean
    id: string
    bounds: {left: number, top: number}
} & HTMLProps<HTMLDivElement>


const ContextMenu = forwardRef(({onClick, visible, id, bounds, style, ...rest}: ContextMenuProps, ref: Ref<HTMLDivElement>) => {
    return (
        <div 
        ref={ref}
        className="absolute bg-white border-2 border-black p-2"
        style={{...style, left:bounds.left, top:bounds.top, display: visible ? "block" : "none"}}
        {...rest}
        >
            <button>Add Node</button>
        </div>
    )
});

export default ContextMenu;