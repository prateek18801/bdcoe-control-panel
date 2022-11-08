const router = require('express').Router();

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

router.post('/password/update', authController.postUpdatePassword);

router.get('/password/reset', authController.getResetPassword);

module.exports = router;
