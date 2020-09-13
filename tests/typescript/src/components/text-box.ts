import { Component, Template, Prop, Filter, Reactive } from "taj";

@Template(`
<div>
Standard Text box
   <input type="text" :value="value" on:input="onInput" ></Input>
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