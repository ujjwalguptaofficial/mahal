import { IPropOption } from "../interface";

export function Prop(options?: IPropOption | any) {
    return (target, key: string) => {
        if (!target.props_) {
            target.props_ = {};
        }
        target.props_[key] = options || {};
    }
}