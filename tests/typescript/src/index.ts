import { Taj, Controller } from "taj";

class Main extends Controller {
    template = "<div>Hello {{name}} <b>World<span>Hey</span></b> <span #if(flag || ss)> Lets go</span></div>"

    flag = true;
    name = "ujjwal"

    callMe({ flag }) {
        console.log(flag)
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