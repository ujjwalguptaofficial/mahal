import { Component, Template, Prop, Filter, Reactive } from "taj";

@Template(`
<div>
    User info
    <div>
        <slot></slot>
    </div>
    <div>
        <slot name="gender"></slot>
    </div>
</div>
`)

export default class extends Component {


}