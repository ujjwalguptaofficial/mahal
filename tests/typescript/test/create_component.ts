import { Component } from "mahal";
import { createRenderer } from "@mahaljs/html-compiler";

export function createComponent(template: string, scoped?) {
    const result = createRenderer(template, scoped);

    class MyComponent extends Component {
        render = result as any;
    }

    return MyComponent;

}