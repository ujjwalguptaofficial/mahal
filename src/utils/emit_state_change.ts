import { Component } from "../abstracts";

export function emitStateChange(this: Component, key: string, newValue: any, oldValue?: any) {
    if (newValue !== oldValue) {
        this['_watchBus_'].emitAll(key, newValue, oldValue);
    }
    // else if (process.env.NODE_ENV !== 'production') {
    //     if (this['_computed_'][key]) return;
    //     new Logger(ERROR_TYPE.SetSameValue, {
    //         // val: oldValue,
    //         // comp: this,
    //         key
    //     }).logWarning();
    // }
}