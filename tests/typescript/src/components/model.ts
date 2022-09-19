import { Component, reactive } from "mahal";
import { template } from "@mahaljs/util";

@template(`
<div>
   <input type="text" :model(text) />
</div>
`)

export default class extends Component {

    @reactive
    text;

}