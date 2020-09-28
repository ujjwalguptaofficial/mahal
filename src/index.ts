import { defaultExport } from "./default";
import { modelDirective, showDirective, classDirective } from "./ready_made";
import { App } from "./app";

export * from "./abstracts";
export * from "./decorators"
export * from "./utils";
export * from "./app";

App.addDirective("model", modelDirective);
App.addDirective("show", showDirective);
App.addDirective("addClass", classDirective);

export default defaultExport;






