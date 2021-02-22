
let renderer;
export const createRenderer = (src) => {
    if (renderer) {
        return renderer(src);
    }
    try {
        const compiler = require("mahal-html-compiler");
        renderer = compiler.createRenderer;

    } catch (error) {
        throw "Unable to find mahal-html-compiler, please install the package";
    }
}