const { readFileSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const content = readFileSync("../package.json");

const packageInfo = JSON.parse(content);

const compilerFolderLocation = path.join(__dirname, "../../mahal-html-compiler");
console.log("folderLocation", compilerFolderLocation);
const compilerContent = readFileSync(`${compilerFolderLocation}/package.json`);
const compilerPackageInfo = JSON.parse(compilerContent);

if (packageInfo) {
    const version = packageInfo.version;
    console.log('version', version);
    execSync(`npm i ../mahal-${version}.tgz`);
    execSync(`npm i ${compilerFolderLocation}/mahal-html-compiler-${compilerPackageInfo.version}.tgz`);
    execSync(`npm i ../../mahal-test-utils/mahal-test-utils-0.1.0.tgz --no-save`);
}
else {
    throw "no package found";
}