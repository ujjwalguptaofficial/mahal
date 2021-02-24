import { Component, Template, Prop, Reactive, } from "mahal";

@Template(`
<div>
Standard Text Area box
   <input type="text" #model(value) />
   textbox value inside component  {{value}}
</div>
`)

export default class extends Component {

    @Prop()
    value;

    @Reactive
    textBoxId;

    constructor() {
        super();
        this.watch("value", this.onInput.bind(this));
    }

    onInput(value) {
        console.log("value changed");
        // this.emit("input", value);
    }

}