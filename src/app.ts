import { Component } from "./abstracts";
import { globalFormatter, globalComponents, plugins, globalDirectives } from "./constant";
import { defaultExport } from "./default";
import { Logger, isString, initComponent, isObject, executeRender } from "./utils";
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
            const defaultId = 'mahal-app';
            let el: HTMLElement = document.querySelector(defaultId);
            if (el) {
                el.innerHTML = "";
            }
            else {
                el = document.createElement('div');
                el.id = defaultId;
                document.body.appendChild(el);
            }
            this.element = el;
            if (process.env.NODE_ENV != 'production') {
                Logger.warn("Provided element or element selector is not valid. Using 'mahal-app' as default")
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
        initComponent.call(this, componentInstance, {});
        return new Promise((res, rej) => {
            executeRender(componentInstance).then(el => {
                this.element.appendChild(
                    el
                )
                res(componentInstance);
            }).catch(rej);
        })
    }

    static extend = {
        plugin(plugin, options?) {
            const pluginInstane = new plugin();
            const apis = pluginInstane.setup(defaultExport, options);
            if (apis && isObject(apis)) {
                for (const api in apis) {
                    Component.prototype['$' + api] = apis[api];
                }
            }
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
        },
        set renderer(val) {
            (App as any).createRenderer = val;
        }
    }
}