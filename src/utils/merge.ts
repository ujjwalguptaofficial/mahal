export const merge = function (obj1, obj2) {
    obj1 = Object.assign({}, obj1);
    return Object.assign(obj1, obj2);
}