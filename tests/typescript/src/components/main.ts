import { Component, children, reactive, directive, nextTick, lazyComponent } from "mahal";
import ModelComponent from "./component_model";
import { template, watch } from "@mahaljs/util";

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
import computed from "./computed";
import Fruits from "./fruits";
import Fragment from "./fragment";
import ArrayModel from "./array_model";
import UsersHobbie from "./users_hobbie";
import ObjectResetModel from "./object_reset_model";
import { IAppGlobal } from "../interfaces";
// import { RouterView } from "../../test/in_palce_at_root.test";


@template(`
 <UsersHobbie/>
`)
@children({
    // RouterView,
    HelloWorld, ModelComponent, Student, ObjectComponent, IfElse, TextBox, DirectiveComp,
    Fruits, Model, Form, Users, TabRender, TextAreaBox, ObjectProp, computed,
    Fragment, ArrayModel, ObjectResetModel,
    Btn: lazyComponent(() => import('./btn')),
    UsersHobbie
    // Temp
    // Temp: lazyComponent(() => import('../../test/directive_in_for.test'))
    // Btn1: lazyComponent(() => Promise.reject('dd'))
})
export default class Main extends Component<IAppGlobal> {

    @reactive
    nestedArray = [
        [1, 2],
        [3, 4]
    ]

    @reactive styles =
        {
            width: '30px',
            height: '30px'
        }



    @directive('event')
    eventDirective(el: HTMLElement, binding) {
        // const params = binding.;
        debugger;
        // el.addEventListener(params[0])
    };


    @reactive
    users = [{
        name: "Ujjwal kumar",
        gender: "Male"
    }]

    @reactive
    flag = false;

    @reactive
    name; //= "Btn"

    flagOne = false
    flagTwo = true

    toggleFlagOne() {
        this.flagOne = !this.flagOne
    }

    toggleFlagTwo() {
        this.flagTwo = !this.flagTwo
    }

    @reactive
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

    @reactive
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
        this.on('update', () => {
            console.log('updated');
        })
        this.on('error', (err) => {
            console.error('error occured', err);
        })
    }

    onHelloWordClick() {
        alert("hello world clicked")
    }

    // @watch('flag')
    onFlagChange(newValue, oldValue) {
        console.log('onFlagChange', newValue, oldValue);
    }
}
