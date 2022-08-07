import { createElement, createTextNode, handleExpression } from "../helpers";

export interface IRenderContext {
    createElement: typeof createElement;
    createTextNode: typeof createTextNode;
    format: (value: any) => any;
    runExp: typeof handleExpression;
    children: Array<HTMLElement>;
}

