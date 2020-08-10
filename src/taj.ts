import { Util } from "./engine/util";
import { ICompiledView } from "./engine/interface";
import { Controller } from "./engine";

export class Taj {
    component: Controller;
    element: HTMLElement;
    private view: string;

    constructor(component, element: HTMLElement) {
        this.component = new component();
        this.element = element;

    }

    create() {
        (this.component as any).element = this.element;
        // this.view = this.element.innerHTML;
        // const compiled = Util.parseview(this.view);
        // console.log("compiled", compiled);
        // this.component.render();
    }

}