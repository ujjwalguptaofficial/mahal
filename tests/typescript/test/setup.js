const jsdom = require('jsdom');

// console.log(process.env.NODE_ENV)

const jsdomInstance = new jsdom.JSDOM(`<!DOCTYPE html>
<html lang="en"><body> <div id="app"></div></body></html>`);
global.window = jsdomInstance.window;
global.document = window.document;
window.console = global.console;

Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        global[property] = document.defaultView[property];
    }
});

global.navigator = {
    userAgent: 'node.js'
};