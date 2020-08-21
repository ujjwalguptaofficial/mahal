import { Component, Template, Prop } from "taj";

@Template("<div>Hello World {{count}}</div>")
export default class HelloWorld extends Component {

    props = {
        count: Number
    }
    count;

    constructor() {
        super();
        this.on("rendered", this.onRendered);
        this.on("created", function () {
            console.log("created");
        });
    }

    onRendered() {
        console.log("Hello world rendered")
    }
}

