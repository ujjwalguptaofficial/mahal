import { Component } from "../abstracts";
import { Observer } from "../helpers";
import { Mahal } from "../mahal";
import { EventBus } from "./event_bus";
export const createComponent = (componentConstructor, app: Mahal) => {
    let component: Component = new componentConstructor();
    component['_eventBus'] = new EventBus(this);
    component['_watchBus'] = new EventBus(this);
    const keys = Object.keys(component['_props']).concat(component['_reactives'] || []);
    component['_app'] = app;
    return new Observer(component['__emitStateChange__'].bind(component)).create(component, keys) as Component;
}