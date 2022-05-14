import { Component } from "../abstracts";
export function emitStateChange(this: Component, key: string, newValue: any, oldValue?: any) {
    // nextTick(() => {
    this['__watchBus__'].emitAll(key, newValue, oldValue);
    // })
}