import { Component, Template, Prop } from "taj";

@Template("<div><button on:click='onClick'>Hello World {{count}}</button><p #html=myHtml></p></div>")
export default class HelloWorld extends Component {

    props = {
        count: Number
    }

    count;

    myHtml="<b>BOLD</b>"

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

    onClick() {
        this.emit("click");
    }
}

