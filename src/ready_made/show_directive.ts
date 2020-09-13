
export function showDirective(el: HTMLElement, binding, component) {
    function setElementShowHide(value) {
        el.style.display = value ? 'unset' : 'none';
    }
    return {
        created(value) {
            setElementShowHide(value);
        },
        valueUpdated(value) {
            setElementShowHide(value);
        }
    }
}
