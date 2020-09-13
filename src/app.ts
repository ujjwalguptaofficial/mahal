import { Component } from "./abstracts";
import { globalFilters, globalComponents, plugins, globalDirectives } from "./constant";
import { isString } from "util";
import { defaultExport } from "./default";
import { LogHelper } from "./utils";
import { dir } from "console";

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

    static addPlugin(plugin, options) {
        const pluginInstane = new plugin();
        pluginInstane.setup(defaultExport, options);
        plugins.push(plugin);
    }

    static addComponent(name, component) {
        globalComponents[name] = component;
    }

    static addFilter(name: string, cb) {
        globalFilters[name] = cb;
    }

    static addDirective(name: string, directive) {
        globalDirectives[name] = directive;
    }



}