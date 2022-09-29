import { Component, reactive, } from "mahal";
import BaseFruits from "./base_fruits";


export default class extends BaseFruits {

    @reactive
    fruits = [];
}

