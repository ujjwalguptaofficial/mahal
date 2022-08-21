import { Component } from "../abstracts";
import { Observer } from "../helpers";
import { Mahal } from "../mahal";
import { emitStateChange } from "./emit_state_change";
import { getObjectKeys } from "./get_object_keys";

export const createComponent = (componentConstructor, app: Mahal) => {
    let component: Component = new componentConstructor();
    const keys = getObjectKeys(component['__reactives__']);
    component['__app__'] = app;
    const watchers = component['__watchers__'];
    const evs = component['__events__'];
    if (keys.length > 0) {
        component = new Observer(emitStateChange.bind(component), component).
            create(component, keys) as Component;
    }
    component['__eventBus__']['_ctx'] = component;
    component['__watchBus__']['_ctx'] = component;
    if (watchers) {
        watchers.forEach((fn, propToWatch) => {
            component.watch(propToWatch, fn as any);
        });
    }
    if (evs) {
        evs.forEach((fn, evToWatch) => {
            component.on(evToWatch, fn);
        });
    }
    component.onInit();
    return component;
};