import { DATA_TYPE } from "../enums";
import { isArray } from "./is_array";

export const getDataype = (value) => {
    if (value == null) {
        return DATA_TYPE.Null;
    }
    const type = typeof value;
    switch (type) {
        case DATA_TYPE.Object:
            if (isArray(value)) {
                return "array";
            }
        default:
            return type;
    }
};