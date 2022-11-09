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
    return res.status(200).render('auth/password/reset', {
        page_title: 'Reset Password'
    });
}

exports.postLogin = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = jwt.sign({
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
            return res.status(400).json({
                message: 'falied'
            });
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

exports.postUpdatePassword = async (req, res, next) => {
    const { password, new_password, conf_password } = req.body;
    try {
        if (new_password !== conf_password || new_password.length < 8) {
            return res.status(400).json({
                message: 'falied',
            });
        }
        const user = await User.findOne({ username: req.user.username });
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(403).json({
                message: 'forbidden'
            });
        }
        const hash = await bcrypt.hash(new_password, 10);
        user.password = hash;
        await user.save();
        return res.status(200).json({
            message: 'updated'
        });
    } catch (err) {
        next(err);
    }
}
