import { Component, Template, Prop, } from "mahal";

@Template(`
    <div class="row content-v-center">
        <div class="title">{{task.title}}</div>
        <div class="description">{{task.description}}</div>
        <button on:click="remove" class="btn small error margin-left-20px">Remove</button>
    </div>
`)

export default class extends Component {

    @Prop('object')
    task

    remove() {
        this.emit("remove", this.task.id)
    }
}