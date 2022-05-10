import { FALSE, TRUE } from "../constant";

export const isPrimitive = (value) => {
    switch (typeof value) {
        case 'undefined':
        case 'object':
            return FALSE;
    }
    return TRUE;
};