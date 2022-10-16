export interface IAttrItem {
    v: string | Function;
}
export interface IReactiveAttrItem extends IAttrItem {
    k: string[];
    m?: boolean;
    rc?: string;
}