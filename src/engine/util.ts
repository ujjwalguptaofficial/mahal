import * as parser from '../../build/parser';
import { LogHelper } from './log_helper';
import { ERROR_TYPE } from './enums';
import { ICompiledView } from './interface';

export class Util {
    static parseview(viewCode: string) {
        try {
            viewCode = viewCode.replace(new RegExp('\n', 'g'), '').trim();
            return parser.parse(viewCode) as ICompiledView;
        }
        catch (ex) {
            const err = new LogHelper(ERROR_TYPE.SynTaxError, ex.message).get();
            throw err;
        }
    }
}