import { Component, reactive, children } from "mahal";
import TextBox from "./text-box";
import { Template } from "@mahaljs/util";

@Template(`
<div>
   <TextBox on:update="onUpdate" :id="txtStandardCheckBox" :model(text) />
</div>
`)
@children({ TextBox })
export default class extends Component {

    @reactive
    text = "initial"

    @reactive
    id = "txtStandardCheckBox"

    onUpdate() {
        this.emit('update');
    }
}