export interface IAttrItem {
    v: string;
}
export interface IReactiveAttrItem extends IAttrItem {
    k: string[];
    m?: boolean;
    rc?: string;
}