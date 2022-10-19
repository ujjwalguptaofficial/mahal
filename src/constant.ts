export const EL_REPLACED = '_mhlreplaced_';
export const MAHAL_KEY = '_mhlkey_';
export const ARRAY_MUTABLE_METHODS = ["push", "pop", "splice", "shift", "unshift", "reverse"]
export const OBJECT_MUTABLE_METHODS = ARRAY_MUTABLE_METHODS.concat(['add', 'update', 'delete']);
export const EMIT_DESTROY = "__emit_destroy__";
export const CHILD_DESTROY = "__child_destroy__";
export const emptyObj = Object.freeze({});