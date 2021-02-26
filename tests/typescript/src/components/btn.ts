import { Component, Template, Prop, Formatter, Reactive } from "mahal";

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
        return (() => {
            switch (typeof value) {
                case 'string':
                    return value;
                case 'number':
                    return (value as number).toString();
                default:
                    return JSON.stringify(value);
            }
        })().toUpperCase();
    }
}