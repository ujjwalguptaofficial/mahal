import { Component } from "mahal";
import { template } from "@mahaljs/util";

@template(`
    <button>
        <slot></slot>
    </button>
`)
export default class Btn extends Component {

}