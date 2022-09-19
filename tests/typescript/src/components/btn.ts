import { Component, prop, formatter, reactive } from "mahal";
import { template } from "@mahaljs/util";

@template(`
<button class="btn" on:click="handleClick">{{label | toS | toUpper}}</button>
`)

export default class extends Component {

    @prop(String)
    label;

    handleClick() {
        this.emit('click');
    }

    @formatter('toUpper')
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