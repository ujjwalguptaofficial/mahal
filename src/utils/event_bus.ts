import { clone } from "./clone";
import { promiseResolve } from "./promise_resolve";

export class EventBus {

    constructor(ctx?) {
        this._ctx = ctx;
    }

    private _ctx;

    private _events: {
        [key: string]: Function[]
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
        if (this._events[event] == null) {
            this._events[event] = [];
        }
        this._events[event].push(cb);
        return this;
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
    off(event: string, cb?: Function) {
        const events = this._events[event];
        if (events) {
            if (cb) {
                const index = events.indexOf(cb);
                events.splice(index, 1);
            }
            else {
                this._events[event] = [];
            }
        }
    }

    emitAll(event: string, ...args) {
        const events = this._events[event] || [];
        return events.map(cb => {
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
        const events = this._events[event] || [];
        return Promise.all(
            events.map(cb => {
                const result = cb.call(this._ctx, ...args);
                return result;
            })
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
        const events = clone(this._events[event]) || [];
        let index = 0;
        const length = events.length;
        const results = [];
        const callMethod = () => {
            const eventCb = events[index++];
            if (eventCb) {
                const result = eventCb.call(this._ctx, ...args);
                return result && result.then ? result : promiseResolve(result);
            }
            return promiseResolve(null);
        };

        return new Promise<any[]>((res) => {
            const checkAndCall = () => {
                if (index < length) {
                    callMethod().then(result => {
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
        this._events = null;
        this._ctx = null;
    }

    getEvent(eventName: string) {
        return this._events[eventName];
    }
}