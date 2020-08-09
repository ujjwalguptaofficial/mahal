export interface ICompiledView {
    view: {
        tag: string,
        ifExp: Function | string
    },
    child: ICompiledView[]
}