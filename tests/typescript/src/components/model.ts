import { Component, reactive } from "mahal";
import { Template } from "@mahaljs/util";

@Template(`
<div>
   <input type="text" :model(text) />
</div>
`)

export default class extends Component {

    @reactive
    text;

}