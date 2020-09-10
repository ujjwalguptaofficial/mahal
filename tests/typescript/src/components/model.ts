import { Component, Template, Prop, Filter, Reactive } from "taj";

@Template(`
<div>
   <input type="text" #model(text) />
</div>
`)

export default class HelloWorld extends Component {

    @Reactive
    text;
}