export interface ICompiledRawView {
    view: {
        tag: string,
        ifExp: string
    },
    child: ICompiledRawView[]
}