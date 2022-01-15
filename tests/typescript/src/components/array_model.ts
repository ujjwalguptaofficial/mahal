import { Component, Template, Prop, Formatter, Reactive } from "mahal";

// @Template(`<div>
// <fragment #for(student in students)>
// {{student.name}}
// </fragment>
// </div>
// `)
@Template(`<div>
    <div class="fruit-row" :for(fruit,i in fruits)>
        <input type="text" :model(fruit) />
        <span>{{fruit}}</span>
        <button on:click="()=>{updateFruit(fruit,i)}">Update</button>
    </div>
</div>
`)

export default class extends Component {

    @Reactive
    fruits = ["banana", "apple"];

    updateFruit(fruit, index) {
        this.fruits[index] = fruit
        // this.setAndReact(this.fruits, index, fruit);
    }
}