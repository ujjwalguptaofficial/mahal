import { Component, directive, reactive } from "mahal";
import { IDirective } from "mahal/dist/ts/interface";
import { Template } from "@mahaljs/util";


@Template(`
<div>
  <div id="el1" :name('ujjwal') :fu>Hey</div>
  <div id="el2" :name(name)>Hey</div>
  <div id="el3" :name>Hey</div>
  <div id="el4" :highlight>Hey</div>
  <div id="el5" :highlight('grey')>Hey</div>
  <div id="el6" :highlight('blue','red')>Hey</div>
  <div :if(el7) id="el7" :highlight(backgroundColor , 'yellow')>Hey</div>
  <div  id="el8" :highlight(backgroundColor , color )>Hey</div>
  <div id="counterFlag" :if(counterFlag) :logCount(counterParam)>{{counter}}</div>
</div>
`)
export default class extends Component {

    counter = 0;

    @reactive
    counterFlag = true;

    @reactive
    counterParam = 0;

    // @reactive
    // counterDirectiveOutput = 0;

    @reactive name = 'hello';

    @reactive
    backgroundColor = 'red';

    @reactive
    color = 'blue';

    @reactive
    el7 = true;

    isDirectiveDestoyedCalled;

    constructor() {
        super();
        window['comp'] = this;
    }

    @directive('name')
    nameDirective(el, binding) {
        const value = binding.value[0]
        el.setAttribute('data-name', value || 'taj');
    }

    @directive('highlight')
    highlightDirective(el, binding, component) {
        function handle() {
            const [backgroundColor, color] = binding.value;
            el.style.backgroundColor = backgroundColor || 'yellow';
            el.style.color = color || 'black';
        }
        handle();
        return {
            valueUpdated: handle,
            destroyed: () => {
                this.isDirectiveDestoyedCalled = true;
            }
        }
    }

    @directive()
    logCount(): IDirective {
        ++this.counter;

        return {
            valueUpdated: () => {
                this.onValueUpdated();
            }
        }
    }

    rendered() {
        window['comp'] = this;
    }

    onValueUpdated() {
        console.log("onValueUpdated called");
    }
}