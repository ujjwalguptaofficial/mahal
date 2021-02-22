import { Component } from "./abstracts";
import { globalFormatter, globalComponents, plugins, globalDirectives } from "./constant";
import { defaultExport } from "./default";
import { Logger, isString } from "./utils";
import { LIFECYCLE_EVENT } from "./enums";

const destroyedEvent = new window.CustomEvent(LIFECYCLE_EVENT.Destroyed);

function dispatchDestroyed(node: Node) {
    node.dispatchEvent(destroyedEvent);
    node.childNodes.forEach(item => {
        dispatchDestroyed(item);
    });
}
export class App {
    component: typeof Component;
    element: HTMLElement;

    constructor(component, element) {
        this.component = component;
        this.element = isString(element) ? document.querySelector(element) : element;
        if (this.element == null) {
            this.element = document.body;
            if (process.env.NODE_ENV != 'production') {
                Logger.warn("Provided element or element selector is not valid. Using body as default")
            }
        }
        new window.MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.removedNodes) {
                    mutation.removedNodes.forEach(removedNode => {
                        dispatchDestroyed(removedNode);
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

    static extend = {
        plugin(plugin, options) {
            const pluginInstane = new plugin();
            pluginInstane.setup(defaultExport, options);
            plugins.push(plugin);
        },
        component(name, component) {
            globalComponents[name] = component;
        },
        formatter(name: string, cb) {
            globalFormatter[name] = cb;
        },
        directive(name: string, directive) {
            globalDirectives[name] = directive;
        }
    }

}