import { Component, Template, Prop, Filter, Reactive } from "taj";

@Template(`
<div>
   <div #if(state==0)>0th{{state}}</div>
   <div #else-if(state==1)>1st{{state}}</div>
   <div #else-if(state==2)>{{state | dollar}}</div>
   <Btn #else-if(state===3) label='ok'></Btn>
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