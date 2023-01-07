const router = require('express').Router();

const apiController = require('../controllers/api');

router.get('/v1/status', apiController.getStatus);

router.get('/v1/event/:code?', apiController.getEvent);

router.get('/v1/member/:year?', apiController.getMember);

router.post('/v1/register', apiController.postRegister);

router.post('/v1/contact', apiController.postContact);

module.exports = router;