import { IPropOption } from "../interface";
import { getDataype, replaceNullProp } from "../utils";


// tslint:disable-next-line
export const Prop = (options?: IPropOption | any) => {
    return (target, key: string) => {
        const obj = {};
        replaceNullProp(target, '__props__', () => obj);
        if (getDataype(options) === "function") {
            const name = options.name;
            options = name.toLowerCase();
        }
        if (options && !options.type) {
            options = {
                type: options
            };
        }
        target.__props__[key] = options || {};
    };
};