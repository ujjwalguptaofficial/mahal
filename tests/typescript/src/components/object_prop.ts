import { children, Component, prop } from "mahal";
import { Template } from "@mahaljs/util";

@Template(`
<div>
    <p :for(val,key in value) :class(key)>{{val}}</p>
</div>
`)

export class Test extends Component {

    @prop()
    value;
}

@children({
    Test
})
@Template(`
<div>
    <Test :value="{name:'ujjwal',gender:'male'}" />
</div>
`)
export default class extends Component {

}