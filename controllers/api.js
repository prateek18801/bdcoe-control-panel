const Event = require('../models/event');
const Member = require('../models/member');
const Config = require('../models/config');
const Registration = require('../models/registration');

exports.getStatus = async (req, res, next) => {
    try {
        const config = await Config.findOne({}).populate('upcoming_event', '-_id eventname description start end');
        if(!config) {
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
    } catch(err) {
        next(err);
    }
}

exports.getEvent = async (req, res, next) => {
    const code = req.params.code && req.params.code.toUpperCase();
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

exports.getRegister = (req, res, next) => {

}

exports.postRegister = async (req, res, next) => {
    const data = {
        ...req.body
    }
    try {
        const saved = await new Registration({...data}).save();
        return res.status(201).json({
            message: 'created',
            data: saved
        });
    } catch(err) {
        next(err);
    }
}