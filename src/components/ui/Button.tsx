import { PointerEventHandler } from "react";

type ButtonType = {
    children?: React.ReactNode
    onClick: PointerEventHandler<HTMLButtonElement>
}

const Button = ({children, onClick}: ButtonType) => {
    return (
        <button className="rounded-sm p-1 bg-gray-300 text-sm text-black font-bold hover:bg-gray-400"
        onPointerUp={onClick}
        >
            {children}
        </button>
    )
}
export default Button;