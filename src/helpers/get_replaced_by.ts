import { nextTick } from "../utils";

export const getReplacedBy = (el) => {
    if (el.replacedBy) {
        const replacedBy = el.replacedBy;
        nextTick(() => {
            el.replacedBy = null;
        })
        return replacedBy;
    }
    return el;
}