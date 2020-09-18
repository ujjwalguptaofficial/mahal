import { Component, Template, Directive, Reactive } from "taj";

@Template(`
<div>
  <div id="el1" #name('ujjwal') #fu>Hey</div>
  <div id="el2" #name(name)>Hey</div>
  <div id="el3" #name>Hey</div>
  <div id="el4" #highlight>Hey</div>
  <div id="el5" #highlight('grey')>Hey</div>
  <div id="el6" #highlight('blue','red')>Hey</div>
  <div id="el7" #highlight(backgroundColor , 'yellow')>Hey</div>
</div>
`)
export default class extends Component {

    @Reactive name = 'hello';

    @Reactive
    backgroundColor = 'red';

    isDirectiveDestoyedCalled;

    @Directive('name')
    nameDirective(el, binding) {
        el.setAttribute('data-name', binding.value || 'taj');
    }

    @Directive('highlight')
    highlightDirective(el, binding) {
        if (binding.params.length > 1) {
            el.style.backgroundColor = binding.value[0];
            el.style.color = binding.value[1];
        }
        else {
            el.style.backgroundColor = binding.value || 'yellow';
            el.style.color = 'black';
        }
    }


}