const Member = require('../models/member');
const Event = require('../models/event');
const Config = require('../models/config');


// PAGES

exports.getDashboard = (req, res, next) => {
    res.status(200).render('admin/dashboard', {
        page_title: 'BDCOE ~ Control Panel',
        user: {
            username: '2011093',
            role: 'admin'
        }
    });
}

exports.getMembers = async (req, res, next) => {
    try {
        const data = await Member.find({}).sort({ graduation: -1 }).limit(3).lean();
        return res.status(200).render('admin/member', {
            page_title: 'BDCOE ~ Members',
            user: {
                username: '2011093',
                role: 'admin'
            },
            data
        });
    } catch (err) {
        next(err.message);
    }
}

exports.getEvents = async (req, res, next) => {
    try {
        const data = await Event.find({}).sort({ end: -1 }).populate('coordinators', '_id fullname stdno').lean();
        return res.status(200).render('admin/event', {
            page_title: 'BDCOE ~ Events',
            user: {
                username: '2011093',
                role: 'admin'
            },
            data
        });
    } catch (err) {
        next(err.message);
    }
}

exports.getMemberForm = async (req, res, next) => {
    const stdno = req.params.id;
    try {
        const data = await Member.findOne({ stdno }).lean();
        return res.status(200).render('admin/member-form', {
            page_title: stdno ? 'Update Details' : 'Add Member',
            user: {
                username: '2011093',
                role: 'admin'
            },
            data
        });
    } catch (err) {
        next(err);
    }
}

exports.getEventForm = async (req, res, next) => {
    const code = req.params.code && req.params.code.toUpperCase();
    try {
        const data = await Event.findOne({ code }).populate('coordinators', '_id fullname stdno').lean();
        const members = await Member.find({}, "_id fullname stdno").sort({ graduation: -1 }).limit(2).lean();
        return res.status(200).render('admin/event-form', {
            page_title: code ? 'Update Event Details' : 'Add Event',
            user: {
                username: '2011093',
                role: 'admin'
            },
            data,
            members
        });
    } catch (err) {
        next(err);
    }
}


// API

exports.toggleRegistration = async (req, res, next) => {
    try {
        const config = await Config.findOne({});
        if (!config) {
            const saved = await new Config({ registration: false, modified: Date.now() }).save();
            return res.status(201).json({
                message: 'created',
                data: saved
            });
        }
        config.registration = !config.registration;
        config.modified = Date.now();
        const saved = await config.save();
        return res.status(200).json({
            message: 'modified',
            data: saved
        });
    } catch (err) {
        next(err);
    }
}


exports.postConfig = async (req, res, next) => {
    const data = {
        ...req.body
    }
    try {
        const config = await Config.findOne({});
        if (!config) {
            const saved = await new Config({ ...data }).save();
            return res.status(201).json({
                message: 'created',
                data: saved
            });
        }
        Object.keys(data).forEach(key => config[key] = data[key]);
        const updated = await config.save();
        return res.status(200).json({
            message: 'updated',
            data: updated
        });
    } catch (err) {
        next(err);
    }
}

exports.postMember = async (req, res, next) => {

    const data = {
        ...req.body,
        email: req.body.email && req.body.email.toLowerCase(),
        branch: req.body.branch && req.body.branch.toUpperCase(),
        domain: req.body.domain && req.body.domain.toUpperCase(),
        coordinator: req.body.coordinator || false,
        imageUrl: req.body.imageUrl.length === 0 ? undefined : req.body.imageUrl,
        github: req.body.github.length === 0 ? undefined : req.body.github,
        linkedin: req.body.linkedin.length === 0 ? undefined : req.body.linkedin,
        website: req.body.website.length === 0 ? undefined : req.body.github
    }

    try {

        const existing = await Member.findOne({ stdno: data.stdno });
        if (existing) {
            Object.keys(data).forEach(key => existing[key] = data[key]);
            await existing.save();
            return res.status(300).redirect('/admin/v/member');
        }

        await new Member({ ...data }).save();
        return res.status(300).redirect('/admin/v/member');

    } catch (err) {
        next(err);
    }
}

exports.postEvent = async (req, res, next) => {
    const data = {
        ...req.body,
        code: req.body.code && req.body.code.toUpperCase(),
        coordinators: req.body.coordinators || []
    }

    try {

        const existing = await Event.findOne({ code: data.code });
        if (existing) {
            Object.keys(data).forEach(key => existing[key] = data[key]);
            const updated = await existing.save();
            return res.status(200).json({
                message: 'updated',
                data: updated
            });
        }

        const saved = await new Event({ ...data }).save();
        return res.status(201).json({
            message: 'created',
            data: saved
        });

    } catch (err) {
        next(err);
    }
}

