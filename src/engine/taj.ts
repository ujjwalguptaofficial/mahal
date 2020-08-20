import { ParserUtil } from "./parser_util";
import { ICompiledView } from "./interface";
import { Component } from "./abstracts";

export class Taj {
    component: typeof Component;
    element: HTMLElement;

    constructor(component, element: HTMLElement) {
        this.component = component;
        this.element = element;
    }

    create() {
        const component: Component = new (this as any).component();
        this.element.appendChild(
            component.executeRender_()
        );
    }

}