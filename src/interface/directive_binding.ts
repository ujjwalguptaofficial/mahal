export interface IDirectiveBinding {
    input: string;
    isComponent: Boolean,
    // list of dependencies 
    props: string[],
    value: any;
    // raw param provided
    params: string[]

}