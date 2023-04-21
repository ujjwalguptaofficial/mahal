import { IPropOption } from "../interface";
import { getDataype, replaceNullProp } from "../utils";


// tslint:disable-next-line
// export const prop = (options?: IPropOption | any) => {
export function prop(target, key: string): void;
export function prop(options?: IPropOption | any): Function;
export function prop(...args) {
    if (args.length >= 2) {
        const [target, propertyName] = args;
        createProp(target, propertyName, null);
        return;
    }
    return (target, key: string) => {
        createProp(target, key, args[0]);
    };

};

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