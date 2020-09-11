import { App } from "taj";
import Main from "./components/main";
import TajTest from "taj-test";

export const app = new App(Main, document.querySelector('#app'));
app.addFilter("dollar", (value: string) => {
    return "$" + value;
})
console.log("env", process.env.NODE_ENV)
if (process.env.NODE_ENV !== "test") {
    app.create();
}
else {
    app.addPlugin(TajTest, app);
}