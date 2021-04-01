import { Component } from "../abstracts";
export function onChange(this: Component, key, oldValue, newValue) {
    if (this['_watchList'][key]) {
        this['_watchList'][key].forEach(cb => {
            cb.call(this, newValue, oldValue);
        });
    }
}