export let tags = [];

if (process.env.NODE_ENV !== 'production') {
    tags = require("html-tags").concat(['slot', 'target']);
}

export const HTML_TAG = new Set(tags);
