import { DATA_TYPE } from "../enums";

export const isObject = (value) => {
    return value != null && typeof value === DATA_TYPE.Object;
};