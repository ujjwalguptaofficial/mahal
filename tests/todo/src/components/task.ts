import { Component, Template, Prop, Filter, Reactive } from "taj";

@Template(`
<div>
{{task}}
<button on:click="remove" style="margin-left:5px;">Remove</button>
</div>
`)

export default class extends Component {

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