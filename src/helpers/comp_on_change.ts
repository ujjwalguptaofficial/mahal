import { Component } from "../abstracts";
export function onChange(this: Component, key, newValue, oldValue) {
    // if (this['_watchList'][key]) {
    //     this['_watchList'][key].forEach(cb => {
    //         cb.call(this, newValue, oldValue);
    //     });
    // }
    this['_watchBus'].emit(key, newValue, oldValue);
}