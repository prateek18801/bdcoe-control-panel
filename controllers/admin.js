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


exports.getEvent = (req, res, next) => {

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

exports.postMemberForm = async (req, res, next) => {

    const data = {
        ...req.body,
        email: req.body.email && req.body.email.toLowerCase(),
        branch: req.body.branch && req.body.branch.toUpperCase(),
        domain: req.body.domain && req.body.domain.toUpperCase(),
        coordinator: req.body.coordinator || false
    }

    try {

        const existing = await Member.findOne({ stdno: data.stdno });
        if (existing) {
            Object.keys(data).forEach(key => existing[key] = data[key]);
            await existing.save();
            const members = await Member.find({}).sort({ graduation: -1 }).limit(3).lean();
            return res.status(200).render('admin/member', {
                page_title: 'BDCOE ~ Members',
                user: {
                    username: '2011093',
                    role: 'admin'
                },
                data: members
            });
        }

        await new Member({ ...data }).save();
        const members = await Member.find({}).sort({ graduation: -1 }).limit(3).lean();
        return res.status(200).render('admin/member', {
            page_title: 'BDCOE ~ Members',
            user: {
                username: '2011093',
                role: 'admin'
            },
            data: members
        });

    } catch (err) {
        next(err);
    }
}

exports.postEvent = async (req, res, next) => {
    const data = {
        ...req.body,
        code: req.body.code && req.body.code.toUpperCase()
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
