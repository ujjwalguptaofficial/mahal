import { Component, Prop, Reactive, } from "mahal";
import { Template } from "@mahaljs/util";

@Template(`
<div>
Standard Text Area box
   <input type="text" :model(text) />
   textbox value inside component  {{value}}
</div>
`)

export default class extends Component {

    @Prop()
    value;

    @Reactive
    text = "";

    onInit() {
        this.on("create", function () {
            this.text = this.value;
        })
        this.watch("value", this.onValueChange);
        this.watch("text", this.onInput);
    }


    onInput(value) {
        this.emit("input", value);
    }

    onValueChange(value1, value2) {
        console.log("value changed", value1, value2);
        this.text = value1;
    }



}