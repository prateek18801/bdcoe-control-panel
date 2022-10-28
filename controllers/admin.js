const Member = require('../models/member');

exports.getMemberRegistration = (req, res, next) => {
    res.status(200).send('<h1>Member Registration Form</h1>');
}

exports.postMemberRegistration = async (req, res, next) => {
    try {
        const saved = await new Member({...req.body}).save();
        res.status(201).json({
            message: 'success',
            saved
        });
    } catch(err) {
        next(err);
    }
}
