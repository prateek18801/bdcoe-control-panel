const Member = require('../models/member');

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