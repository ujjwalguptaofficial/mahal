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
    function addCtxIfNotString(value: string) {
        if (stringRegex.test(value) === true) {
            str += value;
        }
        else {
            str += replaceWithContext(value);
            keys.push(value.trim());
        }
    }
    expressions.forEach(expression => {
        addCtxIfNotString(expression.exp.left);
        if (expression.exp.op != null) {
            str += expression.exp.op;

            if (expression.exp.right != null) {
                addCtxIfNotString(expression.exp.right);
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