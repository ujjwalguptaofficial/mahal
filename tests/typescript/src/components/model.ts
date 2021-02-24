import { Component, Template, Reactive } from "mahal";

@Template(`
<div>
   <input type="text" #model(text) />
</div>
`)

export default class extends Component {

    @Reactive
    text;

}