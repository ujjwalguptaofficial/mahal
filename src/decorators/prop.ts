import { IPropOption } from "../interface";
import { getDataype, replaceNullProp } from "../utils";


// tslint:disable-next-line
export const prop = (options?: IPropOption | any) => {
    return (target, key: string) => {
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
    };
};