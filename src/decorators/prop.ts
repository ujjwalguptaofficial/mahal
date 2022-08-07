import { IPropOption } from "../interface";
import { DATA_TYPE } from "../enums";
import { COMPONENT_PROPS } from "../constant";
import { getDataype, replaceNullProp } from "../utils";


// tslint:disable-next-line
export const Prop = (options?: IPropOption | any) => {
    return (target, key: string) => {
        replaceNullProp(target, COMPONENT_PROPS, {});
        if (getDataype(options) === DATA_TYPE.Function) {
            const name = options.name;
            if (DATA_TYPE[name]) {
                options = name.toLowerCase();
            }
        }
        if (options && !options.type) {
            options = {
                type: options
            };
        }
        target[COMPONENT_PROPS][key] = options || {};
    };
};