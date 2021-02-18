export function getDataype(value) {
    if (value == null) {
        return "null";
    }
    const type = typeof value;
    switch (type) {
        case 'object':
            if (Array.isArray(value)) {
                return "array";
            }
        default:
            return type;
    }
}