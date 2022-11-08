const roles = ['admin', 'member', 'user'];

const authorization = (role)  => {
    return (req, res, next) => {
        if(roles.indexOf(req.user.role) > roles.indexOf(role)) {
            return res.status(403).json({
                message: 'forbidden'
            });
        }
        next();
    }
}

module.exports = authorization;
