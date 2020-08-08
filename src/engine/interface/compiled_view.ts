export interface ICompiledView {
    view: {
        tag: String,
        ifExp: String
    },
    child: ICompiledView[]
}