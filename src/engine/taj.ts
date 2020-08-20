import { ParserUtil } from "./parser_util";
import { ICompiledView } from "./interface";
import { Component } from "./abstracts";

export class Taj {
    component: Component;
    element: HTMLElement;

    constructor(component, element: HTMLElement) {
        this.component = new component();
        this.element = element;

    }

    create() {
        (this.component as any).element = this.element;
    }

}