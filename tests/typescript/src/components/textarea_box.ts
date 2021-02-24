import { Component, Template, Prop, } from "mahal";

@Template(`
<div>
Standard Text Area box
   <input type="text" #model(value) />
</div>
`)

export default class extends Component {

    @Prop()
    value;

    @Prop()
    textBoxId;

    onInput(value) {
        this.emit("input", value);
    }

}