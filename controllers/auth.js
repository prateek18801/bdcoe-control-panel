const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    return res.status(200).render('auth/login', {
        page_title: 'Login',
        invalid_credentials: req.query.u ? true : false,
        username: req.query.u
    });
}

exports.getSignup = (req, res, next) => {
    return res.status(200).render('auth/signup', {
        page_title: 'Signup'
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
        // const user = await User.findOne({username});
        const user = {
            _id: 'prateek18801',
            password: 'password'
        }
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = jwt.sign({
                    id: user._id,
                    username: user.username,
                    role: user.role
                }, process.env.JWT_SECRET, { expiresIn: '3d' });
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

exports.postSignup = async (req, res, next) => {
    const { username, password, email, role } = req.body;
    try {
        if (password.length < 8) {
            const error = new Error('password should be min. 8 characters long');
            error.code = 400;
            throw error;
        }
        const hash = await bcrypt.hash(password, 10);
        const saved = await new User({ password: hash, username, email, role }).save();
        return res.status(200).json({
            message: 'registered',
            data: {
                username: saved.username,
                email: saved.email,
                role: saved.role
            }
        });
    } catch (err) {
        next(err);
    }
}