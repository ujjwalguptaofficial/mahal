import { Component, Template, Prop, Reactive } from "mahal";

@Template(`
<div>
Standard Text box
   <input type="text" :value="value" on:input="onInput" />
</div>
`)

export default class HelloWorld extends Component {

    @Prop()
    value;

    @Prop()
    textBoxId;

    onInput(value) {
        this.emit("input", value);
    }

}