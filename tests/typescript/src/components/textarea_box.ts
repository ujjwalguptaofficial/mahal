import { Component, prop, reactive, } from "mahal";
import { template } from "@mahaljs/util";

@template(`
<div>
Standard Text Area box
   <input type="text" :model(text) />
   textbox value inside component  {{value}}
</div>
`)

export default class extends Component {

    @prop()
    value;

    @reactive
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