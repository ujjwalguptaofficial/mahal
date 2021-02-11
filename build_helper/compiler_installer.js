const { readFileSync } = require('fs');
const { execSync } = require('child_process');

const folderLocation = "../taj-html-compiler";
const content = readFileSync(`${folderLocation}/package.json`);

const packageInfo = JSON.parse(content);

if (packageInfo) {
    const version = packageInfo.version;
    console.log('version', version);
    execSync(`npm i ${folderLocation}/taj-html-compiler-${version}.tgz --no-save`);
}
else {
    throw "no package found";
}