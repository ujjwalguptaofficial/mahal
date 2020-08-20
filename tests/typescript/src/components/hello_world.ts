import { Component, Template, Prop } from "taj";

@Template("<div>Hello World {{count}}</div>")
export default class HelloWorld extends Component {

    props = {
        count: Number
    }
    count;
}

