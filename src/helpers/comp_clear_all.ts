import { LIFECYCLE_EVENT } from "../enums";
import { Component } from "../abstracts";
export function clearAll(this: Component) {
    // need to emit before clearing events
    this.emit(LIFECYCLE_EVENT.Destroy).then(_ => {
        this['__eventBus__'].destroy();
        this['__watchBus__'].destroy();
        if (this['__ob__']) {
            this['__ob__'].destroy();
        }
        this.element = this['__eventBus__'] =
            this['__ob__'] = null;
    });
}
