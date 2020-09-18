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
    let raw = "";

    function addCtxIfNotString(value: string) {
        if (stringRegex.test(value) === true) {
            str += value;
        }
        else {
            str += replaceWithContext(value);
            keys.push(value.trim());
        }
    }
    if (expressions != null) {

        expressions.forEach(expression => {
            addCtxIfNotString(expression.exp.left);
            raw += expression.exp.left;
            if (expression.exp.op != null) {
                str += expression.exp.op;
                raw += expression.exp.op;
                if (expression.exp.right != null) {
                    addCtxIfNotString(expression.exp.right);
                    raw += expression.exp.right;
                }
            }
            if (expression.op) {
                str += expression.op;
                raw += expression.op;
            }
        })
    }
    else {
        str = null;
    }

    return {
        expStr: str,
        keys,
        // raw: raw === "" ? null : stringRegex.test(raw) === true ? raw : `'${raw}'`
        raw: raw === "" ? null : raw
    }
}