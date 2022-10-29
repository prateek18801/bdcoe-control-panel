const Event = require('../models/event');
const Member = require('../models/member');

exports.getEvent = async (req, res, next) => {
    const code = req.params.code.toUpperCase();
    const q = req.query.q;
    try {
        const data = code ? await Event.findOne({code}, '-_id eventname code description images') : await Event.find({}, '-_id eventname code description images').sort({end: -1}).limit(+q);
        return res.status(200).json({
            message: 'success',
            data
        });
    } catch(err) {
        next(err);
    }
}

exports.getMember = async (req, res, next) => {
    const stdno = req.params.id;
    try {
        const data = stdno ? await Member.findOne({stdno}, '-_id fullname graduation domain imageUrl github linkedin website') : await Member.find({}, '-_id fullname graduation domain imageUrl github linkedin website').sort({graduation: -1}).limit(3);
        return res.status(200).json({
            message: 'success',
            data
        });
    } catch(err) {
        next(err);
    }
}