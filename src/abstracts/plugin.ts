import { Mahal } from "../mahal";

export abstract class Plugin {
    constructor() {

    }
    abstract setup(app: Mahal, options);
}