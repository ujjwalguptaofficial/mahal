import { isArray } from "./is_array";

export const getDataype = (value) => {
    if (value == null) {
        return "null";
    }
    const type = typeof value;
    switch (type) {
        case "object":
            if (isArray(value)) {
                return "array";
            }
        default:
            return type;
    }
};