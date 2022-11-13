const roles = ['admin', 'member', 'user'];

const authorization = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).redirect('/auth/login');
        }
        if (roles.indexOf(req.user.role) > roles.indexOf(role)) {
            return res.status(403).json({
                message: 'forbidden'
            });
        }
        next();
    }
}

module.exports = authorization;
