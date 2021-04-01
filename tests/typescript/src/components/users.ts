import { Component, Template, Prop, Children, Reactive, LIFECYCLE_EVENT } from "mahal";
import User from "./user";

@Template(`
<div>
    <User class="users" #for(user in users)>
        <target>{{user.name}}</target>
        <target name="gender">{{user.gender}}</target>
    </User>
    <User class="reactive-users" #for(user in reactiveUsers)>
        <target>{{user.name}}</target>
        <target name="gender">{{user.gender}}</target>
    </User>
</div>
`)
@Children({
    User
})

export default class extends Component {

    @Prop(Array)
    users = [{
        name: "Ujjwal",
        gender: "Male"
    }]

    @Reactive
    reactiveUsers = [{
        name: "Ujjwal",
        gender: "Male"
    }]

    constructor() {
        super();
        window['comp'] = this;
        this.on(LIFECYCLE_EVENT.Update, () => {
            console.log("updated");
        })
    }


}