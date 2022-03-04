const { readFileSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const folderLocation = path.join(__dirname, "../../mahal-html-compiler");
console.log("folderLocation", folderLocation);
const content = readFileSync(`${folderLocation}/package.json`);

const packageInfo = JSON.parse(content);

if (packageInfo) {
    const version = packageInfo.version;
    console.log('version', version);
    execSync(`cd tests && npm un mahal-html-compiler`);
    execSync(`cd tests && npm i ${folderLocation}/mahal-html-compiler-${version}.tgz`);
}
else {
    throw "no package found";
}