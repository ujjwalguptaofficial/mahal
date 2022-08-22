import { Component } from "../abstracts";
import { LIFECYCLE_EVENT } from "../enums";

const updateEvent = LIFECYCLE_EVENT.Update;
const TIMER_ID = '_timerId_';
export const emitUpdate = (comp: Component) => {
    if (comp.isMounted) {
        const id = comp[TIMER_ID];
        clearTimeout(id);
        comp[TIMER_ID] = setTimeout(() => {
            comp.emit(updateEvent);
        });
    }
};