export interface IIfExpModified {
    ifExp: string;
    ifElseList: ICompiledView[];
    else: ICompiledView;
}
export interface ICompiledView {
    view: {
        tag: string,
        ifExpModified: IIfExpModified,
        ifExp: {
            ifCond: string;
            elseIfCond: string;
            else: string;
        },
        forExp: {
            key: string;
            value: string;
            index: string;
        },
        attr: {
            key: string,
            value: string,
            isBind: Boolean
        }[],
        model: string,
        html: string,
        events: {
            name: string;
            handler: string;
        }[]
    },
    mustacheExp: string,
    child: ICompiledView[]
    filters: string[];
}