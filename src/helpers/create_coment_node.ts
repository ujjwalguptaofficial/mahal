export const createCommentNode = (text?: string) => {
    return document.createComment(text || "");
};