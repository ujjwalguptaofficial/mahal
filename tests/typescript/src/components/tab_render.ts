import { Component, children, reactive } from "mahal";
import Users from "./users";
import Tabs from "./tabs";
import { template } from "@mahaljs/util";

@template(`<div>
<div class="tab-name">{{activeTab}}</div>
<Tabs :tabs="tabs" :model(activeTab) >
    <target>
        <in-place :of="activeTab" :users="users" label="name"/>
    </target>
</Tabs>
</div>`)
@children({
    Users, Tabs
})
export default class extends Component {

    tabs = ["Users", "Btn"];

    @reactive
    activeTab = "Btn";

    users = [{
        name: "Ujjwal kumar",
        gender: "Male"
    }]

    items = ["hello", "world"]

    onInit() {
        window['tabComp'] = this;
        this.watch("activeTab", (value) => {
            console.log(value);
        })
        this.on("update", () => {
            console.log('updated');
        })
    }

}
