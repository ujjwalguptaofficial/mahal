import { Taj, Controller } from "taj";

class Main extends Controller {
    // template = "<div on:click='onClick'>Hello {{name}} <b>World<span>Hey</span></b> <span #if(flag || ss)> Lets go</span></div>"
    template = "<div on:click='onClick'>Hello</div>"

    flag = false;
    name = "ujjwal"

    onClick() {
        alert('ujjwal')
    }

    constructor() {
        super();
        setTimeout(() => {
            alert("name changed");
            this.name = "ujjwal gupta";
        }, 1000);
    }
}

const app = new Taj(Main, document.querySelector('#app'));
app.create();