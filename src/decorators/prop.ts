import { IPropOption } from "../interface";
import { getDataype, replaceNullProp } from "../utils";
import { wrapMethodDecorator } from "./wrap_method_decorator";

// tslint:disable-next-line
export function prop(target, key: string): void;
export function prop(options?: IPropOption | any): Function;
export function prop(...args) {
    return wrapMethodDecorator(args, createProp);
}

function createProp(target, key: string, options) {
    const obj = {};
    replaceNullProp(target, '_props_', () => obj);
    if (getDataype(options) === "function") {
        const name = options.name;
        options = name.toLowerCase();
    }
    if (options && !options.type) {
        options = {
            type: options
        };
    }
    target._props_[key] = options || {};
}


