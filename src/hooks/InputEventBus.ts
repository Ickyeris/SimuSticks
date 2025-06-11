

type InputEventType = 'keyDown' | 'keyUp' | 'mouseDown' | 'mouseUp';

type EventCallback<T = any> = (event: T) => void;

export type InputType = {
    name: string
    state: string
    time: number
}


class InputEventBus {
    private listeners: Map<InputEventType, Set<EventCallback>> = new Map();

    constructor() {
        window.addEventListener('keydown', (e) => this.emit('keyDown', this.normalizeKeyBoardEvent(e, "down")));
        window.addEventListener('keyup', (e) => this.emit('keyUp', this.normalizeKeyBoardEvent(e, "up")));
        window.addEventListener('mousedown', (e) => this.emit('mouseDown', e));
        window.addEventListener('mouseup', (e) => this.emit('mouseUp', e));
    }

    on<T>(eventType : InputEventType, callback: EventCallback<T>) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, new Set());
        }
        this.listeners.get(eventType)!.add(callback);
    }

    off<T>(eventType: InputEventType, callback: EventCallback<T>) {
        this.listeners.get(eventType)?.delete(callback);
    }

    private emit<T>(eventType: InputEventType, event: T) {
        this.listeners.get(eventType)?.forEach((cb) => cb(event));
    }


    private normalizeKeyBoardEvent = (e: KeyboardEvent, state: string): InputType => {
        return {
            name: e.code,
            state: state,
            time: Date.now()
        }
    }
}

export const inputEventBus = new InputEventBus();