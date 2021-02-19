import { App } from "mahal";
import Main from "./components/main";
import Btn from "./components/btn";
import MahalTest from "mahal-test-utils";

export const app = new App(Main, document.querySelector('#app'));
App.extend.formatter("dollar", (value: string) => {
    return "$" + value;
});
App.extend.component("Btn", Btn);
console.log("env", process.env.NODE_ENV)
if (process.env.NODE_ENV !== "test") {
    app.create();
}
else {
    App.extend.plugin(MahalTest, app);
}