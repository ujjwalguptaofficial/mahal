import { Component } from "../abstracts";
import { ERROR_TYPE } from "../enums";
import { executeEvents } from "./execute_events";
import { Logger } from "./logger";

export const forEachEvent = function (this: Component, events: { [key: string]: Function[] }, cb: (event: string, listener: Function) => void) {
    if (!events) return;
    for (const eventName in events) {
        const methods = events[eventName];
        if (process.env.NODE_ENV !== 'production') {
            methods.forEach(item => {
                if (typeof item !== 'function') {
                    new Logger(ERROR_TYPE.InvalidEventHandler, {
                        ev: eventName,
                    }).throwPlain();
                }
            });
        }
        const eventListener = methods.length === 1 ? methods[0].bind(this) : (e) => {
            executeEvents.call(this, methods, e);
        };
        cb(eventName, eventListener);
    }
};