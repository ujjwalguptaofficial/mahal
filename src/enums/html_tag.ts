// const exist = 1;
const tags = [
    "div", "p", "b", "span", "input", "u", "button",
    "table", "tr", "td", "thead", "tbody", "tfoot", "slot",
    "target", "a", "h1", "h2", "h3", "h4", "h5", "h6"
];
export const HTML_TAG = {};
tags.forEach(tag => HTML_TAG[tag] = true);