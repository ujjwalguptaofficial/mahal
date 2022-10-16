import { IReactiveAttrItem } from "../interface";

export const getAttributeValue = (value: IReactiveAttrItem, valueToSet) => {
    const attrValue = value.v as any;
    return attrValue;
    // return value.m ? attrValue() : valueToSet;
};