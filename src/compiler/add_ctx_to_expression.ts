import { stringRegex, jsKeywordRegex, contextString } from "./constant";

export interface IExpression {
    "exp": {
        "left": string
        "op": string
        "right": string
    },
    "op": string
}

function replaceWithContext(value: string) {
    return value.replace(jsKeywordRegex, `${contextString}.$1`)
}

export function addCtxToExpression(expressions: IExpression[]) {
    const keys = [];
    let str = "";
    expressions.forEach(expression => {
        str += replaceWithContext(expression.exp.left);
        keys.push(expression.exp.left);
        if (expression.exp.op != null) {
            str += expression.exp.op;

            if (expression.exp.right != null) {
                if (stringRegex.test(expression.exp.right) === true) {
                    str += expression.exp.right;
                }
                else {
                    str += replaceWithContext(expression.exp.right);
                    keys.push(expression.exp.right);
                }
            }
        }
        if (expression.op) {
            str += expression.op;
        }
    })
    return {
        expStr: str,
        keys
    }
}