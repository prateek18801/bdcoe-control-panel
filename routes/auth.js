const router = require('express').Router();

const authController = require('../controllers/auth');
const authorization = require('../middlewares/authorization');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/logout', authController.getLogout);

router.get('/signup', authorization('admin'), authController.getSignup);

router.post('/signup', authorization('admin'), authController.postSignup);

router.post('/password/update', authorization('member'), authController.postUpdatePassword);

router.get('/password/reset', authorization('member'), authController.getResetPassword);

module.exports = router;
