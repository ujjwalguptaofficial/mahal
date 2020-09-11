import { Component, Template, Prop, Filter, Reactive } from "taj";

@Template(`
<div>
   <div #if(state==0)>th{{state}}</div>
   <div #else-if(state==1)>st{{state}}</div>
   <div #else-if(state==2)>{{state | dollar}}</div>
   <div #else>{{state}}</div>
</div>
`)

export default class extends Component {

    @Reactive
    state;

    name = "ujjwal"

    constructor() {
        super();
        window["comp"] = this;
    }
}