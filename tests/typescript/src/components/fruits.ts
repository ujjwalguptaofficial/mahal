import { Component, Reactive, } from "mahal";
import BaseFruits from "./base_fruits";
import { Template } from "@mahaljs/util";


export default class extends BaseFruits {

    @Reactive
    fruits = [];
}

