import { Taj, Component, Template, Children, Reactive } from "taj";
import HelloWorld from "./components/hello_world";
import Student from "./components/student";

@Template(`<div>
<Student/>
<HelloWorld on:click='onHelloWordClick' name='ujjwal' :count='counter'></HelloWorld>
<button on:click='toggleFlag'>Show Div</button>
<button on:click='incrementCounter'>Increment Counter</button>
<button on:click='addItem'>Additem</button>
<div>{{counter}}</div>
<button on:click='toggleFlagOne'>Change FlagOne</button>
<button on:click='toggleFlagTwo'>Change FlagTwo</button>
<div #if(flagOne)><b>Flag one rendered</b></div>
<div #else-if(flagTwo)>Flag two rendered</div>
<div #else>else rendered</div>

</div>`)
@Children({
    HelloWorld, Student
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