import { Taj, Controller } from "taj";

class Main extends Controller {
    template = "<div></div>"
}

const app = new Taj(Main, document.querySelector('#app'));
app.create();