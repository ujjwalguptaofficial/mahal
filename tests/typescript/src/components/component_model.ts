import { Component, Template, Reactive, Children } from "mahal";
import TextBox from "./text-box";

@Template(`
<div>
   <TextBox on:update="onUpdate" :id="txtStandardCheckBox" #model(text) />
</div>
`)
@Children({ TextBox })
export default class extends Component {

    @Reactive
    text = "initial"

    @Reactive
    id = "txtStandardCheckBox"

    onUpdate() {
        this.emit('update');
    }
}