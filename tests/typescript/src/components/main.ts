import { Component, Template, Children, Reactive, nextTick, lazyComponent } from "mahal";
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
import Fruits from "./fruits";
import Fragment from "./fragment";
import ArrayModel from "./array_model";
import ObjectResetModel from "./object_reset_model";

// @Template(`<div >
// <in-place :of="name" #if(flag) label="as"/>
// </div>`)
// @Template(`
//     <TabRender :label="flag" :count="counter" on:click="incrementCounter" />
// `)
@Template(`
<div>
Hi
<ArrayModel />
</div>
`)
@Children({
    HelloWorld, ModelComponent, Student, ObjectComponent, IfElse, TextBox, DirectiveComp,
    Fruits, Model, Form, Users, TabRender, TextAreaBox, ObjectProp, Computed,
    Fragment, ArrayModel, ObjectResetModel,
    Btn: lazyComponent(() => import('./fruits_set_state')),
    // Btn1: lazyComponent(() => Promise.reject('dd'))
})
export default class Main extends Component {

    @Reactive
    users = [{
        name: "Ujjwal kumar",
        gender: "Male"
    }]

    @Reactive
    flag = false;

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
        window['nextTick'] = nextTick;
        // setTimeout(() => {
        //     // alert("name changed");
        //     this.name = "ujjwal gupta";
        // }, 1000);
        // nextTick(() => {
        //     this.name = "kujjwal gupta";
        // })
        this.watch("users.push", (newValue, oldValue) => {
            console.log(newValue, oldValue);
        });

        this.on("mount", function () {
            window['comp'] = this;
        })
    }

    onInit(): void {
        window['mainComp'] = this;
        this.on('create', () => {
            console.log('created');
        })
        this.on('error', (err) => {
            console.error('error occured', err);
        })
    }

    onHelloWordClick() {
        alert("hello world clicked")
    }
}
