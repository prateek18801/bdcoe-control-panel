const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
    const token = req.cookies.auth;
    if (token) {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {
                username: data.username,
                role: data.role
            };
        } catch (next) {
            next(err);
        }
    }
    next();
}

module.exports = authentication;