const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    return res.status(200).render('auth/login', {
        page_title: 'Login',
        invalid_credentials: req.query.u ? true : false,
        username: req.query.u
    });
}

exports.getResetPassword = (req, res, next) => {
    return res.status(200).render('auth/reset-password', {
        page_title: 'Reset Password'
    });
}

exports.postLogin = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const found = await User.findOne({username});
        if(found) {
            // compare password
            // if match redirect dashboard give jwt
        }
        return res.status(401).redirect(`/auth/login?u=${username}`);
    } catch (err) {
        next(err);
    }
}