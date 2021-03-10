export const getReplacedBy = (el) => {
    if (el.replacedBy) {
        const replacedBy = el.replacedBy;
        el.replacedBy = null;
        return replacedBy;
    }
    return el;
}