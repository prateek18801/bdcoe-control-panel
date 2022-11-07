const router = require('express').Router();

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

router.get('/reset-password', authController.getResetPassword);

module.exports = router;
