import { Util } from "../util";
import { HTML_TAG } from "../enums";
import { ICompiledView } from "../interface";

const blackListProperty = {
    "template": true,
    "element": true
}

export class Controller {
    private element: HTMLElement;
    template: string;

    keys = [];

    private compiledTemplate: ICompiledView;

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
                            that.render();
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

    render() {
        this.element.innerHTML = '';
        const renderFn = Util.createRenderer(this.compiledTemplate);
        console.log("renderer", renderFn);
        // console.log("result", renderFn.call(this));
        this.element.appendChild(
            renderFn.call(this)
        );
    }


    createTextNode(value) {
        return document.createTextNode(value);
    }

    createElement(tag, childs: HTMLElement[]) {
        const element = document.createElement(tag);
        childs.forEach((item) => {
            element.appendChild(item);
        });
        return element;
    }

    // createElement(compiled: ICompiledView) {

    //     let element;
    //     if (compiled.view) {
    //         if (compiled.view.ifExp) {
    //             if (!(compiled.view.ifExp as Function)(this)) {
    //                 return document.createComment("");
    //             }
    //         }
    //         if (HTML_TAG[compiled.view.tag]) {
    //             element = document.createElement(compiled.view.tag);
    //         }
    //         else {
    //             throw "Invalid Component";
    //         }

    //         compiled.view.events.forEach(ev => {
    //             element['on' + ev.name] = this[ev.handler];
    //         });
    //     }
    //     else if (compiled.mustacheExp) {
    //         element = document.createTextNode(compiled.mustacheExp(this));
    //     }
    //     else {
    //         element = document.createTextNode(compiled as any);
    //     }
    //     if (compiled.child) {
    //         compiled.child.forEach((item) => {
    //             element.appendChild(this.createElement(item));
    //         });
    //     }
    //     return element;
    // }
}