import { Taj, Controller } from "taj";

class Main extends Controller {
    // template = "<div on:click='onClick'>Hello {{name}} <b>World<span>Hey</span></b> <span #if(flag || ss)> Lets go</span></div>"
    // template = `<div on:click='onClick' >Hello {{name}}
    // <input #model(name) type='text'></input></div>`
    template = `<div on:click='toggleFlag'>Hello<b #if(flag)>{{name}}</b></div>`

    flag = false;
    name = "ujjwal"

    toggleFlag() {
        this.flag = !this.flag;
        console.log("flag", this.flag);
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