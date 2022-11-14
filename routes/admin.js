const router = require('express').Router();

const adminController = require('../controllers/admin');
const authorization = require('../middlewares/authorization');

// PAGES

router.get('/dashboard', authorization('member'), adminController.getDashboard);

router.get('/v/member', authorization('member'), adminController.getMembers);

router.get('/v/event', authorization('member'), adminController.getEvents);

router.get('/r/member/:id?', authorization('admin'), adminController.getMemberForm);

router.get('/r/event/:code?', authorization('admin'), adminController.getEventForm);

router.get('/profile', authorization('member'), adminController.getProfile);

router.get('/config', authorization('admin'), adminController.getConfig);

// API

router.get('/toggle', authorization('admin'), adminController.toggleRegistration);

router.post('/config', authorization('admin'), adminController.postConfig);

router.post('/r/member', authorization('admin'), adminController.postMember);

router.post('/r/event', authorization('admin'), adminController.postEvent);

router.get('/d/member/:id', authorization('admin'), adminController.deleteMember);

router.get('/d/event/:id', authorization('admin'), adminController.deleteEvent);

router.get('/download/registration', authorization('member'), adminController.downloadRegistrationData);

router.get('/download/event', authorization('member'), adminController.downloadEventData)

router.get('/download/member', authorization('member'), adminController.downloadMemberData)

module.exports = router;