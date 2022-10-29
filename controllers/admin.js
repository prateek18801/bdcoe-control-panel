const Member = require('../models/member');
const Event = require('../models/event');

exports.getMember = async (req, res, next) => {
    const stdno = req.params.id;
    try {
        const data = stdno ? await Member.findOne({stdno}) : await Member.find({});
        return res.status(200).json({
            message: 'success',
            data
        });
    } catch(err) {
        next(err.message);
    }
}

exports.getMemberRegistration = (req, res, next) => {
    res.status(200).send('<h1>Member Registration Form</h1>');
}

exports.postMemberRegistration = async (req, res, next) => {
    
    const data = {
        ...req.body,
        email: req.body.email.toLowerCase(),
        branch: req.body.branch.toUpperCase(),
        domain: req.body.domain.toUpperCase()
    }
    
    try {

        const existing = await Member.findOne({stdno: data.stdno});
        if(existing) {
            Object.keys(data).forEach(key => existing[key] = data[key]);
            const updated = await existing.save();
            return res.status(200).json({
                message: 'updated',
                data: updated
            });
        }

        const saved = await new Member({...data}).save();
        return res.status(201).json({
            message: 'created',
            data: saved
        });

    } catch(err) {
        next(err);
    }
}


exports.getEvent = (req, res, next) => {
    
}

exports.postEvent = async (req, res, next) => {
    const data = {
        ...req.body,
        code:  req.body.code.toUpperCase()
    }

    try {

        const existing = await Event.findOne({code: data.code});
        if(existing) {
            Object.keys(data).forEach(key => existing[key] = data[key]);
            const updated = await existing.save();
            return res.status(200).json({
                message: 'updated',
                data: updated
            });
        }

        const saved = await new Event({...data}).save();
        return res.status(201).json({
            message: 'created',
            data: saved
        });

    } catch(err) {
        next(err);
    }
}