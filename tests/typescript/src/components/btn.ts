import { Component, Prop, Formatter, Reactive } from "mahal";
import { Template } from "@mahaljs/util";

@Template(`
<button class="btn" on:click="handleClick">{{label | toS | toUpper}}</button>
`)

export default class extends Component {

    @Prop(String)
    label;

    handleClick() {
        this.emit('click');
    }

    @Formatter('toUpper')
    toUpper(value) {
        return value.toUpperCase();
    }

    constructor() {
        super();
        this.on("mount", _ => {
            console.log("mounted");
        })
    }
}