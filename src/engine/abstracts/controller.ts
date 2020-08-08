import { Util } from "../util";

export class Controller {
    element: HTMLElement;
    template: string;
    render() {
        // const view = this.element.innerHTML;
        const compiled = Util.parseview(this.template);
        console.log("compiled", compiled);
        this.element.innerHTML = `<${compiled.view.tag}></${compiled.view.tag}>`;
    }
}