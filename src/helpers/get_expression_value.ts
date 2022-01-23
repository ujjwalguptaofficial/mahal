import { IAttrItem } from "../interface";

export const getAttributeValue = (value: IAttrItem, valueToSet) => {
    const attrValue = value.v as any;
    return value.m ? attrValue() : valueToSet;
}