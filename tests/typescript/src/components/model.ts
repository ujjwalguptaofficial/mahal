import { Component, Template, Reactive } from "taj";

@Template(`
<div>
   <input type="text" #model(text) />
</div>
`)

export default class extends Component {

    @Reactive
    text;

    rendered() {
        window["comp"] = this;
    }
}