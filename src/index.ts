import { defaultExport } from "./default";
import { globalDirectives } from "./constant";
import { ModelDirective, showDirective } from "./ready_made";
import { App } from "./app";

export * from "./abstracts";
export * from "./decorators"
export * from "./utils";
export * from "./app";

globalDirectives["model"] = ModelDirective;
App.addDirective("show", showDirective);

export default defaultExport;






