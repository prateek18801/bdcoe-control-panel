const Event = require('../models/event');
const Member = require('../models/member');
const Config = require('../models/config');
const Contact = require('../models/contact');
const Registration = require('../models/registration');

exports.getStatus = async (req, res, next) => {
    try {
        const config = await Config.findOne({}, '-_id -__v').sort({ createdAt: -1 }).lean();
        if (!config) {
            return res.status(200).json({
                message: 'failed'
            });
        }
        console.log(config);
        return res.status(200).json({
            message: 'success',
            data: config
        });
    } catch (err) {
        next(err);
    }
}

exports.getEvent = async (req, res, next) => {
    const code = req.params.code && req.params.code.toUpperCase();
    const q = req.query.q;
    try {
        const data = code ? await Event.findOne({ code }, '-budget') : await Event.find({}, '-budget').sort({ end: -1 }).limit(+q);
        return res.status(200).json({
            message: 'success',
            data
        });
    } catch (err) {
        next(err);
    }
}

exports.getMember = async (req, res, next) => {
    const stdno = req.params.id;
    try {
        const data = stdno ? await Member.findOne({ stdno }, '-contact') : await Member.find({}, '-contact').sort({ graduation: -1, fullname: 1 });
        return res.status(200).json({
            message: 'success',
            data
        });
    } catch (err) {
        next(err);
    }
}

exports.getRegister = (req, res, next) => {

}

exports.postRegister = async (req, res, next) => {
    const data = {
        ...req.body
    }
    try {
        const saved = await new Registration({ ...data }).save();
        return res.status(201).json({
            message: 'created',
            data: saved
        });
    } catch (err) {
        next(err);
    }
}

exports.postContact = async (req, res, next) => {
    const data = {
        ...req.body
    }

    try {
        // check for captcha validity

        const saved = await new Contact(data).save();
        return res.status(201).json({
            message: 'created',
            data: saved
        });
    } catch(err) {
        next(err);
    }
}