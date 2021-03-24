import { Component, Template, Children, Reactive, nextTick } from "mahal";
import ModelComponent from "./component_model";

import HelloWorld from "./hello_world";
import Student from "./array";
import ObjectComponent from "./object";
import IfElse from "./if_else";
import TextBox from "./text-box";
import TextAreaBox from "./textarea_box";
import DirectiveComp from "./directive";
import Model from "./model";
import Form from "./form";
import Users from "./users";
import TabRender from "./tab_render";
import ObjectProp from "./object_prop";
import Computed from "./computed";

// @Template(`<div >
// <in-place :of="name" #if(flag) label="as"/>
// </div>`)
@Template(`
    <HelloWorld :count="counter" on:click="incrementCounter" />
`)
@Children({
    HelloWorld, ModelComponent, Student, ObjectComponent, IfElse, TextBox, DirectiveComp,
    Model, Form, Users, TabRender, TextAreaBox, ObjectProp, Computed
})
export default class Main extends Component {

    users = [{
        name: "Ujjwal kumar",
        gender: "Male"
    }]

    @Reactive
    flag = true;

    @Reactive
    name = "Btn"

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
        window['comp'] = this;
        // window['nextTick'] = nextTick;
        // setTimeout(() => {
        //     // alert("name changed");
        //     this.name = "ujjwal gupta";
        // }, 1000);
        // nextTick(() => {
        //     this.name = "kujjwal gupta";
        // })
    }

    onHelloWordClick() {
        alert("hello world clicked")
    }
}
