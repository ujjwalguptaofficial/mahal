import { Component } from "mahal";
import { IRenderContext } from "mahal/dist/ts/interface";

export class FragmentComponent extends Component {
    constructor() {
        super();
        this.template = `<slot></slot>`
    }

    render(renderer: IRenderContext): HTMLElement {
        const ctx = this;
        const ce = this['_createEl_'];
        return ce.call(ctx, 'slot', [], {}) as any;
    }
}