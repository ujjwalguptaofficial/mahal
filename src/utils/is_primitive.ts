import { DATA_TYPE } from "../enums";

export const isPrimitive = (value) => {
    switch (typeof value) {
        case 'undefined':
        case DATA_TYPE.Object:
            return false;
    }
    return true;
};