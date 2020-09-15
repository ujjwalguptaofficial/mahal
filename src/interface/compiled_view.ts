import { IExpression } from "../compiler/add_ctx_to_expression";
export interface IIfExpModified {
    ifExp: IExpression[];
    ifElseList: ICompiledView[];
    else: ICompiledView;
}
export interface ICompiledView {
    view: {
        tag: string,
        ifExpModified: IIfExpModified,
        ifExp: {
            ifCond: IExpression[];
            elseIfCond: IExpression[];
            else: boolean;
        },
        forExp: {
            key: string;
            value: IExpression[];
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
        }[],
        dir: {
            [name: string]: string
        }
    },
    mustacheExp: string,
    child: ICompiledView[]
    filters: string[];
}