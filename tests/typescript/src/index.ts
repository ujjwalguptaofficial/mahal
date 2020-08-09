import { Taj, Controller } from "taj";

class Main extends Controller {
    template = "<div>Hello <b>World<span>Hey</span></b> <span #if(true)> Lets go</span></div>"
}

const app = new Taj(Main, document.querySelector('#app'));
app.create();