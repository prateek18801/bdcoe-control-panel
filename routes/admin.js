const router = require('express').Router();

const adminController = require('../controllers/admin');

// PAGES

router.get('/dashboard', adminController.getDashboard);

router.get('/v/member/', adminController.getMembers);

// router.get('/v/event/:code?', adminController.getEvent);

router.get('/r/member/:id?', adminController.getMemberForm);

// API

router.get('/toggle', adminController.toggleRegistration);

router.post('/config', adminController.postConfig);

router.post('/r/member', adminController.postMemberForm);

router.post('/event', adminController.postEvent);

router.get('/d/registration', adminController.downloadRegistrationData);

router.get('/d/event', adminController.downloadEventData)

router.get('/d/member', adminController.downloadMemberData)

module.exports = router;