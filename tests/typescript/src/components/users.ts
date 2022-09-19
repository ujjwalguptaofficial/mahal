import { Component, prop, children, reactive } from "mahal";
import User from "./user";
import { template } from "@mahaljs/util";

@template(`
<div>
    <User class="users" :for(user in users)>
        <target>{{user.name}}</target>
        <target name="gender">{{user.gender}}</target>
    </User>
    <User class="reactive-users" :for(user in reactiveUsers)>
        <target>{{user.name}}</target>
        <target name="gender">{{user.gender}}</target>
    </User>
</div>
`)
@children({
    User
})

export default class extends Component {

    @prop(Array)
    users = [{
        name: "Ujjwal",
        gender: "Male"
    }]

    @reactive
    reactiveUsers = [{
        name: "Ujjwal",
        gender: "Male"
    }]

    constructor() {
        super();
        window['comp'] = this;
        this.on("update", () => {
            console.log("updated");
        })
    }


}