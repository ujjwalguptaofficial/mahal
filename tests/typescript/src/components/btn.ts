import { Component, Template, Prop, Formatter, Reactive } from "taj";

@Template(`
<button class="btn" on:click="handleClick">{{label | toUpper}}</button>
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
}