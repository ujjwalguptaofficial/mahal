import { App } from "mahal";
import Main from "./components/main";
import Btn from "./components/btn";
import MahalTest from "mahal-test-utils";
import { createRenderer } from "mahal-html-compiler";
if (process.env.NODE_ENV != "test") {
    require("flexboot");
}


export const app = new App(Main, document.querySelector('#app'));
console.log("app", app);
app.extend.formatter("dollar", (value: string) => {
    return "$" + value;
});
app.extend.component("Btn", Btn);
console.log("env", process.env.NODE_ENV);
(App as any).createRenderer = createRenderer;
if (process.env.NODE_ENV !== "test") {
    app.create().catch(err=>{
        console.log("err", err)
    })
}
else {
    app.extend.plugin(MahalTest, app);
}


