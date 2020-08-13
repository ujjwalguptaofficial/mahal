import * as parser from '../../build/parser';
import { LogHelper } from './log_helper';
import { ERROR_TYPE, HTML_TAG } from './enums';
import { ICompiledView } from './interface';

export class Util {
    static parseview(viewCode: string) {
        // try {
        viewCode = viewCode.replace(new RegExp('\n', 'g'), '').trim();
        return parser.parse(viewCode, {
            createFnFromStringExpression: (exp) => {
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
        const ct= ctx.createTextNode;`;
        const createFnFromCompiled = (compiled: ICompiledView) => {
            let str = "";
            if (compiled.view) {
                if (compiled.view.ifExp) {
                    // str+=`compiled.view.ifExp.toString()?`
                    // if (!(compiled.view.ifExp as Function)(this)) {
                    //     return document.createComment("");
                    // }
                }
                if (HTML_TAG[compiled.view.tag]) {
                    str += `ce('${compiled.view.tag}',`
                }
                else {
                    throw "Invalid Component";
                }
                if (compiled.child) {
                    var child = "["
                    compiled.child.forEach((item) => {
                        child += `${createFnFromCompiled(item)},
                        `;
                    });
                    child += "]";
                    str += child + ")";
                }
                else {
                    str += "[])";
                }

                // compiled.view.events.forEach(ev => {
                //     element['on' + ev.name] = this[ev.handler];
                // });
            }
            else if (compiled.mustacheExp) {
                str += `ct(${compiled.mustacheExp.toString()})`;
            }
            else {
                str += `ct('${compiled}')`;
            }
            return str;
        }
        parentStr += `
        return ${createFnFromCompiled(compiledParent)}`;
        // else {
        //     str += `,[]`
        // }
        console.log("renderer", parentStr);
        return new Function(parentStr);
    }
}