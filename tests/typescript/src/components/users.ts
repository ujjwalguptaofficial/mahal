import { Component, Template, Prop, Filter, Reactive, Children } from "taj";
import User from "./user";

@Template(`
<div>
    <User class="users" #for(user in users)>
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
}