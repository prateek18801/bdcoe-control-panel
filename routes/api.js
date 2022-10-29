const router = require('express').Router();

const apiController = require('../controllers/api');

router.get('/v1/status', apiController.getStatus);

router.get('/v1/event/:code?', apiController.getEvent);

router.get('/v1/member/:id?', apiController.getMember);

module.exports = router;