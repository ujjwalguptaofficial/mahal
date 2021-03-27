export const createCommentNode = (text?: string) => {
    return Promise.resolve(
        document.createComment(text || "")
    );
};