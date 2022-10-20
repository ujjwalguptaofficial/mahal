import { addRc, createElement, createTextNode } from "../helpers";

export interface IRenderContext {
    createTextNode: typeof createTextNode;
    addRc: typeof addRc;
    createTextNodeWithRc: Function;
    handleExpWithRc: Function;
    handleForExpWithRc: Function;
    createEl: typeof createElement;
}

