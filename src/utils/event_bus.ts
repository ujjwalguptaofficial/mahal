export class EventBus {

    constructor(ctx?) {
        this.ctx_ = ctx;
    }

    private ctx_;

    private events_: {
        [key: string]: Function[]
    } = {};

    on(event: string, cb: Function) {
        if (this.events_[event] == null) {
            this.events_[event] = [];
        }
        this.events_[event].push(cb);
        return this;
    }

    off(event: string, cb: Function) {
        if (this.events_[event]) {
            if (cb) {
                const index = this.events_[event].indexOf(cb);
                this.events_[event].splice(index, 1);
            }
            else {
                this.events_[event] = [];
            }
        }
    }

    emit(event: string, data?: any) {
        if (this.events_[event]) {
            return Promise.all(
                this.events_[event].map(cb => {
                    const result = cb.call(this.ctx_, data);
                    return result && result.then ? result : Promise.resolve(result);
                })
            );
        }
    }

    destroy() {
        this.events_ = null;
    }
}