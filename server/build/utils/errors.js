"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.docSaveError = exports.sendUnauthError = exports.sendServerError = void 0;
const sendServerError = (res, err) => {
    console.log('Server error:', err);
    res.status(500).send('Error with the server. Big oops.');
};
exports.sendServerError = sendServerError;
const sendUnauthError = (res, err) => {
    console.log('Invalid token');
    res.status(403).send('Unauthorized, invalid token');
};
exports.sendUnauthError = sendUnauthError;
// Mongoose Errors
const docSaveError = (err) => {
    if (err)
        console.error('Error saving document');
    else
        console.log('Document saved successfully');
};
exports.docSaveError = docSaveError;
