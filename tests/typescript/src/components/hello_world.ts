import { Component, Template, Prop, Formatter, Reactive } from "mahal";

@Template(`
<div>
    <span :if(count>0) :show(flag===true) id="testFilter">
        {{"string" | toUpper}}
    </span>
    <span  id="name">{{name | toUpper}}</span>
    <button id="count" on:click='onClick'>
        {{count}}
    </button>
    <button on:click="destroy">Destory</button>
    <p class="p-html" :html(myHtml) ></p>
</div>
`)

class BaseComponent extends Component {
    $callMe
}

export default class HelloWorld extends BaseComponent {

    @Prop(Number)
    count;

    // @Prop("as")
    @Reactive
    myHtml = "<b>BOLD</b>"

    @Reactive
    name = "ujjwal gupta" // leave value in lower case

    @Reactive
    flag = false;

    constructor() {
        super();
        this.on("create", this.onCreated);
        this.on("mount", this.mounted);
        this.on("update", this.updated);
        console.log("constructor", this.name, this.count);
    }

    mounted() {
        window['helloComp'] = this;
        console.log("mounted", this.name, this.count);
    }

    onCreated() {
        console.log("created", this.name);
    }

    onDestroyed() {
        console.log("Hello world destroyed", this.name);
    }

    onClick() {
        this.emit("click");
    }

    @Formatter("toUpper")
    upperCase(value: string) {
        return value.toUpperCase();
    }

    updated() {
        console.log("updated");
    }

    destroy() {
        this.element.parentNode.removeChild(this.element);
    }

}