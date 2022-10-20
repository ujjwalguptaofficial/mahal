import { Component } from "mahal";
import { template } from "@mahaljs/util";

@template(`
    <button>
        <slot>OK</slot>
    </button>
`)
export default class Btn extends Component {
    onInit() {
        this.on("mount", _ => {
            console.log("mounted");
            console.log('slot not found in mounted', this.element.querySelector('slot') == null);
            console.log('class found in mounted', this.element.classList.contains('btn-slot'));
        })
    }
}