const { readFileSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const content = readFileSync("../../package.json");

const packageInfo = JSON.parse(content);

const compilerFolderLocation = path.join(__dirname, "../../../taj-html-compiler");
console.log("folderLocation", compilerFolderLocation);
const compilerContent = readFileSync(`${compilerFolderLocation}/package.json`);
const compilerPackageInfo = JSON.parse(compilerContent);

if (packageInfo) {
    const version = packageInfo.version;
    console.log('version', version);
    execSync(`npm i ../../taj-${version}.tgz`);
    execSync(`npm i ${compilerFolderLocation}/taj-html-compiler-${version}.tgz`);
    execSync(`npm i ../../../taj-test/taj-test-${version}.tgz --no-save`);
}
else {
    throw "no package found";
}