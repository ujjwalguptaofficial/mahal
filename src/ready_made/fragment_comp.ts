import { Component } from "../abstracts/component";
import { createElement } from "../helpers";

export class FragmentComponent extends Component {
    render() {
        return createElement.call(this, 'slot', []) as any;
    }
}