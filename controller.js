const url = require('url');
const mathModule = require('./maths.js');

const availableEndpoints = [
    {
        method: "GET",
        getCours: "/api/maths"
    }
]
const consumeURL = function (url) {
    let pairs = url.slice(1).split('&');
    let res = {};
    pairs.forEach(function (p) {
        p = p.split('=');
        res[p[0]] = p[1];
    });

    return JSON.parse(JSON.stringify(res));
}
const paramError = function (params, error, res) {
    params["error"] = error
    res.statusCode = 200;
    res.setHeader('content-Type', 'Application/json');
    res.end(JSON.stringify(params))
    return false;
}
const result = function (params, val, res) {
    if (isNaN(val)) val = "NaN";
    if (val === Infinity) val = 'Infinite';
    params['value'] = val;
    res.statusCode = 200;
    res.setHeader('content-Type', 'Application/json');
    res.end(JSON.stringify(params))
}
exports.invalidUrl = function (req, res) {
    var response = [
        {
            "message": "Endpoint incorrect. Les options possibles sont "
        },
        availableEndpoints
    ]
    res.statusCode = 404;
    res.setHeader('content-Type', 'Application/json');
    res.end(JSON.stringify(response))
}
exports.validateParams = function (req, res) {
    let url = req.url;
    url = url.substring(url.indexOf('?'), url.length);
    let params = consumeURL(url);
    if ('op' in params) {
        switch (params.op) {
            case ' ':
            case '+':
            case '-':
            case '*':
            case '/':
            case '%':
                let x = 0;
                let y = 0;
                if ('x' in params) {
                    x = parseFloat(params.x);
                    if (isNaN(x)) {
                        return paramError(params, 'x parameter is not a number', res);
                    }
                    else {
                        if ('y' in params) {
                            y = parseFloat(params.y)
                            if (isNaN(y)) {
                                return paramError(params, 'y parameter is not a number', res);
                            }
                            else {
                                if (Object.keys(params).length > 3) {
                                    return paramError(params, 'too many params', res);
                                }
                            }
                        }
                        else {
                            return paramError(params, 'y parameter is missing', res);
                        }
                    }
                }
                else {
                    return paramError(params, 'x parameter is missing', res);
                }
                break;
            case '!':
            case 'p':
            case 'n':
                let n = 0;
                if ('n' in params) {
                    n = parseInt(params.n);
                    if (isNaN(n)) {
                        return paramError(params, 'n is not an integer', res);
                    }
                    else {
                        if (n < 0) {
                            return paramError(params, 'n must be > 0', res);
                        }
                        else {
                            if (Object.keys(params).length > 2) {
                                return paramError(paramError, 'too many params', res);
                            }
                        }
                    }
                } else {
                    return paramError(params, 'n parameter is missing', res);
                }
                break;
            default:
                return paramError(params, 'operation is not supported', res);
        }
    }
    else {
        return paramError(params, 'no operator', res);
    }
    return true
}
exports.calculate = function (req, res) {
    let url = req.url
    url = url.substring(url.indexOf('?'), url.length);
    let params = consumeURL(url);

    if ('x' in params) params.x = parseFloat(params.x);
    if ('y' in params) params.y = parseFloat(params.y);
    if ('n' in params) params.n = parseInt(params.n);
    switch (params.op) {
        case ' ':
        case '+':
            result(params, mathModule.addition(params.x, params.y), res);
            break;
        case '-':
            result(params, mathModule.soustraction(params.x, params.y), res);
            break;
        case '*':
            result(params, mathModule.multiplication(params.x, params.y), res);
            break;
        case '/':
            result(params, mathModule.division(params.x, params.y), res);
            break;
        case '%':
            result(params, mathModule.modulo(params.x, params.y), res);
            break;
        case '!':
            result(params, mathModule.factoriel(params.n), res);
            break;
        case 'p':
            result(params, mathModule.estPrime(params.n), res);
            break;
        case 'n':
            result(params, mathModule.nPrime(params.n), res);
            break;
    }
}