import * as parser from '../../build/parser';
import { LogHelper } from './log_helper';
import { ERROR_TYPE } from './enums';
import { IRenderInput } from './interface';

export class Util {
    static parseview(viewCode: string) {
        try {
            viewCode = viewCode.replace(new RegExp('\n', 'g'), '').trim();
            return parser.parse(viewCode) as Function;
        }
        catch (ex) {
            console.error("ex", ex);
            const err = new LogHelper(ERROR_TYPE.SynTaxError, ex.message).get();
            throw err;
        }
    }
}