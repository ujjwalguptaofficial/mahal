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
        const prodErrors = {
            [ERROR_TYPE.PropDataTypeMismatch]() {
                let str = `Expected Data type of property ${info.prop} is ${info.exp} but received ${info.got}.${newLine}`;
                if (info.template) {
                    str += `in template -${newLine}"${info.html}"${newLine}`;
                }
                if (info.file) {
                    str += `in file - ${info.file} `;
                }
                return str;
            },
            [ERROR_TYPE.InvalidComponent]() {
                return `Component "${info.tag}" is not registered. Make sure you have registered component either in parent component or globally.`;
            },
            [ERROR_TYPE.InvalidFormatter]() {
                return `Can not find Formatter "${info.formatter}". Make sure you have registered formatter either in component or globally.`;
            },
        };

        if (process.env.NODE_ENV !== 'production') {
            const devErrors = {
                [ERROR_TYPE.ForOnPrimitiveOrNull]() {
                    return `For expression can not be run on null or primitive datatype. Initiate variable ${info} as array or object.`;
                },
                [ERROR_TYPE.InvalidEventHandler]() {
                    return `Invalid event handler for event "${info.ev}", Handler does not exist in component.`;
                },
                [ERROR_TYPE.SetSameValue]() {
                    return `Component won't be updated, because of old value and new value are same for state - ${info.key}.`;
                },
                [ERROR_TYPE.MutatingProp]() {
                    return `Do not mutate prop "${info.key}" directly. Instead use a reactive property.`
                        + newLine + `found in -` + newLine +
                        `${info.html}`;
                }
            };
            Object.assign(prodErrors, devErrors);
        }
        const method = prodErrors[this.type];
        return method ? method(this) : this.msg;
    }

    static warn(...args) {
        console.warn(`{${libName} warn}:`, ...args);
    }

    static error(...args) {
        // if (args[0] === "return") {

        // }
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