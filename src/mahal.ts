import { Component } from "./abstracts";
import { initComponent, isObject, executeRender, getDataype, createComponent, promiseResolve, findElement } from "./utils";
import { HTML_TAG } from "./enums";
import { createModelDirective, FragmentComponent, refDirective, eventDirective } from "./ready_made";
import { Logger, setComponentMount } from "./helpers";
import { IElementOption } from "./interface";

export class Mahal {

    component: Component;
    element: HTMLElement;

    global: { [key: string]: any } = {};

    constructor(component: typeof Component, element) {
        this.element = getDataype(element) === 'string' ? findElement(document as any, element) : element;
        if (this.element == null) {
            const defaultId = 'mahal-app';
            let el: HTMLElement = findElement(document as any, defaultId) as HTMLElement;
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
        extendDirective("ref", refDirective);
        extendDirective("on", eventDirective);

        this._createComponent_(component);
    }

    private _createComponent_(component: typeof Component) {
        const comp = this.component = createComponent(component, this);
        const bindWithComp = (method: Function) => {
            return method.bind(comp);
        }
        this.on = bindWithComp(comp.on);
        this.off = bindWithComp(comp.off);
        this.emit = bindWithComp(comp.emit);
    }

    create(option?: IElementOption) {
        let componentInstance: Component = this.component;
        initComponent.call(componentInstance, componentInstance, option);
        const el = executeRender(componentInstance);
        this.element.innerHTML = ``;
        this.element.appendChild(
            el
        );
        setComponentMount(componentInstance, el);
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
            if (process.env.NODE_ENV !== 'production') {
                HTML_TAG.add(name);
            }
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