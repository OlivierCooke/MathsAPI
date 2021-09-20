const http = require('http');
const url = require('url');

function AccessControlConfig(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
}
function Prefligth(req, res) {
    if (req.method === 'OPTIONS') {
        console.log('preflight CORS verifications');
        res.end();
        // request handled
        return true;
    }
    // request not handled
    return false;
}


module.exports = http.createServer((req, res) => {
    AccessControlConfig(res);
    if (!Prefligth(req, res)) {
        var mathOps = require('./controller.js');
        const reqUrl = url.parse(req.url, true);
        // GET endpoint
        if (reqUrl.pathname == '/api/maths' && req.method === 'GET') {
            if (mathOps.validateParams(req, res)) {
                console.log('in')
                mathOps.calculate(req, res)
            }
            else {
                console.log('out')
            }
        } else {
            mathOps.invalidUrl(req, res);
        }
    }
})