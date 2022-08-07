import { COMPONENT_REACTIVES } from "../constant";
import { replaceNullProp } from "../utils";

// tslint:disable-next-line
export const Reactive = (target, key: string) => {
    replaceNullProp(target, COMPONENT_REACTIVES, {});
    target[COMPONENT_REACTIVES][key] = true;
};