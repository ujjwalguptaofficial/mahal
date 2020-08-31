import { IError } from "../interface";
import { ERROR_TYPE } from "../enums";
import { Config } from "../config";

export class LogHelper implements IError {
    type: ERROR_TYPE;
    message: string;
    private info_: any;

    constructor(type: ERROR_TYPE, info?: any) {
        this.type = type;
        this.info_ = info;
        this.message = this.getMsg_();
    }

    logError() {
        console.error(this.get());
    }

    logWarning() {
        console.warn(this.get());
    }

    get() {
        return {
            message: this.message,
            type: this.type
        } as IError;
    }

    getPlain() {
        var err = this.get(), str = ""
        for (const key in err) {
            str += `'${key}' : ${err[key]} `;
        }
        return str;
    }

    private getMsg_() {
        let errMsg: string;
        switch (this.type) {
            case ERROR_TYPE.SynTaxError:
                errMsg = this.info_;
                break;
            case ERROR_TYPE.ForExpAsRoot:
                errMsg = `For is not allowed in root element. Create a child element instead.`
                break;
            case ERROR_TYPE.ForOnPrimitiveOrNull:
                errMsg = `For expression can not be run on null or primitive datatype. Initiate variable ${this.info_} as array or object.`
                break;
            default:
                errMsg = this.message;
                break;
        }
        return errMsg;
    }

    static warn(...args) {
        console.warn(...args);
    }
}