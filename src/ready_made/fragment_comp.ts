import { Component } from "../abstracts/component";
import { createElement } from "../helpers";

export class FragmentComponent extends Component {
    constructor() {
        super();
        this.template = `<slot></slot>`;
    }

    render() {
        return createElement.call(this, 'slot', [], {}) as any;
    }
}