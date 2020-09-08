import { Component } from "./abstracts";
import { globalFilters } from "./constant";
import { isString } from "util";
import { defaultExport } from "./default";
import { IComponentOption } from "./interface";

export class App {
    component: typeof Component;
    element: HTMLElement;

    constructor(component, element) {
        this.component = component;
        this.element = isString(element) ? document.querySelector(element) : element;
        if (this.element == null) {
            throw "Invalid element - either element doesn't exist or you have provided invalid element";
        }
    }

    create(option?: IComponentOption) {
        const componentInstance: Component = new (this as any).component();
        if (option) {
            const componentInitOption = {};
            if (option.props) {
                componentInitOption["attr"] = {};
                for (const prop in option.props) {
                    componentInitOption["attr"][prop] = {
                        v: option.props[prop]
                    }
                }
            }
            (componentInstance as any).initComponent_(componentInstance, componentInitOption);
        }
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