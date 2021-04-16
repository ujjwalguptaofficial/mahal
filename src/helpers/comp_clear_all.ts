import { LIFECYCLE_EVENT } from "../enums";
import { Component } from "../abstracts";
export function clearAll(this: Component) {
    // need to emit before clearing events
    this.emit(LIFECYCLE_EVENT.Destroy).then(_ => {
        // this.storeWatchCb_.forEach(item => {
        //     this.$store.unwatch(item.key, item.cb);
        // });
        this['_eventBus'].destroy();
        this['_watchBus'].destroy();
        if (this['_ob']) {
            this['_ob'].destroy();
        }
        this.element = this['_eventBus'] =
            this['_ob'] =
            this['storeWatchCb_'] = null;
        this['dependency_'] = {};
    });
}
