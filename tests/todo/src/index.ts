import { App } from "taj";
import Main from "./components/main";
import TajTest from "taj-test";

export const app = new App(Main, document.querySelector('#app'));
if (process.env.NODE_ENV !== "test") {
    app.create();
}
else {
    App.addPlugin(TajTest, app);
}