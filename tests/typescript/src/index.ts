import { Mahal } from "mahal";
import Main from "./components/main";
import Btn from "./components/btn";
import MahalTest from "mahal-test-utils";
import { createRenderer } from "mahal-html-compiler";
if (process.env.BUILD_ENV != "test") {
    require("flexboot");
}


export const app = new Mahal(Main, document.querySelector('#app'));
app.global.authorName = "ujjwal";
app.extend.formatter("dollar", (value: string) => {
    return "$" + value;
});
app.extend.component("Btn", Btn);
// app.extend.component("fragment", FragmentComponent);
(Mahal as any).createRenderer = createRenderer;
if (process.env.BUILD_ENV !== "test") {
    app.create().catch(err => {
        console.log("err", err)
    })
}
else {
    app.extend.plugin(MahalTest, app);
}


