import { Component, Template, Prop, Reactive, } from "mahal";

@Template(`
    <div class="row content-center content-v-center">
        <div class="column">
            <div class="textbox">
                <input #model(title) placeholder="Enter task title" type="text"/>
            </div>
            <div class="textbox margin-top-20px" >
                <input #model(description) type="text" placeholder="Enter task description"/>
            </div>
        </div>
        <button on:click={'validate' | 'addTask'} class="btn primary btn-add">
            Add
        </button>
    </div>
`)

export default class extends Component {

    @Reactive
    title = "";

    @Reactive
    description = "";

    validate() {
        if (!this.title) {
            alert('Title can not be empty');
            return false;
        }
        else if (!this.description) {
            alert('Description can not be empty');
            return false;
        }
        return true;
    }

    addTask(isValid) {
        if (!isValid) {
            return;
        }
        this.emit("newTask", {
            title: this.title,
            description: this.description
        })
        this.title = this.description = ""
    }
}