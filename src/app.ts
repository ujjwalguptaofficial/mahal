import { Component } from "./abstracts";
import { globalFilters } from "./constant";
import { isString } from "util";
import { defaultExport } from "./default";
import { LogHelper } from "./utils";

export class App {
    component: typeof Component;
    element: HTMLElement;

    constructor(component, element) {
        this.component = component;
        this.element = isString(element) ? document.querySelector(element) : element;
        if (this.element == null) {
            this.element = document.body;
            if (process.env.NODE_ENV != 'production') {
                LogHelper.warn("Provided element or element selector is not valid. Using body as default")
            }
        }
    }

    create() {
        const componentInstance: Component = new (this as any).component();
        this.element.appendChild(
            (componentInstance as any).executeRender_()
        );
        return componentInstance;
    }

    addPlugin(plugin, options) {
        const pluginInstane = new plugin();
        pluginInstane.setup(defaultExport, this, options);
        this.plugins_.push(plugin);
    }

    addFilter(name: string, cb) {
        globalFilters[name] = cb;
    }

    private plugins_ = [];

}