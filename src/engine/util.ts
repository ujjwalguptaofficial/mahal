import * as parser from '../../build/parser';
import { LogHelper } from './log_helper';
import { ERROR_TYPE } from './enums';
import { ICompiledView } from './interface';

export class Util {
    static parseview(viewCode: string) {
        // try {
        viewCode = viewCode.replace(new RegExp('\n', 'g'), '').trim();
        return parser.parse(viewCode, {
            createFnFromStringExpression: (exp) => {
                return new Function('ctx', "return " + exp.split(" ").map(item => {
                    switch (item) {
                        case '&&':
                        case '||':
                        case 'true':
                        case 'false': return item;
                        default: return "ctx." + item;
                    }
                }).join(" "));
            }
        }) as ICompiledView;
        // }
        // catch (ex) {
        //     const err = new LogHelper(ERROR_TYPE.SynTaxError, ex.message).get();
        //     throw err;
        // }
    }
}