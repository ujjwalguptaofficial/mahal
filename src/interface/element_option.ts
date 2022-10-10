import { IAttrItem, IReactiveAttrItem } from "./attr_item";
import { IDirectiveBinding } from "./directive_binding";

export interface IElementOption {
    attr?: { [attrName: string]: IAttrItem };
    rAttr?: { [attrName: string]: IReactiveAttrItem };
    rcm?: Function;
    on?: {
        [eventName: string]: Function
    };
    dir?: {
        [directiveName: string]: IDirectiveBinding
    };
}