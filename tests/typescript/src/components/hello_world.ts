import { Component, Template, Prop, Taj } from "taj";

@Template("<div><button on:click='onClick'>Hello World {{count}}</button><p #html=myHtml></p></div>")

class BaseComponent extends Component {
    $callMe
}

export default class HelloWorld extends BaseComponent {

    props = {
        count: Number
    }

    count;

    myHtml = "<b>BOLD</b>"

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
        this.$callMe("hey there")
        this.emit("click");
    }
}

(Component.prototype as any).$callMe = () => {
    alert("call from prototype")
}