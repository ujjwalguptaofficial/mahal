import { Directive } from "../abstracts";
export class ModelDirective extends Directive {

    component;
    el: HTMLInputElement;
    isSetBySelf = false;

    constructor(component) {
        super();
        this.component = component;
    }

    created(el: HTMLInputElement, binding) {
        this.el = el;
        el.oninput = (event) => {
            // this.isSetBySelf = true;
            this.component[binding.input] = (event.target as any).value;
        };
    }

    valueUpdated(value) {
        // if (this.isSetBySelf === true) {
        this.el.value = value;
        // }
        // this.isSetBySelf = false;
    }
}