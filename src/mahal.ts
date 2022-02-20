import { Component } from "./abstracts/component";
import { isString, initComponent, isObject, executeRender, getDataype, createComponent, EventBus } from "./utils";
import { LIFECYCLE_EVENT } from "./enums";
import { createModelDirective, FragmentComponent, showDirective, classDirective, refDirective, htmlDirective } from "./ready_made";
import { Logger } from "./helpers";

const destroyedEvent = new window.CustomEvent(LIFECYCLE_EVENT.Destroy);

function dispatchDestroyed(node: Node) {
    node.dispatchEvent(destroyedEvent);
    node.childNodes.forEach(item => {
        dispatchDestroyed(item);
    });
}
export class Mahal {
    private __eventBus__ = new EventBus();
    private __componentClass__: typeof Component;
    component: Component;
    element: HTMLElement;

    global: { [key: string]: any } = {};

    constructor(component: typeof Component, element) {
        this.__componentClass__ = component;
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
            if (process.env.NODE_ENV !== 'production') {
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
        this.extend.directive("html", htmlDirective);
    }

    create() {
        let componentInstance: Component = createComponent(this.__componentClass__, this);
        initComponent.call(this, componentInstance, {});
        this.emit(LIFECYCLE_EVENT.Create);
        return executeRender(componentInstance).then(el => {
            this.element.appendChild(
                el
            )
            this.emit(LIFECYCLE_EVENT.Mount);
            return componentInstance;
        });
    }

    on(event: string, cb: Function) {
        this.__eventBus__.on(event, cb);
        return this;
    }

    off(event: string, cb: Function) {
        this.__eventBus__.off(event, cb);
    }

    emit(event: string, ...args) {
        return this.__eventBus__.emit(event, ...args);
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