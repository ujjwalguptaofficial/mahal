import { addRc, createTextNode } from "../helpers";

export interface IRenderContext {
    createTextNode: typeof createTextNode;
    addRc: typeof addRc;
}

