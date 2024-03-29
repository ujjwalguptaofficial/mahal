import { emptyObj } from "../constant";
import { TYPE_EVENT_STORE } from "../types";
import { promiseResolve } from "./promise_resolve";

export class EventBus {

    constructor(events?) {
        this._events_ = events || {};
    }

    private _ctx_;

    private _events_: TYPE_EVENT_STORE;

    /**
     * subscribe to event
     *
     * @param {string} event
     * @param {Function} cb
     * @return {*} 
     * @memberof EventBus
     */
    on(event: string, cb: Function) {
        let events = this._events_[event];
        if (events == null) {
            events = this._events_[event] = new Map();
        }

        events.set(cb, true);
        return cb;
    }

    /**
     * unsubscribe to event
     * 
     * if callback is provided, then only callback is removed otherwise all events subscriber for that event
     *
     * @param {string} event
     * @param {Function} eventListener
     * @memberof EventBus
     */
    off(event: string, eventListener: Function) {
        if (process.env.NODE_ENV !== 'production') {
            if (!eventListener) {
                console.warn(
                    `no event listener is provided in event bus 'off' for event '${event}'`
                );
                return;
            }
        }
        const events = this._events_[event];
        if (events) {
            if (process.env.NODE_ENV !== 'production') {
                if (!events.has(eventListener)) {
                    console.warn(
                        `supplied event listener is not found for event '${event}'. Please provide same method which was used to subscribe the event.`
                    );
                }
            }
            events.delete(eventListener);
        }
        else if (process.env.NODE_ENV !== 'production') {
            console.warn(
                `supplied event listener is not found for event '${event}'. Please provide same method which was used to subscribe the event.`
            );
        }
    }

    eachEvent(events: Map<Function, any>, cb) {
        events.forEach((_, listener) => {
            cb(listener);
        });
    }

    emitAll(event: string, ...args) {
        const events = this.getEvent(event);
        if (!events) return;
        this.eachEvent(events, (cb) => {
            const result = cb.call(this._ctx_, ...args);
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
            const result = cb.call(this._ctx_, ...args);
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
            if (!eventCb) return promiseResolve(null);

            const result = eventCb.call(this._ctx_, ...args);
            return result && result.then ? result : promiseResolve(result);

        };

        return new Promise<any[]>((res) => {
            const checkAndCall = () => {
                const eventCb = items.next();
                if (!eventCb.done) {
                    callMethod(eventCb.value[0]).then(result => {
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
        this._ctx_ = null;
        this._events_ = emptyObj;
    }

    getEvent(eventName: string) {
        return this._events_[eventName];
    }
}