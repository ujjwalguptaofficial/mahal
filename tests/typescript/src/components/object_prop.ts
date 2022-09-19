import { children, Component, prop } from "mahal";
import { template } from "@mahaljs/util";

@template(`
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
@template(`
<div>
    <Test :value="{name:'ujjwal',gender:'male'}" />
</div>
`)
export default class extends Component {

}