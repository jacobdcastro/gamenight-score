"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomDigit = exports.getRandomUpper = void 0;
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
const getRandomUpper = () => String.fromCharCode(getRandomInt(26) + 65);
exports.getRandomUpper = getRandomUpper;
const getRandomDigit = () => getRandomInt(10).toString();
exports.getRandomDigit = getRandomDigit;
const generatePasscode = () => [...Array(4)]
    .map(() => {
    if (getRandomInt(2) === 0)
        return exports.getRandomUpper();
    else
        return exports.getRandomDigit();
})
    .join('');
exports.default = generatePasscode;
