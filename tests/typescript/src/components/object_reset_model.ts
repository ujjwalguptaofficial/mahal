import { Component, reactive } from "mahal";
import { template } from "@mahaljs/util";

@template(`
<div>
   <input type="text" :model(student.name) />
   <div class="name">{{student.name}}</div>
   <div class="gender">{{student.gender}}</div>
   <button on:click="reset">Reset</button>
</div>
`)

export default class extends Component {

    @reactive
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