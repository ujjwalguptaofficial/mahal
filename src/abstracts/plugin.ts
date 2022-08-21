import { Mahal } from "../mahal";

export abstract class Plugin {
    abstract setup(app: Mahal, options);
}