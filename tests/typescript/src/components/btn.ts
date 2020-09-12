import { Component, Template, Prop, Filter, Reactive } from "taj";

@Template(`
<button class="btn" on:click="handleClick">{{label | toUpper}}</button>
`)

export default class extends Component {

    @Prop(String)
    label;

    handleClick() {
        this.emit('click');
    }

    @Filter('toUpper')
    toUpper(value) {
        return value.toUpperCase();
    }
}