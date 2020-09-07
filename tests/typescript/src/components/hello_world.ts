import { Component, Template, Prop, Filter, Reactive } from "taj";

@Template(`
<div>
    <span id="name">{{name | toUpper}}</span>
    <button id="count" on:click='onClick'>
        {{count}}
    </button>
    <p class="p-html" #html=myHtml></p>
</div>
`)

class BaseComponent extends Component {
    $callMe
}

export default class HelloWorld extends BaseComponent {

    @Prop(Number)
    count;

    // @Prop("as")
    myHtml = "<b>BOLD</b>"

    @Reactive
    name = "ujjwal gupta" // leave value in lower case

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
        this.emit("click");
    }

    @Filter("toUpper")
    upperCase(value: string) {
        return value.toUpperCase();
    }
}