import { Component, Template, Directive, Reactive } from "taj";

@Template(`
<div>
  <div id="el1" #name('ujjwal')>Hey</div>
  <div id="el2" #name(name)>Hey</div>
</div>
`)
export default class extends Component {

    @Reactive name = 'hello';

    isDirectiveDestoyedCalled;
    
    @Directive('name')
    nameDirective(el, binding) {
        el.setAttribute('data-name', binding.value);
    }
}