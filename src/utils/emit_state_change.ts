import { Component } from "../abstracts";
import { COMPONENT_COMPUTED } from "../constant";
import { ERROR_TYPE } from "../enums";
import { Logger } from "../helpers";

export function emitStateChange(this: Component, key: string, newValue: any, oldValue?: any) {
    if (newValue !== oldValue) {
        this['__watchBus__'].emitAll(key, newValue, oldValue);
    }
    else if (process.env.NODE_ENV !== 'production') {
        if (this[COMPONENT_COMPUTED][key]) return;
        new Logger(ERROR_TYPE.SetSameValue, {
            // val: oldValue,
            // comp: this,
            key
        }).logWarning();
    }
}