import { getObjectKeys } from "./get_object_keys";

export const getObjectLength = (value) => {
    return value.length || getObjectKeys(value).length;
};