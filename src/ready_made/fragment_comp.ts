import { Component } from "../abstracts/component";
import { IRenderContext } from "../interface";

export class FragmentComponent extends Component {
    constructor() {
        super();
        this.template = `<slot></slot>`;
    }

    render(renderer: IRenderContext) {
        const ce = renderer.createElement;
        return ce.call(this, 'slot', [], {}) as any;
    }
}