export interface ICompiledView {
    view: {
        tag: string,
        ifExp: Function | string,
        events: {
            name: string;
            handler: string;
        }[]
    },
    mustacheExp: Function,
    child: ICompiledView[]
}