import { Util } from "../util";
import { HTML_TAG } from "../enums";
import { ICompiledView } from "../interface";
import { nextTick } from "../helpers";

const blackListProperty = {
    "template": true,
    "element": true,
    "dependency": true
}

interface IDomDependency {

}

export class Controller {
    private element: HTMLElement;
    template: string;

    // keys = [];

    private compiledTemplate: ICompiledView;

    private dependency: { [key: string]: any[] } = {};

    constructor() {
        // this = new Proxy(this, {
        //     set: (obj, prop, value) => {
        //         obj[prop] = value;
        //         console.log("updated");
        //         this.render();
        //         return true;
        //     }
        // });
        this.attachGetterSetter_();
    }

    private attachGetterSetter_() {
        nextTick(() => {
            // call created
            const that = this;
            const cached = {};
            Object.keys(this).forEach(key => {
                if (!blackListProperty[key]) {
                    cached[key] = this[key];
                    Object.defineProperty(this, key, {
                        set(newValue) {
                            cached[key] = newValue;
                            // that.render();
                            that.updateDOM_(key);
                        },
                        get() {
                            return cached[key];
                        }
                    });

                    if (Array.isArray(this[key])) {
                        Object.defineProperty(this[key], "push", {
                            value: function (...args) {
                                let result = Array.prototype.push.apply(this, args);
                                nextTick(() => {
                                    that.onArrayModified_(key, 'push', args[0]);
                                });
                                return result;
                            }
                        });
                    }
                }

            })
            //compile
            this.compiledTemplate = Util.parseview(this.template);
            console.log("compiled", this.compiledTemplate);
            // render
            this.render();
        })
    }

    private onArrayModified_(key: string, method: string, newValue?) {
        for (const prop in this.dependency) {
            if (prop === key) {
                const values = this.dependency[prop].filter(q => q.forExp === true);
                switch (method) {
                    case 'push':
                        values.forEach(item => {
                            const newElement = item.method(newValue, this[key].length - 1);
                            (item.lastEl as HTMLElement).parentNode.insertBefore(newElement, item.lastEl.nextSibling);
                            item.lastEl = newElement;
                        });
                        break;
                }
                console.log("value", values);
                return;
            }
        }
    }


    private updateDOM_(key: string) {
        for (const prop in this.dependency) {
            if (prop === key) {
                const elements = this.dependency[prop];
                elements.forEach(item => {
                    switch (item.nodeType) {
                        // Text Node
                        case 3:
                            item.nodeValue = this[key]; break;
                        // Input node 
                        case 1:
                            (item as HTMLInputElement).value = this[key];
                            break;
                        default:
                            const el = item.method();
                            (item.el as HTMLElement).parentNode.replaceChild(
                                el, item.el
                            )
                            item.el = el;
                    }
                });
                return;
            }
        }
    }

    private storeIfExp_(method: Function, keys: string[]) {
        const el = method();
        keys.forEach(item => {
            this.storeDependency_(item, {
                ifExp: true,
                el: el,
                method: method
            });
        })
        return el;
    }

    private storeForExp_(key, method: Function) {
        const els = this[key].map((item, i) => {
            return method(item, i);
        });
        this.storeDependency_(key, {
            forExp: true,
            method: method,
            lastEl: els[els.length - 1]
        });
        return els;
    }

    render() {
        this.element.innerHTML = '';
        const renderFn = Util.createRenderer(this.compiledTemplate);
        console.log("renderer", renderFn);
        // console.log("result", renderFn.call(this));

        this.element.appendChild(
            renderFn.call(this)
        );
    }


    createTextNode(value, propDependency) {
        const el = document.createTextNode(value);
        if (propDependency) {
            this.storeDependency_(propDependency, el);
        }
        return el;
    }

    private storeDependency_(key: string, value) {
        if (this[key] == null) {
            return;
        }
        if (this.dependency[key] == null) {
            this.dependency[key] = [];
        }
        this.dependency[key].push(value);
    }

    createCommentNode() {
        return document.createComment("");
    }

    createElement(tag, childs: HTMLElement[], option) {
        if (HTML_TAG[tag]) {
            const element = document.createElement(tag) as HTMLElement;
            childs.forEach((item) => {
                element.appendChild(item);
            });
            if (option.on) {
                const events = option.on;
                for (const eventName in events) {
                    element['on' + eventName] = events[eventName].bind(this);
                }
            }
            if (option.attr) {
                const attr = option.attr;
                for (const key in attr) {
                    element.setAttribute(key, attr[key]);
                }
            }
            if (option.dep) {
                option.dep.forEach(item => {
                    if (this.dependency[item] == null) {
                        this.dependency[item] = [];
                    }
                    this.dependency[item].push(element);
                });
            }
            return element;
        }
        else {
            throw "Invalid Component";
        }
    }
}