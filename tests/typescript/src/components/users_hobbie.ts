import { Component, reactive } from "mahal";
import { template } from "@mahaljs/util";

@template(`
<div class="users">
    <div class="users_item" :for(user in users)>
        <div class="users_item_name">name - {{user.name}}</div>
        <div class="users_item_hobbies">Hobbies - {{user.hobbies}}</div>
    </div>
</div>
`)

export default class extends Component {

    @reactive users = [{
        name: 'ujjwal',
        hobbies: ['travel', 'food', 'code']
    }]

    
}