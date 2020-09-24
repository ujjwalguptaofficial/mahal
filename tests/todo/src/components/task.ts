import { Component, Template, Prop, Filter, Reactive } from "taj";

@Template(`
<div class="task">
{{task}}
<button on:click="remove" style="margin-left:5px;">Remove {{task}}</button>
</div>
`)

export default class extends Component {

    @Reactive
    temp = "ok"

    @Prop(String)
    task: string

    @Prop(Number)
    index: number

    remove() {
        this.emit('remove', this.index)
    }

    destroyed() {
        console.log("destroyed");
    }
}