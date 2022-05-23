import { Component } from "../abstracts";
import { LIFECYCLE_EVENT } from "../enums";

const updateEvent = LIFECYCLE_EVENT.Update;
export const emitUpdate = (comp: Component) => {
    if (comp.isMounted) {
        comp['timer'].debounce(() => {
            comp.emit(updateEvent);
        });
    }
};