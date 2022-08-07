import { Component } from "../abstracts";
import { COMPONENT_APP, COMPONENT_REACTIVES } from "../constant";
import { Observer } from "../helpers";
import { Mahal } from "../mahal";
import { emitStateChange } from "./emit_state_change";
import { getObjectKeys } from "./get_object_keys";
import { replaceNullProp } from "./replace_null_prop";

export const createComponent = (componentConstructor, app: Mahal) => {
    let component: Component = new componentConstructor();
    replaceNullProp(component, COMPONENT_REACTIVES, {});
    const keys = getObjectKeys(component[COMPONENT_REACTIVES]);
    component[COMPONENT_APP] = app;
    if (keys.length > 0) {
        component = new Observer(emitStateChange.bind(component), component).
            create(component, keys) as Component;
    }
    component['__eventBus__']['_ctx'] = component;
    component['__watchBus__']['_ctx'] = component;
    component.onInit();
    return component;
};