import { Component, reactive, } from "mahal";
import BaseFruits from "./base_fruits";
import { template } from "@mahaljs/util";


export default class extends BaseFruits {

    @reactive
    fruits = [];
}

