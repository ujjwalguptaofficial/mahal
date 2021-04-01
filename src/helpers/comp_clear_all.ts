import { LIFECYCLE_EVENT } from "../enums";
import { Component } from "../abstracts";
export function clearAll(this: Component) {
    // need to emit before clearing events
    this.emit(LIFECYCLE_EVENT.Destroyed);
    this.element.removeEventListener(LIFECYCLE_EVENT.Destroyed, clearAll);
    // this.storeWatchCb_.forEach(item => {
    //     this.$store.unwatch(item.key, item.cb);
    // });
    this['_eventBus'].destroy();
    this.element = this['_eventBus'] =
        this['_ob'] =
        this['storeWatchCb_'] = null;
    this['dependency_'] = {};
    this['_watchList'] = {};
}
