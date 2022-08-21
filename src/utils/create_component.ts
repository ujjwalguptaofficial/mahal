import { Component } from "../abstracts";
import { Observer } from "../helpers";
import { Mahal } from "../mahal";
import { emitStateChange } from "./emit_state_change";
import { EventBus } from "./event_bus";
import { getObjectKeys } from "./get_object_keys";

export const createComponent = (componentConstructor, app: Mahal) => {
    let component: Component = new componentConstructor();

    const keys = getObjectKeys(component['__reactives__']);
    component['__app__'] = app;
    if (keys.length > 0) {
        component = new Observer(emitStateChange.bind(component), component).
            create(component, keys) as Component;
    }
    component['__watchBus__']['_ctx_'] = component;
    component['__evBus__']['_ctx_'] = component;
    component.onInit();
    return component;
};