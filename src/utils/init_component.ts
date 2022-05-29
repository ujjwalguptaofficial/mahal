import { Component } from "../abstracts";
import { ARRAY_MUTABLE_METHODS } from "../constant";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { handleAttribute, handleDirective, executeEvents, Logger } from "../helpers";
import { getDataype } from "./get_data_type";

export function initComponent(this: Component, component: Component, option) {

    const htmlAttributes = handleAttribute.call(this, component, option.attr, true);
    handleDirective.call(this, component, option.dir, true);
    if (option.on) {
        const events = option.on;
        for (const eventName in events) {
            const ev = events[eventName];
            if (process.env.NODE_ENV !== 'production') {
                ev.handlers.forEach(item => {
                    if (typeof item !== 'function') {
                        new Logger(ERROR_TYPE.InvalidEventHandler, {
                            eventName,
                        }).throwPlain();
                    }
                });
            }
            const methods = ev.handlers;
            const cb = methods.length > 1 ? (e) => {
                executeEvents.call(this, methods, e);
            } : (e) => {
                methods[0].call(this, e);
            };
            component.on(eventName, cb);
        }
    }
    const computed = component['__computed__'];
    for (const key in computed) {
        const data = computed[key];
        let computedValue = data.fn.call(component);
        Object.defineProperty(component, key, {
            get() {
                return computedValue;
            },
            set(newValue) {
                computedValue = newValue;
            }
        });
        data.args.forEach(arg => {
            let eventsToWatch = [arg];
            switch (getDataype(component[arg])) {
                case "array":
                    const evs = [...ARRAY_MUTABLE_METHODS, "update"].map(ev => {
                        return `${arg}.${ev}`;
                    });
                    eventsToWatch = eventsToWatch.concat(evs); break;
                case "object":
                    eventsToWatch = eventsToWatch.concat(
                        ["add", "update", "delete"].map(ev => {
                            return `${arg}.${ev}`;
                        })
                    ); break;

            }
            eventsToWatch.forEach(ev => {
                component.watch(ev, () => {
                    const newValue = data.fn.call(component);
                    component.setState(key, newValue, computedValue);
                    computedValue = newValue;
                });
            });
        });
    }
    component.emit(LIFECYCLE_EVENT.Create);
    return htmlAttributes;
}