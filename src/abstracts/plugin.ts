import { App } from "../app";

export abstract class Plugin {
    constructor() {

    }
    abstract setup(app: App, options);
}