import { Component, Template, Prop, Filter, Reactive } from "taj";

@Template(`
<div>
   <input type="text" #model(text) />
</div>
`)

export default class extends Component {

    @Reactive
    text;

    rendered(){
        window["comp"] = this;
    }
}