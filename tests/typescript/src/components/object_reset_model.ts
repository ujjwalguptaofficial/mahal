import { Component, Reactive } from "mahal";
import { Template } from "@mahaljs/util";

@Template(`
<div>
   <input type="text" :model(student.name) />
   <div class="name">{{student.name}}</div>
   <div class="gender">{{student.gender}}</div>
   <button on:click="reset">Reset</button>
</div>
`)

export default class extends Component {

    @Reactive
    student = {
        name: ""
    };

    reset() {
        this.student = {
            name: ""
        };
    }

    onInit(): void {
        window['compObj'] = this;
    }

}