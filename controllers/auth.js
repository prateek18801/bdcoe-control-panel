const jwt = require('jsonwebtoken');

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
        // const found = await User.findOne({username});
        const found = {
            _id: 'prateek18801',
            password: 'password'
        }
        if (found) {
            if (password === found.password) {
                console.log(process.env.JWT_TOKEN);
                const token = jwt.sign({ id: found._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
                console.log(token);
                return res.cookie('auth', token, {
                    httpOnly: true,
                    maxAge: 259200000
                }).status(300).redirect('/admin/dashboard');
            }
        }
        return res.status(401).redirect(`/auth/login?u=${username}`);
    } catch (err) {
        next(err);
    }
}