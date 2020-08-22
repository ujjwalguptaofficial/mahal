import { Component, Plugin } from "./abstracts";
import { globalFilters } from "./constant";

export class Taj {
    component: typeof Component;
    element: HTMLElement;

    constructor(component, element: HTMLElement) {
        this.component = component;
        this.element = element;
    }

    create() {
        const component: Component = new (this as any).component();
        this.element.appendChild(
            component.executeRender$$()
        );
    }

    static register(plugin, options) {
        new plugin.configure(Component, options);
    }

    filters(name: string, cb) {
        globalFilters[name] = cb;
    }
}