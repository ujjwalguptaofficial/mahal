export interface ICompiledView {
    view: {
        tag: string,
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
        events: {
            name: string;
            handler: string;
        }[]
    },
    mustacheExp: string,
    child: ICompiledView[]
}