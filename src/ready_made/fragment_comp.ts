import { Component } from "../abstracts/component";

export class FragmentComponent extends Component {
    constructor() {
        super();
        this.template = `<slot></slot>`
    }
}