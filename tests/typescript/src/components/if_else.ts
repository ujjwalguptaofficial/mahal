import { Component, Template, Prop, Filter, Reactive } from "taj";

@Template(`
<div #addClass({'state-0':state===0,'state-1':state===1,'state-gt-10':state>10})>
   <div #if(state==0)>0th{{state}}</div>
   <div #else-if(state==1)>1st{{state}}</div>
   <div #else-if(state===2)>{{state | dollar}}</div>
   <Btn #else-if(state<=3) label='ok'></Btn>
   <Btn #else-if(state>=4 && state<anotherState) label='Hello'></Btn>
   <Btn #else-if(state===nested.nested1.nested2.nested3) label='10'></Btn>
   <div #else>{{state}}</div>
</div>
`)

export default class extends Component {

    @Reactive
    nested = {
        nested1: {
            nested2: {
                nested3: 10
            }
        }
    }

    @Reactive
    state;

    @Reactive
    anotherState = 10;

    name = "ujjwal"

    constructor() {
        super();
        window["comp"] = this;
    }
}