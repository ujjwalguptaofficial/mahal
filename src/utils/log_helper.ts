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
        switch (this.type) {
            case ERROR_TYPE.PropDataTypeMismatch:
                let str = `Expected Data type of property ${this.info_.prop} is ${this.info_.exp} but received ${this.info_.got},`;
                if (this.info_.template) {
                    str += `in template - 
                    ${this.info_.template} 
                    `
                }
                if (this.info_.file) {
                    str += `in file - ${this.info_.file} `
                }
                return str;
            case ERROR_TYPE.SynTaxError:
                return this.info_;
            case ERROR_TYPE.ForExpAsRoot:
                return `For is not allowed in root element. Create a child element instead.`
            case ERROR_TYPE.ForOnPrimitiveOrNull:
                return `For expression can not be run on null or primitive datatype. Initiate variable ${this.info_} as array or object.`
            case ERROR_TYPE.InvalidEventHandler:
                return `Invalid event handler for event "${this.info_.eventName}", Handler does not exist in component.`
            case ERROR_TYPE.InvalidComponent:
                return `Component "${this.info_.tag}" is not registered. Make sure you have registered component either in parent component or globally.`;
            case ERROR_TYPE.InvalidFilter:
                return `Can not find Filter "${this.info_.filter}". Make sure you have registered filter either in component or globally.`;
            default:
                return this.message;
                break;
        }
    }

    static warn(...args) {
        console.warn("{Taj warn}:", ...args);
    }

    throwPlain() {
        throw "{Taj throw}:" + this.getPlain();
    }
}