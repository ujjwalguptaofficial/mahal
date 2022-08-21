import { Component, Children, Reactive } from "mahal";
import Users from "./users";
import Tabs from "./tabs";
import { Template } from "@mahaljs/util";

@Template(`<div>
<div class="tab-name">{{activeTab}}</div>
<Tabs :tabs="tabs" :model(activeTab) >
    <target>
        <in-place :of="activeTab" :users="users" label="name"/>
    </target>
</Tabs>
</div>`)
@Children({
    Users, Tabs
})
export default class extends Component {

    tabs = ["Users", "Btn"];

    @Reactive
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
