import { IPropOption } from "../interface";

export function Prop(options?: IPropOption | any) {
    return (target, key: string) => {
        if (!target.props) {
            target.props = {};
        }
        target.props[key] = options;
    }
}