const jsdom = require('jsdom');
const { expect } = require("chai");


// console.log(process.env.NODE_ENV)
// global.expect = expect;
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


window.onerror = function (message, source, lineno, colno, error) {
    window.error = message;
};

window.onunhandledrejection = function (message) {
    window.error = message;
};

const virtualConsole = jsdom.createVirtualConsole();
virtualConsole.on('error', (...errors) => {
    console.log("errors caught at", errors)
});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});