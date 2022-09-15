import { Component, prop } from "mahal";
import { Template } from "@mahaljs/util";


@Template(`
    <div>
        <div class="row">
            <div :class({ 'active' : value===tab }) on:click="()=>{onTabClick(tab)}" class="tab margin-right-10px" :for(tab in tabs) >
                {{tab}}
            </div>
        </div>
        <div class="tab-content">
            <slot></slot>
        </div>
    </div>
     
`)
export default class extends Component {

    @prop(Array)
    tabs = [];

    @prop(String)
    value;

    onTabClick(value) {
        this.emit('input', value);
    }
}