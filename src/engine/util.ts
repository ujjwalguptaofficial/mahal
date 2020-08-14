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
                    let eventStr = "";
                    const eventLength = compiled.view.events.length;
                    compiled.view.events.forEach((ev, index) => {
                        eventStr += `${ev.name}:ctx.${ev.handler}`;
                        if (index + 1 < eventLength) {
                            eventStr += ","
                        }
                    });
                    if (eventStr.length > 0) {
                        optionStr += `on:{${eventStr}}`;
                    }

                    optionStr += "})";
                    return optionStr;
                }

                const handleFor = (value: string) => {
                    let forExp = compiled.view.forExp;
                    const getRegex = (subStr) => {
                        return new RegExp(subStr, 'g');
                    }
                    return `...${forExp.value}.map((${forExp.key})=>{
                                
                                return ${value.replace(getRegex(`ctx.${forExp.key}`), forExp.key)}
                            })
                    `
                    //return forStr;
                }

                if (compiled.view.ifExp) {
                    if (compiled.view.ifExp.ifCond || compiled.view.ifExp.elseIfCond) {
                        str += `${compiled.view.ifExp}?${handleTag() + handleOption()}:cc()`
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