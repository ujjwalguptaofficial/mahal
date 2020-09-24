import { Component, Template, Children, Reactive } from "taj";
import Task from "./task";


@Template(`<div style="display:flex;flex-direction:column;">
<div>
    <input #model(newTask) type="text"/> <button on:click="addTask">Add</button>
</div>
<Task on:remove="removeTask" #for(item,i in tasks) :task="item" :index="i"/> 
</div>`)
@Children({
    Task
})
export default class Main extends Component {

    @Reactive
    tasks = ["ujjwal"];

    @Reactive
    newTask = "";

    addTask() {
        this.tasks.push(this.newTask);
    }

    removeTask(index) {
        this.tasks.splice(index, 1);
    }
}
