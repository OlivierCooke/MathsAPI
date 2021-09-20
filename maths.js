/*
    Auteur: Olivier Cooke
    But: Module Maths qui permet de calculer les résultats 
*/

exports.addition = (x, y) => x + y;
exports.soustraction = (x, y) => x - y;
exports.multiplication = (x, y) => x * y;
exports.division = (x, y) => x / y;
exports.modulo = (x, y) => x % y;
exports.factoriel = factoriel;
exports.estPrime = estPrime;
exports.nPrime = nPrime;

function factoriel(n) {
    if (n == 0 || n == 1) {
        return 1
    }
    return n * factoriel(n - 1)
}

function estPrime(n) {
    for (let i = 2; i < n; i++) {
        if (n % i == 0) {
            return false
        }
    }
    return 1 < n
}

function nPrime(index) {
    let n = 0;
    for (let i = 0; i < index; i++) {
        n++;
        while (!estPrime(n)) {
            n++;
        }
    }
    return n;
}