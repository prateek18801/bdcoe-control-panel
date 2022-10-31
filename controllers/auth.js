exports.getLogin = (req, res, next) => {
    return res.status(200).render('auth/login', {
        page_title: 'Login',
        invalid_credentials: false
    });
}

exports.getResetPassword = (req, res, next) => {
    return res.status(200).render('auth/reset-password', {
        page_title: 'Reset Password'
    });
}

exports.postLogin = (req, res, next) => {
    try {
        // if authenticated redirect
        // return res.status(300).redirect('/admin/dashboard');
        // else 
        return res.status(401).render('auth/login', {
            page_title: 'Login',
            invalid_credentials: true
        });
    } catch (err) {
        next(err);
    }
}