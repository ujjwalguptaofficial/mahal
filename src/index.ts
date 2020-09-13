import { defaultExport } from "./default";
import { globalDirectives } from "./constant";
import { ModelDirective, ShowDirective } from "./ready_made";

export * from "./abstracts";
export * from "./decorators"
export * from "./utils";
export * from "./app";

globalDirectives["model"] = ModelDirective;
globalDirectives["show"] = ShowDirective;

export default defaultExport;






