import { Directive } from "../abstracts";
export class ShowDirective extends Directive {

    el: HTMLElement;

    created(el: HTMLElement, binding, value) {
        this.el = el;
        this.setElementShowHide(value);
    }

    valueUpdated(value) {
        this.setElementShowHide(value);
    }

    setElementShowHide(value) {
        this.el.style.display = value ? 'unset' : 'none';
    }
}