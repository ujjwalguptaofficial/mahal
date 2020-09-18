export interface IDirectiveBinding {
    input: string;
    args: string;
    modifiers: { [name: string]: Boolean };
    isComponent: Boolean,
    props: string[],
    value: any

}