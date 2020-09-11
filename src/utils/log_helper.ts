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
        console.error("{Taj error}:", this.get());
    }

    logPlainError() {
        console.error("{Taj error}:", this.getPlain());
    }

    logWarning() {
        console.warn("{Taj warn}:", this.get());
    }

    get() {
        return {
            message: this.message,
            type: this.type
        } as IError;
    }

    getPlain() {
        var err = this.get();
        return ` ${err.message}

        type : ${err.type}
        `

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
            case ERROR_TYPE.InvalidEventHandler:
                errMsg = `Invalid event handler for event "${this.info_.eventName}", Handler does not exist in component.`
                break;
            case ERROR_TYPE.InvalidComponent:
                errMsg = `Component "${this.info_.tag}" is not registered. Make sure you have registered component either in parent component or globally.`;
                break;
            case ERROR_TYPE.InvalidFilter:
                errMsg = `Can not find Filter "${this.info_.filter}". Make sure you have registered filter either in component or globally.`;
                break;
            default:
                errMsg = this.message;
                break;
        }
        return errMsg;
    }

    static warn(...args) {
        console.warn("{Taj warn}:", ...args);
    }

    throwPlain() {
        throw "{Taj throw}:" + this.getPlain();
    }
}