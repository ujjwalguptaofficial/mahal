import { Component, Template, Prop, Filter, Reactive } from "taj";

@Template(`
<div>
Standard Text box
   <input  type="text" on:input="onInput" ></Input>
</div>
`)

export default class HelloWorld extends Component {

    @Prop()
    value;

    onInput(value) {
        this.emit("input", value);
    }

}