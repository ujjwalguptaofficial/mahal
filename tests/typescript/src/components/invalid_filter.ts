import { Component, Template, Children, Reactive } from "mahal";


@Template(`<div>
{{name | invalid}}
</div>`)
export default class extends Component {
   name = "ujjwal"
}
