import { Component, Children, Reactive } from "mahal";
import { Template } from "@mahaljs/util";


@Template(`<div>
{{name | invalid}}
</div>`)
export default class extends Component {
   name = "ujjwal"
}
