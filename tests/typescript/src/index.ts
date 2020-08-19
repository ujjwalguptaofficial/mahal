import { Taj, Controller } from "taj";

let uniqueCounter = 0;

class Main extends Controller {
    // template = "<div on:click='onClick'>Hello {{name}} <b>World<span>Hey</span></b> <span #if(flag || ss)> Lets go</span></div>"
    // template = `<div on:click='onClick' >Hello {{name}}
    // <input #model(name) type='text'></input></div>`
    template = `<div on:click='()=>{ flag = 1 }'>
        <button on:click='toggleFlag'>Show Div</button>
        <button on:click='incrementCounter'>Increment Counter</button>
        <button on:click='addItem'>Additem</button>
        <div>{{counter}}</div>
        <div #if(flagOne)><b>ujj</b></div>
        <div #else-if(flagTwo)>ok</div>
        <div #else>word</div>
       
    </div>`

    flag = true;
    name = "ujjwal"

    flagOne = true

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
}

const app = new Taj(Main, document.querySelector('#app'));
app.create();