import { Component } from "./abstracts/component";
import { Logger, isString, initComponent, isObject, executeRender, getDataype } from "./utils";
import { LIFECYCLE_EVENT } from "./enums";
import { createModelDirective, FragmentComponent, showDirective, classDirective, refDirective } from "./ready_made";

const destroyedEvent = new window.CustomEvent(LIFECYCLE_EVENT.Destroy);

function dispatchDestroyed(node: Node) {
    node.dispatchEvent(destroyedEvent);
    node.childNodes.forEach(item => {
        dispatchDestroyed(item);
    });
}
export class Mahal {
    component: typeof Component;
    element: HTMLElement;

    global: { [key: string]: any } = {};

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

        // register global directive

        this.extend.directive("model", createModelDirective("input", "value"));
        this.extend.directive("show", showDirective);
        this.extend.directive("class", classDirective);
        this.extend.directive("ref", refDirective);
    }

    create() {
        const componentInstance: Component = new (this as any).component();
        componentInstance['_app'] = this;
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



    extend = {
        plugin: (plugin, options?) => {
            const pluginInstane = new plugin();
            const apis = pluginInstane.setup(this, options);
            if (apis && isObject(apis)) {
                for (const api in apis) {
                    const apiValue = apis[api];
                    if (getDataype(apiValue) === "function") {
                        Component.prototype[api] = apiValue;
                    }
                }
            }
            this._plugins.push(plugin);
        },
        component: (name, component) => {
            this._components[name] = component;
        },
        formatter: (name: string, cb) => {
            this._formatter[name] = cb;
        },
        directive: (name: string, directive) => {
            this._directives[name] = directive;
        },
        set renderer(val) {
            (Mahal as any).createRenderer = val;
        }
    }

    private _plugins = [];
    private _components = {
        fragment: FragmentComponent
    };
    private _directives = {};
    private _formatter = {
        toS(value) {
            switch (typeof value) {
                case 'string':
                    return value;
                case 'number':
                    return (value as number).toString();
                default:
                    return JSON.stringify(value);
            }
        }
    };
}