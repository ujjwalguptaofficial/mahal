export interface IDirectiveBinding {
    input: string;
    isComponent: boolean;
    // list of dependencies 
    props: string[];
    value: any;
    // raw param provided
    params: string[];
    rc?: string[];

}