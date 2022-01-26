import { Component } from "../abstracts";
import { Observer } from "../helpers";
import { Mahal } from "../mahal";
export const createComponent = (componentConstructor, app: Mahal) => {
    let component: Component = new componentConstructor();
    const keys = Object.keys(component['_props']).concat(component['_reactives'] || []);
    component['_app'] = app;
    component = new Observer(component['__emitStateChange__'].bind(component)).
        create(component, keys) as Component;
    component['_eventBus']['_ctx'] = component;
    component['_watchBus']['_ctx'] = component;
    component.onInit();
    return component;
};