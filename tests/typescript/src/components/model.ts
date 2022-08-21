import { Component, Reactive } from "mahal";
import { Template } from "@mahaljs/util";

@Template(`
<div>
   <input type="text" :model(text) />
</div>
`)

export default class extends Component {

    @Reactive
    text;

}