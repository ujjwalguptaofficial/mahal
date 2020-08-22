import { IPropOption } from "../interface";

export function Prop(options?: IPropOption | any) {
    return (target, key: string) => {
        if (!target.$_props) {
            target.$_props = {};
        }
        target.$_props[key] = options;
    }
}