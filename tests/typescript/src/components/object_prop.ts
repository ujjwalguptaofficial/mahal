import { Children, Template, Component, Prop } from "mahal";

@Template(`
<div>
    <p #for(val,key in value) #class(key)>{{val}}</p>
</div>
`)

export class Test extends Component {

    @Prop()
    value;
}

@Children({
    Test
})
@Template(`
<div>
    <Test :value="{name:'ujjwal',gender:'male'}" />
</div>
`)
export default class extends Component {

}