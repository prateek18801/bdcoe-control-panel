const Event = require('../models/event');
const Member = require('../models/member');
const Config = require('../models/config');
const Contact = require('../models/contact');
const Registration = require('../models/registration');

exports.getStatus = async (req, res, next) => {
    try {
        const config = await Config.find({}).sort({ createdAt: -1 }).limit(1);
        if (!config) {
            const error = new Error('configuration not set');
            error.code = 500;
            throw error;
        }
        return res.status(200).json({
            message: 'success',
            status: config.registration,
            event: config.upcoming_event,
            modified: config.modified
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