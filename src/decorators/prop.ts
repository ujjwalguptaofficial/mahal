import { IPropOption } from "../interface";
import { DATA_TYPE } from "../enums";

export function Prop(options?: IPropOption | any) {
    return (target, key: string) => {
        if (!target.props_) {
            target.props_ = {};
        }
        if (typeof options === DATA_TYPE.Function) {
            const name = options.name;
            if (DATA_TYPE[name]) {
                options = name.toLowerCase()
            }
        }
        if (options && !options.type) {
            options = {
                type: options
            }
        }
        target.props_[key] = options || {};
    }
}