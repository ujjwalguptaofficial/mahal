import { Component, children, reactive } from "mahal";
import { template } from "@mahaljs/util";


@template(`<div>
{{name | invalid}}
</div>`)
export default class extends Component {
   name = "ujjwal"
}
