export const createTextNode = (value) => {
    return document.createTextNode(value);
};

export const createCommentNode = (text?: string) => {
    return document.createComment(text || "");
};