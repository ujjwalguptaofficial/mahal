import { Mahal } from "mahal";
import Main from "./components/main";
import Btn from "./components/btn";
import MahalTest from "@mahaljs/test-utils";
import { createRenderer } from "@mahaljs/html-compiler";
import { toString } from "@mahaljs/util";

if (process.env.BUILD_ENV != "test") {
    require("flexboot");
}


export const app = new Mahal(Main as any, document.querySelector('#app'));
app.global.authorName = "ujjwal";
app.extend.formatter("dollar", (value: string) => {
    return "$" + value;
});
app.extend.component("Btn", Btn);
app.extend.formatter("toS", toString);
// app.extend.component("fragment", FragmentComponent);
// (Mahal as any).createRenderer = createRenderer;
app.extend.setRenderer(createRenderer);
window['app'] = app;
if (process.env.BUILD_ENV !== "test") {
    app.create().catch(err => {
        console.log("err", err)
    })
}
else {
    app.extend.plugin(MahalTest, app);
}


