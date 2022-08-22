import { Component } from "../abstracts";
import { LIFECYCLE_EVENT } from "../enums";

export function emitError(this: Component, err, shouldLog: boolean) {
    if (process.env.NODE_ENV !== 'production' || shouldLog) {
        console.error(err);
    }
    this['_app_'].emit(LIFECYCLE_EVENT.Error, err);
    this.emit(LIFECYCLE_EVENT.Error, err);
}