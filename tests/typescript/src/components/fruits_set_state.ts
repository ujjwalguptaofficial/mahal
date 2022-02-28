import { Component, Template, Reactive, clone } from "mahal";
import BaseFruits from "./base_fruits";


export default class extends BaseFruits {
    fruits = [];

    isReactive = false;

    // onInit(): void {
    //     window['fruits'] = this;
    // }
}

