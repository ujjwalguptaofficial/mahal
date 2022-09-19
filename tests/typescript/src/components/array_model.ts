import { Component, prop, formatter, reactive } from "mahal";
import { template } from "@mahaljs/util";

// @template(`<div>
// <fragment #for(student in students)>
// {{student.name}}
// </fragment>
// </div>
// `)
@template(`<div>
    <div class="fruit-row" :for(fruit,i in fruits)>
        <input type="text" :model(fruit) />
        <span :fruit="fruit">{{fruit}}</span>
        <button on:click="()=>{updateFruit(fruit,i)}">Update</button>
    </div>
</div>
`)

export default class extends Component {

    @reactive
    fruits = ["banana", "apple"];

    updateFruit(fruit, index) {
        this.fruits[index] = fruit
        // this.setAndReact(this.fruits, index, fruit);
    }
}