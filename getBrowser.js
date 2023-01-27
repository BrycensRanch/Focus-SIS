const {getEdgePath} = require("edge-paths")
const shellExec = require("shell-exec").default
module.exports =async function getBrowser() {
let browser = null;

try {
return browser = getEdgePath() 
}
catch(e) {
console.error("Failed to find Microsoft Edge browser installation, now trying other alternative browsers (requires installation of other dependencies)")
}
await shellExec("npm install chrome-paths --no-save")
const chromePaths = require('chrome-paths');

return browser = chromePaths.chrome;
await shellExec("npm install firefox-location --no-save")
return browser = require('firefox-location')
return browser;
}