import { Component, Template, Prop } from "mahal";


@Template(`
    <div>
        <div class="row">
            <div on:click="()=>{onTabClick(tab)}" class="tab margin-right-10px" #for(tab in tabs) >
                {{tab}}
            </div>
        </div>
        <div>
            <slot></slot>
        </div>
    </div>
     
`)
export default class extends Component {

    @Prop(Array)
    tabs = [];

    @Prop(String)
    value;

    onTabClick(value){
        this.emit('input', value);
    }
}