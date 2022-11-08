const router = require('express').Router();

const adminController = require('../controllers/admin');

// PAGES

router.get('/dashboard', adminController.getDashboard);

router.get('/v/member', adminController.getMembers);

router.get('/v/event', adminController.getEvents);

router.get('/r/member/:id?', adminController.getMemberForm);

router.get('/r/event/:code?', adminController.getEventForm);

router.get('/profile', adminController.getProfile);

// API

router.get('/toggle', adminController.toggleRegistration);

router.post('/config', adminController.postConfig);

router.post('/r/member', adminController.postMember);

router.post('/r/event', adminController.postEvent);

router.get('/d/member/:id', adminController.deleteMember);

router.get('/d/event/:id', adminController.deleteEvent);

router.get('/d/registration', adminController.downloadRegistrationData);

router.get('/d/event', adminController.downloadEventData)

router.get('/d/member', adminController.downloadMemberData)

module.exports = router;