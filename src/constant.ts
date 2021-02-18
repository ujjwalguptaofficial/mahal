import { getFromWindow } from "./utils";

export const globalFormatter = {
    toS: function (value) {
        switch (typeof value) {
            case 'string':
                return value;
            case 'number':
                return (value as number).toString();
            default:
                return JSON.stringify(value);
        }
    }
}
export const globalComponents = {}
export const globalDirectives = {}
export const plugins = [];
export const defaultSlotName = "default"
