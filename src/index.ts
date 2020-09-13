import { defaultExport } from "./default";
import { modelDirective, showDirective } from "./ready_made";
import { App } from "./app";

export * from "./abstracts";
export * from "./decorators"
export * from "./utils";
export * from "./app";

App.addDirective("model", modelDirective);
App.addDirective("show", showDirective);

export default defaultExport;






