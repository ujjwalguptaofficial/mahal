import { Util } from "../util";
import { HTML_TAG } from "../enums";
import { IRenderInput } from "../interface";

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
        compiled(this, this.createElement);

    }

    createElement(compiled: IRenderInput) {
        const element = document.createElement(compiled.tag);
        const renderChild = () => {
            compiled.child.forEach((item, index) => {
                if (item.tag) {
                    if (HTML_TAG[item.tag]) {
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