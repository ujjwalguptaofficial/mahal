import { Component, Template, Children, Reactive } from "mahal";
import Users from "./users";
import Tabs from "./tabs";

@Template(`<div>
<div class="tab-name">{{activeTab}}</div>
<Tabs :tabs="tabs" #model(activeTab) >
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

    constructor() {
        super();
        this.watch("activeTab", (value) => {
            console.log(value);
        })
    }

}
