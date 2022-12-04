import { Component, reactive, prop, children } from "mahal";
import { template } from "@mahaljs/util";

@template(`
    <div class="hobbie">Hobbies - {{hobbies}}</div>
`)
class HobbieTemp extends Component {
    @prop() hobbies;
}

@template(`
<div class="users">
    <div class="users_item" :for(user,index in users)>
        <div class="users_item_name">name - {{user.name}}</div>
        <Hobbie :index="index" class="users_item_hobbies" :hobbies="user.hobbies" :class="{'ml-4': index!=0}" />
    </div>
</div>
`)
@children({
    Hobbie: HobbieTemp
})
export default class extends Component {

    @reactive users = [{
        name: 'ujjwal',
        hobbies: ['travel', 'food', 'code']
    }]


}