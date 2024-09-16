type Listener = (data?: unknown) => void;

class EventEmitter {
    public events: Map<string, Listener[]> = new Map();

    subscribe(eventName: string, listener: Listener): void {
        if (!this.events.has(eventName)) {
            const arrayListener = [];
            arrayListener.push(listener);
            this.events.set(eventName, arrayListener);
        } else {
            const arrayListener = this.events.get(eventName);
            if (arrayListener) arrayListener.push(listener);
        }
    }
    unsubscribe() {}

    once() {}

    emit(eventName: string, data?: unknown) {
        const listeners = this.events.get(eventName);
        if (listeners) listeners.forEach((item) => item(data));
    }
}

const eventEmitter = new EventEmitter();
export default eventEmitter;
