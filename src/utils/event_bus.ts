import { promiseResolve } from "./promise_resolve";

export class EventBus {

    constructor(ctx?) {
        this._ctx = ctx;
    }

    private _ctx;

    private _events: {
        [key: string]: Map<number, Function>
    } = {};

    private _eventsId: {
        [key: string]: number
    } = {};

    /**
     * subscribe to event
     *
     * @param {string} event
     * @param {Function} cb
     * @return {*} 
     * @memberof EventBus
     */
    on(event: string, cb: Function) {
        let events = this._events[event];
        if (events == null) {
            events = this._events[event] = new Map();
            this._eventsId[event] = 0;
        }

        const eventId = ++this._eventsId[event];
        events.set(eventId, cb);
        return eventId;
    }

    /**
     * unsubscribe to event
     * 
     * if callback is provided, then only callback is removed otherwise all events subscriber for that event
     *
     * @param {string} event
     * @param {Function} cb
     * @memberof EventBus
     */
    off(event: string, eventId: number) {
        const events = this._events[event];
        if (events) {
            events.delete(eventId);
        }
    }

    eachEvent(events: Map<number, Function>, cb) {
        const size = events.size;
        let index = 0;
        events.forEach((value) => {
            if (index++ < size) {
                cb(value);
            }
        });
    }

    emitAll(event: string, ...args) {
        const events = this.getEvent(event);
        if (!events) return;
        this.eachEvent(events, (cb) => {
            const result = cb.call(this._ctx, ...args);
            return result;
        });
    }

    /**
     * emit event to all listener at a time
     *
     * @param {string} event
     * @param {*} args
     * @return {*} 
     * @memberof EventBus
     */
    emit(event: string, ...args) {
        const events = this.getEvent(event);
        if (!events) return promiseResolve<any[]>([]);
        const promises = [];
        this.eachEvent(events, (cb) => {
            const result = cb.call(this._ctx, ...args);
            promises.push(result);
        });
        return Promise.all(
            promises
        );
    }

    /**
     * linearly calls events - in case of async: wait for one's completion and then call next
     *
     * @param {string} event
     * @param {*} args
     * @return {*} 
     * @memberof EventBus
     */
    emitLinear(event: string, ...args) {
        const storedEvents = this.getEvent(event);
        if (!storedEvents) return promiseResolve<any[]>([]);
        const events = new Map(storedEvents);
        const results = [];
        const items = events.entries();
        const callMethod = (eventCb) => {
            if (eventCb) {
                const result = eventCb.call(this._ctx, ...args);
                return result && result.then ? result : promiseResolve(result);
            }
            return promiseResolve(null);
        };

        return new Promise<any[]>((res) => {
            const checkAndCall = () => {
                const eventCb = items.next();
                if (!eventCb.done) {
                    callMethod(eventCb.value[1]).then(result => {
                        results.push(result);
                        checkAndCall();
                    });
                }
                else {
                    res(results);
                }
            };
            checkAndCall();
        });

    }

    destroy() {
        this._ctx = this._events = this._eventsId = null;
    }

    getEvent(eventName: string) {
        return this._events[eventName];
    }
}