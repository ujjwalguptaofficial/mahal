import { Taj, Controller } from "taj";

class Main extends Controller {
    template = "<div>Hello <b>World<span>Hey</span></b> <span #if(flag)> Lets go</span></div>"

    flag = true;

    callMe({ flag }) {
        console.log(flag)
    }
}

const app = new Taj(Main, document.querySelector('#app'));
app.create();