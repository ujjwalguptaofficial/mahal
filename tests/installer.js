const { readFileSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const content = readFileSync("../package.json");

const packageInfo = JSON.parse(content);

// const compilerFolderLocation = path.join(__dirname, "../../mahal-html-compiler");
// console.log("folderLocation", compilerFolderLocation);
// const compilerContent = readFileSync(`${compilerFolderLocation}/package.json`);
// const compilerPackageInfo = JSON.parse(compilerContent);

// const testUtilsFolderLocation = path.join(__dirname, "../../mahal-test-utils");
// console.log("testUtilsFolderLocation", testUtilsFolderLocation);
// const testUtilsContent = readFileSync(`${testUtilsFolderLocation}/package.json`);
// const testUtilsPackageInfo = JSON.parse(testUtilsContent);

 // execSync(`npm i ${compilerFolderLocation}/mahal-html-compiler-${compilerPackageInfo.version}.tgz`);
    // execSync(`npm i ../../mahal-test-utils/mahal-test-utils-${testUtilsPackageInfo.version}.tgz`);

if (packageInfo) {
    const version = packageInfo.version;
    console.log('version', version);
    execSync(`npm i ../mahal-${version}.tgz --no-save`);
   
}
else {
    throw "no package found";
}