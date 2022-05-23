import { IError } from "../interface";
import { ERROR_TYPE } from "../enums";

const libName = "Mahal";

const newLine = "\n\n";

export class Logger implements IError {
    type: ERROR_TYPE;
    msg: string;
    private info_: any;

    constructor(type: ERROR_TYPE, info?: any) {
        this.type = type;
        this.info_ = info;
        this.msg = this.getMsg_();
    }

    logError() {
        Logger.error(this.get());
    }

    logPlainError() {
        Logger.error(this.getPlain());
    }

    logWarning() {
        Logger.warn(this.get());
    }

    get() {
        return {
            msg: this.msg,
            type: this.type
        } as IError;
    }

    getPlain() {
        const err = this.get();
        return ` ${err.msg}${newLine}type : ${err.type}`;
    }

    private getMsg_() {
        const info = this.info_;
        switch (this.type) {
            case ERROR_TYPE.PropDataTypeMismatch:
                let str = `Expected Data type of property ${this.info_.prop} is ${this.info_.exp} but received ${this.info_.got}.${newLine}`;
                if (this.info_.template) {
                    str += `in template -${newLine}"${this.info_.html}"${newLine}`;
                }
                if (this.info_.file) {
                    str += `in file - ${this.info_.file} `;
                }
                return str;
            case ERROR_TYPE.SynTaxError:
                return this.info_;
            case ERROR_TYPE.ForExpAsRoot:
                return `For is not allowed in root element. Create a child element instead.`;
            case ERROR_TYPE.ForOnPrimitiveOrNull:
                return `For expression can not be run on null or primitive datatype. Initiate variable ${this.info_} as array or object.`;
            case ERROR_TYPE.InvalidEventHandler:
                return `Invalid event handler for event "${this.info_.ev}", Handler does not exist in component.`;
            case ERROR_TYPE.InvalidComponent:
                return `Component "${this.info_.tag}" is not registered. Make sure you have registered component either in parent component or globally.`;
            case ERROR_TYPE.InvalidFormatter:
                return `Can not find Formatter "${this.info_.formatter}". Make sure you have registered formatter either in component or globally.`;
            case ERROR_TYPE.MutatingProp:
                return `Do not mutate prop "${this.info_.key}" directly. Instead use a reactive property.`
                    + newLine + `found in -` + newLine +
                    `${this.info_.html}`;
            case ERROR_TYPE.SetSameValue:
                return `Component won't be updated, because of old value and new value are same for state - ${info.key}.`;
            default:
                return this.msg;
        }
    }

    static warn(...args) {
        console.warn(`{${libName} warn}:`, ...args);
    }

    static error(...args) {
        if (args[0] === "return") {

        }
        console.error(`{${libName} error}:`, ...args);
    }

    throwPlain(shouldReturn?) {
        const err = `{${libName} throw}:` + this.getPlain();
        if (shouldReturn) {
            return err;
        }
        throw err;
    }


}