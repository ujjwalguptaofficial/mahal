import { Component } from "mahal";
import { IRenderContext } from "mahal/dist/ts/interface";

export class FragmentComponent extends Component {
    constructor() {
        super();
        this.template = `<slot></slot>`
    }

    render(renderer: IRenderContext): Promise<HTMLElement> {
        const ctx = this;
        const ce = renderer.createElement;
        return ce.call(ctx, 'slot', [], {}) as any;
    }
}