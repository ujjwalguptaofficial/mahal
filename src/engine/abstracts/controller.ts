import { Util } from "../util";
import { HTML_TAG } from "../enums";
import { ICompiledView } from "../interface";
export class Controller {
    private element: HTMLElement;
    template: string;

    keys = [];
    render() {
        // const view = this.element.innerHTML;
        // for (const key in this) {
        //     this.keys.push(key);
        // }
        const compiled = Util.parseview(this.template);
        console.log("compiled", compiled);
        this.element.appendChild(
            this.createElement(compiled)
        );
    }

    createElement(compiled: ICompiledView) {
        if (compiled.view.ifExp) {
            if ((compiled.view.ifExp as Function)(this)) {
                return document.createComment("");
            }
        }
        const element = document.createElement(compiled.view.tag);
        const renderChild = () => {
            compiled.child.forEach((item, index) => {
                if (item.view) {
                    if (HTML_TAG[item.view.tag]) {
                        element.appendChild(
                            this.createElement(item)
                        )
                    }
                    else {
                        throw "Invalid Component";
                    }
                }
                else {
                    element.appendChild(document.createTextNode(item as any));
                }
            });
        }
        renderChild();
        return element;
    }
}