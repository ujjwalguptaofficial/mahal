// export const stringRegex = new RegExp(/["\']/g);
export const stringRegex = new RegExp(/^[0-9]|["\']/);
// export const jsKeywordRegex = /\b(?!(?:false|true\b))([a-zA-Z]+)/g;
export const jsKeywordRegex = /\b(?!(?:false|true\b))([a-zA-Z]+)/;
export const contextString = "ctx";