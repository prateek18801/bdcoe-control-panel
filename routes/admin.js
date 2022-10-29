const router = require('express').Router();

const adminController = require('../controllers/admin');

router.get('/member/:id?', adminController.getMember);

router.get('/member/register', adminController.getMemberRegistration);

router.post('/member/register', adminController.postMemberRegistration);

router.post('/event', adminController.postEvent);

module.exports = router;