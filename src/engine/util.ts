import * as parser from '../../build/parser';
import { LogHelper } from './log_helper';
import { ERROR_TYPE, HTML_TAG } from './enums';
import { ICompiledView } from './interface';
import prettier from "prettier";

export class Util {

    static createFnFromStringExpression(exp) {
        return exp.split(" ").map(item => {
            switch (item) {
                case '&&':
                case '||':
                case 'true':
                case 'false': return item;
                default: return "ctx." + item;
            }
        }).join(" ");
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
        const ce= ctx.createElement;
        const ct= ctx.createTextNode;
        const cc= ctx.createCommentNode;
        `;
        const createFnFromCompiled = (compiled: ICompiledView) => {
            let str = "";
            if (compiled.view) {
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
                        compiled.view.events.forEach((ev, index) => {
                            eventStr += `${ev.name}:ctx.${ev.handler}`;
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
                            value: compiled.view.model
                        })
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
                    optionStr += "})";
                    return optionStr;
                }

                const handleFor = (value: string) => {
                    let forExp = compiled.view.forExp;
                    forExp.value = Util.createFnFromStringExpression(forExp.value);
                    const getRegex = (subStr) => {
                        return new RegExp(subStr, 'g');
                    }
                    return `...${forExp.value}.map((${forExp.key},${forExp.index})=>{
                                
                                return ${
                        value.replace(getRegex(`ctx.${forExp.key}`), forExp.key).
                            replace(getRegex(`ctx.${forExp.index}`), forExp.index)
                        }
                            })
                    `
                    //return forStr;
                }

                if (compiled.view.ifExp) {
                    const ifExp = compiled.view.ifExp;
                    const ifCond = Util.createFnFromStringExpression(ifExp.ifCond);
                    if (ifCond || ifExp.elseIfCond) {
                        str += `${ifCond}?${handleTag() + handleOption()}:cc()`
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
                str += `ct(${Util.createFnFromStringExpression(compiled.mustacheExp)})`;
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