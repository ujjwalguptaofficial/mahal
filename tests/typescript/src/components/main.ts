import { Component, Template, Children, Reactive } from "taj";

import HelloWorld from "./hello_world";
import Student from "./array";
import ObjectComponent from "./object";
import IfElse from "./if_else";

@Template(`<div>
<HelloWorld :count="counter" on:click="incrementCounter" ></HelloWorld>
<IfElse><IfElse/>
</div>`)
@Children({
    HelloWorld, Student, ObjectComponent, IfElse
})
export default class Main extends Component {
    flag = true;

    name = "ujjwal"

    flagOne = false
    flagTwo = true

    toggleFlagOne() {
        this.flagOne = !this.flagOne
    }

    toggleFlagTwo() {
        this.flagTwo = !this.flagTwo
    }

    @Reactive
    counter = 0;

    incrementCounter() {
        this.counter++;
    }

    toggleFlag() {
        this.flag = !this.flag;
        console.log("flag", this.flag);
    }

    addItem() {
        this.items.push("ujjwal" + this.items.length)
    }

    onClick() {
        // alert('ujjwal')
        this.name = "name changed";
    }

    items = ["hello", "world"]

    constructor() {
        super();
        // setTimeout(() => {
        //     // alert("name changed");
        //     this.name = "ujjwal gupta";
        // }, 1000);
    }

    onHelloWordClick() {
        alert("hello world clicked")
    }
}
