import { Component } from "../abstracts";
import { Observer } from "../helpers";
import { Mahal } from "../mahal";
export const createComponent = (componentConstructor, app: Mahal) => {
    let component: Component = new componentConstructor();
    const keys = Object.keys(component['__reactives__'] || {});
    component['__app__'] = app;
    if (keys.length > 0) {
        component = new Observer(component['__emitStateChange__'].bind(component)).
            create(component, keys) as Component;
    }
    component['__eventBus__']['_ctx'] = component;
    component['__watchBus__']['_ctx'] = component;
    component.onInit();
    return component;
};