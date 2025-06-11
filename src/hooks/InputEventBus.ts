

type InputEventType = 'keyDown' | 'keyUp' | 'mouseDown' | 'mouseUp';

type EventCallback<T = any> = (event: T) => void;

class InputEventBus {
    private listeners: Map<InputEventType, Set<EventCallback>> = new Map();

    constructor() {
        window.addEventListener('keydown', (e) => this.emit('keyDown', e));
        window.addEventListener('keyup', (e) => this.emit('keyUp', e));
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
}

export const inputEventBus = new InputEventBus();