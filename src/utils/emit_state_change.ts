import { Component } from "../abstracts";
export function emitStateChange(this: Component, key: string, newValue: any, oldValue?: any) {
    this['__watchBus__'].emit(key, newValue, oldValue);
}