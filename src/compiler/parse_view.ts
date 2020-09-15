import * as parser from '../../build/parser';
import { ERROR_TYPE } from '../enums';
import { LogHelper } from '../utils';
import { ICompiledView } from '../interface';

export function parseview(viewCode: string) {
    try {
        // viewCode = viewCode.replace(new RegExp('\n', 'g'), '').trim();
        viewCode = viewCode.trim();
        return parser.parse(viewCode) as ICompiledView;
    }
    catch (ex) {
        const location = ex.location;
        const css = `background: #222; color: #bada55`;
        const lines = viewCode.split("\n");
        // console.log(`%c${viewCode.substring(0, location.start.offset)}%c${viewCode.substring(location.start.offset, location.end.offset + 1)}%c${viewCode.substring(location.end.offset + 1)}`,
        //     css, css + ';color:red', css);
        // do not remove this
        console.log("%c" + lines.slice(0, location.start.line - 1).join("\n") +
            "%c" + lines.slice(location.start.line - 1, location.end.line).join("\n") +
            "%c" + lines.slice(location.end.line).join("\n")
            , css, css + ';color:#ff0000', css);
        const err = new LogHelper(ERROR_TYPE.SynTaxError, ex.message).getPlain();
        throw err;
    }
}