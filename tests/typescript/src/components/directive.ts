import { Component, Template, Directive, Reactive } from "mahal";

@Template(`
<div>
  <div id="el1" #name('ujjwal') #fu>Hey</div>
  <div id="el2" #name(name)>Hey</div>
  <div id="el3" #name>Hey</div>
  <div id="el4" #highlight>Hey</div>
  <div id="el5" #highlight('grey')>Hey</div>
  <div id="el6" #highlight('blue','red')>Hey</div>
  <div #if(el7) id="el7" #highlight(backgroundColor , 'yellow')>Hey</div>
  <div  id="el8" #highlight(backgroundColor , color )>Hey</div>
</div>
`)
export default class extends Component {

    @Reactive name = 'hello';

    @Reactive
    backgroundColor = 'red';

    @Reactive
    color = 'blue';

    @Reactive
    el7 = true;

    isDirectiveDestoyedCalled;

    @Directive('name')
    nameDirective(el, binding) {
        el.setAttribute('data-name', binding.value || 'taj');
    }

    @Directive('highlight')
    highlightDirective(el, binding, component) {
        console.log("comp", component)
        function handle() {
            if (binding.params.length > 1) {
                el.style.backgroundColor = binding.value[0];
                el.style.color = binding.value[1];
            }
            else {
                el.style.backgroundColor = binding.value || 'yellow';
                el.style.color = 'black';
            }
        }
        handle();
        return {
            valueUpdated: handle,
            destroyed: () => {
                this.isDirectiveDestoyedCalled = true;
            }
        }
    }

    rendered() {
        window['comp'] = this;
    }
}