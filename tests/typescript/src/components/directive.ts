import { Component, Template, Directive } from "taj";

@Template(`
<div #name('ujjwal')>Hey</div>
`)
export default class extends Component {


    @Directive('name')
    nameDirective(el, binding) {
        el.setAttribute('data-name', binding.value);
    }
}