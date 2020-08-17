import * as parser from '../../build/parser';
import { LogHelper } from './log_helper';
import { ERROR_TYPE, HTML_TAG } from './enums';
import { ICompiledView } from './interface';
import prettier from "prettier";

export class Util {

    static createFnFromStringExpression(exp, cb?) {
        const keys = [];
        const modifiedExpression = exp.split(" ").map(item => {
            switch (item) {
                case '&&':
                case '||':
                case 'true':
                case 'false': return item;
                default: keys.push(item); return "ctx." + item;
            }
        }).join(" ");
        if (cb) {
            cb(keys);
        }
        return modifiedExpression;
    }

    static parseview(viewCode: string) {
        // try {
        viewCode = viewCode.replace(new RegExp('\n', 'g'), '').trim();
        return parser.parse(viewCode, {
            createFnFromStringExpression: Util.createFnFromStringExpression
        }) as ICompiledView;
        // }
        // catch (ex) {
        //     const err = new LogHelper(ERROR_TYPE.SynTaxError, ex.message).get();
        //     throw err;
        // }
    }

    static createRenderer(compiledParent: ICompiledView) {
        let parentStr = `const ctx= this; 
        const ce= ctx.createElement.bind(ctx);
        const ct= ctx.createTextNode.bind(ctx);
        const cc= ctx.createCommentNode;
        const sife= ctx.storeIfExp_.bind(ctx);
        const sfore= ctx.storeForExp_.bind(ctx);
        const unique= ctx.unique;
        `;
        const createFnFromCompiled = (compiled: ICompiledView) => {
            let str = "";
            if (compiled.view) {
                const dep = [];
                const handleTag = () => {
                    let tagHtml = `ce('${compiled.view.tag}',`
                    if (compiled.child) {
                        var child = "["
                        compiled.child.forEach((item) => {
                            child += `  ${createFnFromCompiled(item)},
                            `;
                        });
                        child += "]";
                        tagHtml += child;
                    }
                    else {
                        tagHtml += "[]";
                    }
                    return tagHtml;
                }

                const handleOption = () => {
                    let optionStr = ",{";

                    // handle event
                    const eventLength = compiled.view.events.length;
                    if (eventLength > 0) {
                        let eventStr = "";
                        // const identifierRegex = /([a-zA-Z]+)/g
                        // const identifierRegex = /\b(?!(?:false\b))([\w]+)/g
                        const identifierRegex = /\b(?!(?:false\b))([a-zA-Z]+)/g
                        compiled.view.events.forEach((ev, index) => {
                            eventStr += `${ev.name}:${ev.handler.replace(identifierRegex, 'ctx.$1')}`;
                            if (index + 1 < eventLength) {
                                eventStr += ","
                            }
                        });
                        optionStr += `on:{${eventStr}}`;
                    }
                    else if (compiled.view.model) {
                        optionStr += `on:{input:(e)=>{
                            ctx.${compiled.view.model}= e.target.value;
                        }}`;
                        compiled.view.attr.push({
                            isBind: true,
                            key: 'value',
                            value: compiled.view.model,
                        })
                        dep.push(compiled.view.model);
                    }


                    // handle attributes
                    const attr = compiled.view.attr;
                    const attrLength = attr.length;
                    if (attrLength > 0) {
                        let attrString = '';
                        attr.forEach((item, index) => {
                            if (item.isBind) {
                                attrString += `${item.key}:ctx.${item.value}`;
                            }
                            else {
                                attrString += `${item.key}:'${item.value}'`;
                            }
                            if (index + 1 < attrLength) {
                                attrString += ","
                            }
                        });

                        optionStr += `${optionStr.length > 2 ? "," : ''} attr:{${attrString}}`;
                    }

                    // handle dep
                    const depLength = dep.length;
                    if (depLength > 0) {
                        let depString = "["
                        dep.forEach((item, index) => {
                            depString += `'${item}'`;
                            if (index + 1 < depLength) {
                                depString += ","
                            }
                        });
                        depString += "]"
                        optionStr += `${optionStr.length > 2 ? "," : ''} dep:${depString}`;
                    }

                    optionStr += "})";
                    return optionStr;
                }

                const handleFor = (value: string) => {
                    let forExp = compiled.view.forExp;
                    let key;
                    forExp.value = Util.createFnFromStringExpression(forExp.value, (param) => {
                        key = param[0];
                    });
                    const getRegex = (subStr) => {
                        return new RegExp(subStr, 'g');
                    }
                    return `...sfore('${key}',(${forExp.key},${forExp.index})=>{
                                return ${
                        value.replace(getRegex(`ctx.${forExp.key}`), forExp.key).
                            replace(getRegex(`ctx.${forExp.index}`), forExp.index)
                        }
                            },unique)
                    `
                    //return forStr;
                }

                if (compiled.view.ifExp) {
                    const ifExp = compiled.view.ifExp;
                    let keys = "["
                    const ifCond = Util.createFnFromStringExpression(ifExp.ifCond, (param) => {
                        param.forEach((key, index) => {
                            keys += `'${key}',`
                        });
                        keys += "]"
                    });
                    if (ifCond || ifExp.elseIfCond) {
                        str += `sife(()=>{return ${ifCond} }, (ifCond)=>{return ifCond?${handleTag() + handleOption()}:cc()},${keys},unique)`
                    }
                }
                else {
                    if (compiled.view.forExp) {
                        str += handleFor(handleTag() + handleOption())
                    }
                    else {
                        str += handleTag() + handleOption()
                    }
                }
            }
            else if (compiled.mustacheExp) {
                str += `ct(${Util.createFnFromStringExpression(compiled.mustacheExp)},'${compiled.mustacheExp}')`;
            }
            else {
                str += `ct('${compiled}')`;
            }
            return str;
        }
        parentStr += `return ${createFnFromCompiled(compiledParent)}`;
        // parentStr = prettier.format(
        //     parentStr,
        //     { semi: false, parser: "typescript" }
        // )
        // else {
        //     str += `,[]`
        // }
        console.log("renderer", parentStr);
        return new Function(parentStr);
    }
}