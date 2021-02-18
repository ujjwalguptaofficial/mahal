import { defaultExport } from "./default";
import { modelDirective, showDirective, classDirective } from "./ready_made";
import { App } from "./app";

export * from "./abstracts";
export * from "./decorators"
export * from "./utils";
export * from "./app";

App.extend.directive("model", modelDirective);
App.extend.directive("show", showDirective);
App.extend.directive("addClass", classDirective);

export default defaultExport;






