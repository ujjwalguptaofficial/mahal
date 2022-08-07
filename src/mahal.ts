import { Component } from "./abstracts";
import { initComponent, isObject, executeRender, getDataype, createComponent, EventBus, promiseResolve } from "./utils";
import { DATA_TYPE, HTML_TAG, LIFECYCLE_EVENT } from "./enums";
import { createModelDirective, FragmentComponent, showDirective, classDirective, refDirective, htmlDirective, eventDirective } from "./ready_made";
import { Logger } from "./helpers";


export class Mahal {
    private _evBus_ = new EventBus();

    /**
     * component class
     *
     * @private
     * @type {typeof Component}
     * @memberof Mahal
     */
    private _comp_: typeof Component;

    component: Component;
    element: HTMLElement;

    global: { [key: string]: any } = {};

    constructor(component: typeof Component, element) {
        this._comp_ = component;
        this.element = getDataype(element) === DATA_TYPE.String ? document.querySelector(element) : element;
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
        // new window.MutationObserver((mutations) => {
        //     mutations.forEach(mutation => {
        //         mutation.removedNodes.forEach(removedNode => {
        //             dispatchDestroyed(removedNode);
        //         });
        //     });
        // }).observe(this.element, {
        //     childList: TRUE,
        //     subtree: TRUE,
        // })

        // register global directive
        const extendDirective = this.extend.directive;

        extendDirective("model", createModelDirective("input", "value"));
        extendDirective("show", showDirective);
        extendDirective("class", classDirective);
        extendDirective("ref", refDirective);
        extendDirective("html", htmlDirective);
        extendDirective("on", eventDirective);
    }

    create() {
        let componentInstance: Component = createComponent(this._comp_, this);
        initComponent.call(this, componentInstance, {});
        this.emit(LIFECYCLE_EVENT.Create);
        const el = executeRender(componentInstance);
        this.element.appendChild(
            el
        )
        this.emit(LIFECYCLE_EVENT.Mount);
        return promiseResolve(
            componentInstance
        );
    }

    on(event: string, cb: Function) {
        this._evBus_.on(event, cb);
        return this;
    }

    off(event: string, eventListener: Function) {
        this._evBus_.off(event, eventListener);
    }

    emit(event: string, ...args) {
        return this._evBus_.emit(event, ...args);
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
        },
        tag(name: string) {
            HTML_TAG.set(name, true);
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