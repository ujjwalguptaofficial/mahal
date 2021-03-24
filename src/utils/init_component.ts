import { Component } from "../abstracts";
import { Logger, nextTick } from "../utils";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { handleAttribute, handleDirective, runPromisesInSequence } from "../helpers";

export function initComponent(this: Component, component: Component, option) {
    // if (component.storeGetters_) {
    // can not make it async because if item is array then it will break
    // because at that time value will be undefined
    // so set it before rendering

    // component.storeGetters_.forEach(item => {
    //     component[item.prop] = component.$store.state[item.state];
    //     const cb = (newValue, oldValue) => {
    //         component[item.prop] = newValue;
    //         component.updateDOM_(item.prop, oldValue);
    //     };
    //     component.$store.watch(item.state, cb);
    //     component.storeWatchCb_.push({
    //         key: item.state,
    //         cb
    //     });
    // });
    // }

    const htmlAttributes = handleAttribute.call(this, component, option.attr, true);
    handleDirective.call(this, component, option.dir, true);
    if (option.on) {
        const events = option.on;
        for (const eventName in events) {
            const ev = events[eventName];
            const methods = [];
            ev.handlers.forEach(item => {
                if (item != null) {
                    methods.push(item.bind(this));
                }
                else {
                    new Logger(ERROR_TYPE.InvalidEventHandler, {
                        eventName,
                    }).logPlainError();
                }
            });
            component.on(eventName, (args) => {
                runPromisesInSequence(methods, args);
            });
        }
    }
    component.emit(LIFECYCLE_EVENT.Created);
    component.on(LIFECYCLE_EVENT.Destroyed, () => {
        component = null;
    });
    nextTick(() => {
        component.emit(LIFECYCLE_EVENT.Rendered);
        component.isMounted = true;
    })
    return htmlAttributes;
}