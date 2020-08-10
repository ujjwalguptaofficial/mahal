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
        this.element.appendChild(
            this.createElement(this.compiledTemplate)
        );
    }

    createElement(compiled: ICompiledView) {
        if (compiled.view.ifExp) {
            if (!(compiled.view.ifExp as Function)(this)) {
                return document.createComment("");
            }
        }
        const element = document.createElement(compiled.view.tag);
        const listenToEvents = (events) => {
            events.forEach(ev => {
                element['on' + ev.name] = this[ev.handler];
            });
        };
        const renderChild = () => {
            compiled.child.forEach((item, index) => {
                if (item.view) {
                    if (HTML_TAG[item.view.tag]) {
                        element.appendChild(
                            this.createElement(item)
                        )
                        listenToEvents(item.view.events);
                    }
                    else {
                        throw "Invalid Component";
                    }

                }
                else if (item.mustacheExp) {
                    element.appendChild(document.createTextNode(item.mustacheExp(this)));
                }
                else {
                    element.appendChild(document.createTextNode(item as any));
                }
            });
        }
        listenToEvents(compiled.view.events);
        renderChild();
        return element;
    }
}