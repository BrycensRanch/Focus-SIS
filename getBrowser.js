import { getEdgePath } from 'edge-paths';

export default async function getBrowser() {
let browser;

try {
return browser = getEdgePath() 
}
catch(e) {
console.error("Failed to find Microsoft Edge browser installation")
}
try {
    const chromePaths = require('chrome-paths');

    if (chromePaths.chrome) {
    return browser = chromePaths.chrome
    }
}
catch(e) {
    console.error("Failed to find Google Chrome browser installation")
}
try {
    return browser = require('firefox-location').default
}
catch(e) {
    console.error("Failed to find Mozilla Firefox browser installation")
}
};