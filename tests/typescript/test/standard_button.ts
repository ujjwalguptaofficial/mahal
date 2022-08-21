import { Component } from "mahal";
import { Template } from "@mahaljs/util";

@Template(`
    <button>
        <slot></slot>
    </button>
`)
export default class Btn extends Component {

}