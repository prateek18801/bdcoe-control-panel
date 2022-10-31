const router = require('express').Router();

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/reset-password', authController.getResetPassword);

module.exports = router;
