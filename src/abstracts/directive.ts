interface DirectiveBinding {
    input: string;
    args: string;
    modifiers: { [name: string]: Boolean }
}
export abstract class Directive {
    created(el: HTMLElement, binding: DirectiveBinding, value) {

    }

    inserted() {

    }

    destroyed() {

    }

    valueUpdated(value) {
        
    }

}