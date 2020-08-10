export interface ICompiledView {
    view: {
        tag: string,
        ifExp: Function | string,
    },
    mustacheExp: Function,
    child: ICompiledView[]
}