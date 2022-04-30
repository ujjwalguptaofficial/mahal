import { Mahal } from "mahal";
import App from "@/app.mahal";
import { registerGlobalFormatter } from "@/formatters";
import config from "~/config";


const app = new Mahal(App, '#app');
// register global formatter
registerGlobalFormatter(app);
// set config to be available globally
app.global.config = config;
app.create();