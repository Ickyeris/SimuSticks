import { useEffect } from 'react';
import { inputEventBus } from './InputEventBus';

export const useInputEvent = (
  type: 'keyDown' | 'keyUp' | 'mouseDown' | 'mouseUp',
  handler: (e: KeyboardEvent | MouseEvent) => void,
  active: boolean
) => {
  useEffect(() => {
    if (!active) return;
    inputEventBus.on(type, handler);
    return () => inputEventBus.off(type, handler);
  }, [type, handler, active]);
};