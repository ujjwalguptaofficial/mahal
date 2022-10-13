import { Component } from "../abstracts";
import { Observer } from "../helpers";
import { Mahal } from "../mahal";
import { emitStateChange } from "./emit_state_change";
import { getObjectKeys } from "./get_object_keys";

export const createComponent = (componentConstructor, app: Mahal) => {
    let component: Component = new componentConstructor();

    const keys = getObjectKeys(component['_reactives_']);
    component['_app_'] = app;
    if (keys.length > 0) {
        component = new Observer(emitStateChange.bind(component), component).
            create(component, keys) as Component;
    }
    component['_watchBus_']['_ctx_'] = component;
    component['_evBus_']['_ctx_'] = component;
    return component;
};