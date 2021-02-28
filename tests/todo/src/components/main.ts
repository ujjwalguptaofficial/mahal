import { Component, Template, Children, Reactive } from "mahal";
import Todo from "./todo";
import NewTodo from "./new_todo";


@Template(`
<div class="column center container">
    <new-todo class="margin-bottom-20px" on:newTask="addTask" />
    <todo on:remove="removeTask" class="margin-top-20px" #for(task in tasks) :task="task" />
</div>
`)
@Children({
    todo: Todo,
    'new-todo': NewTodo
})
export default class Main extends Component {

    uniqueId = 0;

    @Reactive
    tasks = [];

    constructor() {
        super();
        this.on("rendered", this.onRendered.bind(this))
    }

    onRendered() {
        this.addTask({
            title: "Buy shoe",
            description: "Buy a canvas shoe from Myntra"
        })
    }

    addTask(task) {
        task.id = ++this.uniqueId;
        this.tasks.push(task);
    }

    removeTask(id) {
        const index = this.tasks.findIndex(q => q.id === id);
        if (index >= 0) {
            this.tasks.splice(index, 1);
        }
    }
}
