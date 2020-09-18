import { parseview } from "./parse_view";
import { LogHelper } from "../utils";
import { ERROR_TYPE } from "../enums";
import { contextString } from "./constant";
import { ICompiledView, IIfExpModified } from "../interface";
import { unique } from "./unique";
import { addCtxToExpression } from "./add_ctx_to_expression";
import { removeCommaFromLast } from "./remove_comma_from_last";
import { convertArrayToString } from "./convert_array_to_comma_seperated_string";
var beautify = require('js-beautify');
export function createRenderer(template: string) {
    const compiledParent = parseview(template);
    console.log("compiled", compiledParent);
    if (compiledParent.view) {
        if (compiledParent.view.forExp) {
            console.error(`Invalid template ${template}`);
            throw new LogHelper(ERROR_TYPE.ForExpAsRoot).get();
        }
    }
    let parentStr = `const ${contextString}= this;`;
    const createJsEqFromCompiled = (compiled: ICompiledView) => {
        let str = "";
        if (compiled.view) {
            const dep = [];
            const handleTag = () => {
                let tagHtml = `ce('${compiled.view.tag}',`
                if (compiled.child) {
                    let ifModifiedExpression: IIfExpModified;
                    let indexOfIfCond;
                    const indexToRemove = [];
                    let isIfCondEndFound = false;
                    const onIfCondEnd = (last: number) => {
                        if (indexOfIfCond == null) {
                            return;
                        }
                        isIfCondEndFound = true;
                        compiled.child[indexOfIfCond].view.ifExpModified = ifModifiedExpression;
                        ifModifiedExpression = null;
                        // console.log("if cond modified", indexOfIfCond, compiled.child[indexOfIfCond]);
                        for (let i = indexOfIfCond + 1; i < last; i++) {
                            indexToRemove.push(i);
                        }
                        indexOfIfCond = null;
                    }
                    compiled.child.forEach((child, index) => {
                        if (!(child.view && child.view.ifExp)) {
                            return onIfCondEnd(index);
                        }
                        const ifExp = child.view.ifExp;
                        if (ifExp.ifCond) {
                            ifModifiedExpression = {
                                ifExp: ifExp.ifCond,
                                ifElseList: []
                            } as IIfExpModified;
                            indexOfIfCond = index;
                        }
                        else if (ifExp.elseIfCond) {
                            ifModifiedExpression.ifElseList.push(child);
                        }
                        else if (ifExp.else) {
                            ifModifiedExpression.else = child;
                            onIfCondEnd(index + 1);
                        }
                        else {
                            onIfCondEnd(index);
                        }
                    });

                    // there was no end found and loop has ended
                    if (ifModifiedExpression && isIfCondEndFound === false) {
                        onIfCondEnd(compiled.child.length);
                    }
                    // console.log("indexOfIfCond", indexToRemove);
                    compiled.child = compiled.child.filter((child, index) => {
                        return indexToRemove.indexOf(index) < 0
                    })

                    var child = "["
                    compiled.child.forEach((item, index) => {
                        const childCompiled = createJsEqFromCompiled(item);
                        if (childCompiled && childCompiled.trim().length > 0) {
                            child += `${childCompiled},`;
                        }
                    });
                    removeCommaFromLast(child);
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
                    const identifierRegex = /\b(?!(?:false|true\b))([a-zA-Z]+)/g
                    compiled.view.events.forEach((ev, index) => {
                        eventStr += `${ev.name}:${ev.handler.replace(identifierRegex, 'ctx.$1')}`;
                        if (index + 1 < eventLength) {
                            eventStr += ","
                        }
                    });
                    optionStr += `on:{${eventStr}}`;
                }

                if (compiled.view.model) {
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

                if (compiled.view.dir) {
                    optionStr += `${optionStr.length > 2 ? "," : ''} dir:{`;
                    for (const dirName in compiled.view.dir) {
                        // optionStr += `${dirName}:{ `
                        const dirBinding = {
                            value: [],
                            props: [],
                            params: []
                        }
                        compiled.view.dir[dirName].forEach(dirValue => {
                            const expressionEvaluation = addCtxToExpression(dirValue);
                            dirBinding.value.push(expressionEvaluation.expStr)
                            dirBinding.props = [...dirBinding.props, ...expressionEvaluation.keys]
                            dirBinding.params.push(expressionEvaluation.raw)
                        })

                        optionStr += `${dirName}:{ 
                                value:()=>{return ${dirBinding.value.length > 1 ? convertArrayToString(dirBinding.value, false) : dirBinding.value} },
                                props:${convertArrayToString(dirBinding.props)},
                                params: ${convertArrayToString(dirBinding.value, false)}
                              },
                            `;

                    }
                    optionStr = removeCommaFromLast(optionStr) + "}";
                    // optionStr += "}"
                }

                if (compiled.view.html) {
                    optionStr += `${optionStr.length > 2 ? "," : ''} html:ctx.${compiled.view.html}`;
                }

                // handle attributes
                const attr = compiled.view.attr;
                const attrLength = attr.length;
                if (attrLength > 0) {
                    let attrString = '';
                    attr.forEach((item, index) => {
                        if (item.isBind) {
                            attrString += `${item.key}:{v:ctx.${item.value},k:'${item.value}'}`;
                        }
                        else {
                            attrString += `${item.key}:{v:'${item.value}'}`;
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
                const { keys } = addCtxToExpression(forExp.value);
                const getRegex = (subStr) => {
                    return new RegExp(subStr, 'g');
                }
                return `...hForE('${keys[0]}',(${forExp.key},${forExp.index})=>{
                            return ${
                    value.replace(getRegex(`ctx.${forExp.key}`), forExp.key).
                        replace(getRegex(`ctx.${forExp.index}`), forExp.index)
                    }
                        },${unique()})
                `
                //return forStr;
            }
            const ifModified = compiled.view.ifExpModified;
            if (ifModified && ifModified.ifExp) {
                let keysAsString = "[";
                (() => {
                    const { expStr, keys } = addCtxToExpression(ifModified.ifExp);
                    keys.forEach((key) => {
                        keysAsString += `'${key}',`
                    });
                    str += `he(()=>{return ${expStr} ? ${handleTag() + handleOption()}`
                })();

                ifModified.ifElseList.forEach(item => {
                    const { expStr, keys } = addCtxToExpression(item.view.ifExp.elseIfCond);
                    keys.forEach((key) => {
                        keysAsString += `'${key}',`
                    });
                    str += `:${expStr} ? ${createJsEqFromCompiled(item)} `
                });

                removeCommaFromLast(keysAsString);
                keysAsString += "]"
                let elseString;
                if (ifModified.else) {
                    elseString = createJsEqFromCompiled(ifModified.else);
                }
                else {
                    elseString = `ce()`;
                }
                str += `:${elseString} },${keysAsString},${unique()})`
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

            let method = `()=>{return ct(`;
            let brackets = "";
            compiled.filters.forEach(item => {
                method += `f('${item}',`
                brackets += ")"
            });
            const { keys, expStr } = addCtxToExpression([{
                op: null,
                exp: {
                    left: compiled.mustacheExp,
                    op: null,
                    right: null
                }
            }]);
            method += `${expStr} ${brackets} )}`;
            str += `he(${method}, ${convertArrayToString(keys)},${unique()})`
        }
        else if ((compiled as any).trim().length > 0) {
            str += `ct('${compiled}')`;
        }
        return str;
    }
    parentStr += `return ${createJsEqFromCompiled(compiledParent)}`;
    parentStr = beautify(parentStr, { indent_size: 4, space_in_empty_paren: true })
    console.log("parentstr", parentStr);
    return new Function('ce', 'ct', 'f', 'he', 'hForE', parentStr);
}