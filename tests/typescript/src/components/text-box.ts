import { Component, Prop, Reactive } from "mahal";
import { Template } from "@mahaljs/util";

@Template(`
<div>
Standard Text box
   <input type="text" :value="value" on:input="onInput" />
</div>
`)

export default class extends Component {

    @Prop()
    value;

    @Prop()
    textBoxId;

    onInput(e) {
        this.emit("input", e.target.value);
    }

}