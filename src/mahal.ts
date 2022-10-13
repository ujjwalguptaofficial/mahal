import { Component } from "./abstracts";
import { initComponent, isObject, executeRender, getDataype, createComponent, EventBus, promiseResolve } from "./utils";
import { HTML_TAG, LIFECYCLE_EVENT } from "./enums";
import { createModelDirective, FragmentComponent, showDirective, classDirective, refDirective, htmlDirective, eventDirective } from "./ready_made";
import { Logger } from "./helpers";
import { IElementOption, IRenderContext } from "./interface";



export class Mahal {

    component: Component;
    element: HTMLElement;

    global: { [key: string]: any } = {};

    constructor(component: typeof Component, element) {
        this.element = getDataype(element) === 'string' ? document.querySelector(element) : element;
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

        this._createComponent_(component);
    }

    private _createComponent_(component: typeof Component) {
        const comp = this.component = createComponent(component, this);
        this.on = (ev, cb) => {
            comp.on(ev, cb);
        }
        this.off = (ev, cb) => {
            comp.off(ev, cb);
        }
        this.emit = (ev, ...args) => {
            comp.emit(ev, ...args);
        }
    }

    create(option?: IElementOption) {
        let componentInstance: Component = this.component;
        initComponent.call(componentInstance, componentInstance, option);
        const el = executeRender(componentInstance, []);
        this.element.appendChild(
            el
        );
        componentInstance.element = el;
        componentInstance.isMounted = true;
        componentInstance.emit(LIFECYCLE_EVENT.Mount);
        return promiseResolve(
            componentInstance
        );
    }

    on: (event: string, cb: Function) => void;

    off: (event: string, eventListener: Function) => void;

    emit: (event: string, ...args) => void;

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
            this._plugins_.push(plugin);
        },
        component: (name, component) => {
            this._component_[name] = component;
        },
        formatter: (name: string, cb) => {
            this._formatter_[name] = cb;
        },
        directive: (name: string, directive) => {
            this._directive_[name] = directive;
        },
        setRenderer: (val) => {
            this._compileTemplate_ = val;
        },
        tag(name: string) {
            HTML_TAG.set(name, 1);
        }
    }

    private _compileTemplate_: any;

    private _plugins_ = [];
    private _component_ = {
        fragment: FragmentComponent
    };
    private _directive_ = {};
    private _formatter_ = {};
}