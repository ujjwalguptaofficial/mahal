import { addRc, createElement, createTextNode } from "../helpers";

export interface IRenderContext {
    createTextNode: typeof createTextNode;
    addRc: typeof addRc;
    createTextNodeWithRc: Function;
    handleExpWithRc: Function;
    createEl: typeof createElement;
    children?: HTMLElement[];
}

