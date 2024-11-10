const seedrandom = require('seedrandom')
const rng = seedrandom('mySeed')

export const uid = ()=>{
    let time = Date.now().toString(36).toLocaleUpperCase();
    let randoms = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
    randoms = randoms.toString(36).slice(0, 12).padStart(12,'0').toLocaleUpperCase();
    return ''.concat(time,'-',randoms);
}


export function generateAccountIdentifier() {
    // This function should return a unique identifier for each account.
    // For simplicity, we're generating a random one here.
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const identifier = Math.floor(rng() * characters.length)
    for (var i = 0; i < 6; i++) {
        result += characters.charAt(identifier);
    }
    return result;
}
function generateTransactionIdentifier() {
    var result = '';
    var numbers = '0123456789';
    for (var i = 0; i < 6; i++) {
        result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return result;
}

export function generateReferenceNumber() {
    var accountId = generateAccountIdentifier();
    var transactionId = generateTransactionIdentifier();

    return accountId + transactionId;
}
