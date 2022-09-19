import { Component, prop, reactive } from "mahal";
import { template } from "@mahaljs/util";

@template(`
<div>
Standard Text box
   <input type="text" :value="value" on:input="onInput" />
</div>
`)

export default class extends Component {

    @prop()
    value;

    @prop()
    textBoxId;

    onInput(e) {
        this.emit("input", e.target.value);
    }

}