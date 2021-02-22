import { Component, Template, Reactive } from "mahal";

@Template(`
<div class="user-comp">
    User info
    <div class="name">
        My name is <slot></slot>.
    </div>
    <div class="gender">
        I am <slot name="gender"></slot>.
    </div>
</div>
`)

export default class extends Component {


}