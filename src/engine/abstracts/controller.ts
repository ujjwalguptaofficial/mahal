import { Util } from "../util";
import { HTML_TAG } from "../enums";
import { ICompiledView } from "../interface";

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

    private dependency: { [key: string]: HTMLElement[] } = {};

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
        queueMicrotask(() => {
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
                    })
                }

            })
            //compile
            this.compiledTemplate = Util.parseview(this.template);
            console.log("compiled", this.compiledTemplate);
            // render
            this.render();
        })
    }

    private updateDOM_(key: string) {
        for (const prop in this.dependency) {
            if (prop === key) {
                const elements = this.dependency[prop];
                elements.forEach(el => {
                    switch (el.nodeType) {
                        // Text Node
                        case 3:
                            el.nodeValue = this[key]; break;
                        default:
                            (el as HTMLInputElement).value = this[key];
                    }
                });
                return;
            }
        }
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
            if (this.dependency[propDependency] == null) {
                this.dependency[propDependency] = [el as any];
            }
            else {
                this.dependency[propDependency].push(el as any);
            }
        }
        return el;
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
                    element['on' + eventName] = events[eventName];
                }
            }
            if (option.attr) {
                const attr = option.attr;
                for (const key in attr) {
                    element.setAttribute(key, attr[key]);
                }
            }
            return element;
        }
        else {
            throw "Invalid Component";
        }
    }
}