import { Component, Template, Children, Reactive } from "taj";


@Template(`<div>
{{name | invalid}}
</div>`)
export default class extends Component {
   name = "ujjwal"
}
