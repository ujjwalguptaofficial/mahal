import { Component, reactive } from "mahal";
import { template } from "@mahaljs/util";

@template(`
<div>
   <input class="text" type="text" :model(text) />
   <textarea class="textarea" type="textarea" :model(textareaValue) />
   <input class="checkbox" type="checkbox" :model(checkboxValue) />
</div>
`)

export default class extends Component {

    @reactive
    text;

    @reactive
    textareaValue;

    @reactive
    checkboxValue;

    onInit() {
        window['modelComp'] = this;
    }

}