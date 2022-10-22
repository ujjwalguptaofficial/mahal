export interface IAttrItem {
    v: any;
}
export interface IReactiveAttrItem extends IAttrItem {
    k: string[];
    m?: boolean;
    rc?: string[];
}