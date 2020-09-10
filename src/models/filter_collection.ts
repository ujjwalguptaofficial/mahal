export class FilterCollection {
    add(name: string, filter: Function, Class) {
        Class.prototype.filters_[name] = filter;
    }

    get(name: string) {
        
    }
}