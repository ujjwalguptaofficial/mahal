import { Component } from "./abstracts";
import { globalFilters, globalComponents, plugins, globalDirectives } from "./constant";
import { defaultExport } from "./default";
import { LogHelper, getFromWindow, isString } from "./utils";
import { LIFECYCLE_EVENT } from "./enums";

const destroyedEvent = new window.CustomEvent(LIFECYCLE_EVENT.Destroyed);
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
        new window.MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.removedNodes) {
                    mutation.removedNodes.forEach(removedNode => {
                        removedNode.dispatchEvent(destroyedEvent);
                    });
                }
            });
        }).observe(this.element, {
            childList: true, subtree: true
        })
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