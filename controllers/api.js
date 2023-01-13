const Event = require('../models/event');
const Member = require('../models/member');
const Config = require('../models/config');
const Contact = require('../models/contact');
const Registration = require('../models/registration');

const { registerEmail, contactEmail } = require('../services/email');

exports.getStatus = async (req, res, next) => {
    try {
        const config = await Config.findOne({}, '-_id -__v').sort({ createdAt: -1 }).lean();
        if (!config) {
            return res.status(200).json({
                message: 'failed'
            });
        }
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
    const year = req.params.year;
    try {
        const data = year ? await Member.find({ graduation: year }, '-contact') : await Member.find({}, '-contact').sort({ graduation: -1, fullname: 1 });
        return res.status(200).json({
            message: 'success',
            data
        });
    } catch (err) {
        next(err);
    }
}

exports.postRegister = async (req, res, next) => {
    const data = {
        ...req.body
    }
    try {
        const saved = await new Registration(data).save();

        res.status(201).json({
            message: 'created',
            data: saved
        });

        registerEmail(data.name, data.email);

    } catch (err) {
        next(err);
    }
}

exports.postContact = async (req, res, next) => {
    const data = {
        ...req.body
    }

    try {

        // check for captcha reponse
        if (!req.body['g-recaptcha-response']) {
            return res.json({
                message: 'captcha error'
            });
        }

        // verify captcha response
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            cache: 'no-cache',
            body: JSON.stringify({
                secret: CAPTCHAV2_SECRET_KEY,
                response: req.body['g-recaptcha-response']
            })
        });
        const json = await response.json();

        // if invalid reponse (not human)
        if (!json.success) {
            return res.json({
                message: 'captcha error'
            });
        }

        const saved = await new Contact(data).save();
        res.status(201).json({
            message: 'created',
            data: saved
        });

        contactEmail(data.name, data.email);

    } catch (err) {
        next(err);
    }
}