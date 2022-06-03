const puppeteer = require('puppeteer');
const { describe } = require('mocha');
const path = require('path');
const { pathToFileURL } = require('url');
var http = require('http');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
const assert = require('assert');


const countObjects = async (page) => {
    const prototype = await page.evaluateHandle(() => {
        return Object.prototype;
    });
    const objects = await page.queryObjects(
        prototype
    );
    const numberOfObjects = await page.evaluate(
        (instances) => instances.length,
        objects
    );

    await prototype.dispose();
    await objects.dispose();

    return numberOfObjects;
};

async function run() {
    var directory = path.join(__dirname, '../dist');

    var serve = serveStatic(directory);

    var server = http.createServer(function (req, res) {
        var done = finalhandler(req, res);
        serve(req, res, done);
    });

    server.listen(4567);

    console.log('Listening on port 4567.');
    const browser = await puppeteer.launch({
        headless: false
    });
    // const context = await browser.createIncognitoBrowserContext({});
    const page = await browser.newPage();

    // console.log('pathtopage', pathToFileURL(pathToPage));
    await page.goto('http://localhost:4567/');

    // perform tests
    const beforeCount = await countObjects(page);
    console.log('beforeCount', beforeCount);
    (await page.$('#runlots')).click();
    await page.waitForTimeout(1000);
    (await page.$('#clear')).click();
    await page.waitForTimeout(1000);
    const afterCount = await countObjects(page);
    console.log('afterCount', afterCount);
    console.assert(beforeCount === afterCount, `difference is ${afterCount - beforeCount}`);
    server.close();
    await page.close();
    browser.close();
}
run();
