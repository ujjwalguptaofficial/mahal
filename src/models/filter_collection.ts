export class FilterCollection {
    add(name: string, filter: Function, Class) {
        Class.prototype.$_filters[name] = filter;
    }

    get(name: string) {
        
    }
}