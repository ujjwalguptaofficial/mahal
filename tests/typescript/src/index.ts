import { Taj, Component, Template, Children, Reactive } from "taj";
import HelloWorld from "./components/hello_world";
import Student from "./components/student";
import ObjectComponent from "./components/object";

@Template(`<div>
<ObjectComponent/>


</div>`)
@Children({
    HelloWorld, Student, ObjectComponent
})
class Main extends Component {
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
        this.flag = this.counter > 0;
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
        setTimeout(() => {
            // alert("name changed");
            // this.name = "ujjwal gupta";
        }, 1000);
    }

    onHelloWordClick() {
        alert("hello world clicked")
    }
}

const app = new Taj(Main, document.querySelector('#app'));
app.create();