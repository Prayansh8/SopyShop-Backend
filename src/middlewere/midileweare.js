const config = require('../config');
const jwt = require('jsonwebtoken');

function checkToken(req, res, next) {
    let token = req.headers["authorization"];
    if (!token) {
        return res.status(403).send({ 'detail': 'Unauthorised' });
    }
    try {
        token = token.split(' ')[1];
        const decoded = jwt.verify(token, config.jwt.jwtSecretKey);
        req.user = decoded;
    } catch (err) {
        console.error(err)
        return res.status(401).send({ 'detail': 'Invalid Token' });
    }
    next();
}

module.exports = {
    checkToken,
}