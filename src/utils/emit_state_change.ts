import { Component } from "../abstracts";
import { ERROR_TYPE } from "../enums";
import { Logger } from "../helpers";
export function emitStateChange(this: Component, key: string, newValue: any, oldValue?: any) {
    // nextTick(() => {

    if (newValue !== oldValue) {
        this['__watchBus__'].emitAll(key, newValue, oldValue);
    }
    else if (process.env.NODE_ENV !== 'production') {
        new Logger(ERROR_TYPE.SetSameValue, {
            // val: oldValue,
            // comp: this,
            key
        }).logWarning();
    }

    // })
}