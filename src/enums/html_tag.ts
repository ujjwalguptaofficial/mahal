const tags = [
    "div", "p", "b", "u", "i", "span", "input", "button",
    "table", "tr", "th", "td", "thead", "tbody", "tfoot", "a",
    "h1", "h2", "h3", "h4", "h5", "h6", "pre",
    "section", "video", "audio", "ul", "ol", "li", "img", "nav", "br",
    "svg",
    "slot", "target"
];
export const HTML_TAG = new Map<string, number>();
tags.forEach(tag => HTML_TAG.set(tag, 1));
