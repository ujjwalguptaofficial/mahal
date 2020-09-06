import { Component } from "./abstracts";
import { globalFilters } from "./constant";
import { isString } from "util";

export * from "./abstracts";
export * from "./decorators"
export * from "./utils"

export default class Taj {
    component: typeof Component;
    element: HTMLElement;

    constructor(component, element) {
        this.component = component;
        this.element = isString(element) ? document.querySelector(element) : element;
        if (this.element == null) {
            throw "Invalid element - either element doesn't exist or you have provided invalid element";
        }
    }

    create() {
        const componentInstance: Component = new (this as any).component();
        this.element.appendChild(
            (componentInstance as any)._$executeRender()
        );
        return componentInstance;
    }

    addPlugin(plugin, options) {
        const pluginInstane = new plugin();
        pluginInstane.setup(Taj, options);
        this.plugins_.push(plugin);
    }

    defineFilter(name: string, cb) {
        globalFilters[name] = cb;
    }

    private plugins_ = [];


    // expose default member
    static Component = Component
}