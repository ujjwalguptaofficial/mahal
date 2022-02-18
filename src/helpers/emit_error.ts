import { Component } from "../abstracts";
import { LIFECYCLE_EVENT } from "../enums";
export function emitError(this: Component, err) {
    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }
    this.emit(LIFECYCLE_EVENT.Error, err);
}