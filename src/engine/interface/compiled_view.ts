export interface ICompiledView {
    view: {
        tag: string,
        ifExp: string
    },
    child: ICompiledView[]
}