export interface IDirectiveBinding {
    input: string;
    args: string;
    modifiers: { [name: string]: Boolean }
}