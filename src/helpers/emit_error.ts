import { Component } from "../abstracts";
import { COMPONENT_APP } from "../constant";
import { LIFECYCLE_EVENT } from "../enums";
export function emitError(this: Component, err, shouldLog: boolean) {
    if (process.env.NODE_ENV !== 'production' || shouldLog) {
        console.error(err);
    }
    this[COMPONENT_APP].emit(LIFECYCLE_EVENT.Error, err);
    this.emit(LIFECYCLE_EVENT.Error, err);
}