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
            component._$executeRender()
        );
    }

    addPlugin(plugin, options) {
        const pluginInstane = new plugin();
        pluginInstane.setup(Component, options);
        this.plugins_.push(plugin);
    }

    filters(name: string, cb) {
        globalFilters[name] = cb;
    }

    private plugins_ = [];
}