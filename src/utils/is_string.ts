import { DATA_TYPE } from "../enums";
import { getDataype } from "./get_data_type";

export const isString = (value) => {
    return getDataype(value) === DATA_TYPE.String;
};