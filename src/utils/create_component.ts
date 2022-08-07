import { Component } from "../abstracts";
import { Observer } from "../helpers";
import { Mahal } from "../mahal";
import { emitStateChange } from "./emit_state_change";
import { getObjectKeys } from "./get_object_keys";
import { replaceNullProp } from "./replace_null_prop";

export const createComponent = (componentConstructor, app: Mahal) => {
    let component: Component = new componentConstructor();
    replaceNullProp(component, '__reactives__', {});
    const keys = getObjectKeys(component['__reactives__']);
    component['__app__'] = app;
    if (keys.length > 0) {
        component = new Observer(emitStateChange.bind(component), component).
            create(component, keys) as Component;
    }
    component['__eventBus__']['_ctx'] = component;
    component['__watchBus__']['_ctx'] = component;
    component.onInit();
    return component;
};