import { Component, Template, Reactive } from "mahal";


@Template(`
<div>
<p #for(fruit,index in fruits)>
 {{index}} - {{fruit}}
</p>
</div>
`)
export default class extends Component {

    @Reactive
    fruits = ["Banana", "Orange", "Apple", "Mango"];

    constructor(){
        super();
        window['fruitsComp'] = this;
    }
}

