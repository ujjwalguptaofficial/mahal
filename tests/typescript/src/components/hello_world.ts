import { Component, Template, Prop, Taj, Filter } from "taj";

@Template("<div>{{name | toUpper}}<button on:click='onClick'>Hello World {{count}}</button><p #html=myHtml></p></div>")

class BaseComponent extends Component {
    $callMe
}

export default class HelloWorld extends BaseComponent {


    @Prop(Number)
    count;

    // @Prop("as")
    myHtml = "<b>BOLD</b>"

    name = "ujjwal gupta"

    constructor() {
        super();
        this.on("rendered", this.onRendered);
        this.on("created", function () {
            console.log("created", this);
        });
    }

    onRendered() {
        console.log("Hello world rendered", this);
    }

    onClick() {
        console.log("this", this, HelloWorld);
        // this.$callMe("hey there")
        this.emit("click");
    }

    @Filter("toUpper")
    upperCase(value: string) {
        return value.toUpperCase();
    }
}

(Component.prototype as any).$callMe = () => {
    alert("call from prototype")
}