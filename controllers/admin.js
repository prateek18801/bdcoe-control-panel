const path = require('path');
const fs = require('fs');

const Member = require('../models/member');
const Event = require('../models/event');
const Config = require('../models/config');
const User = require('../models/user');

const jsontocsv = require('../utils/jsontocsv');

// PAGES

exports.getDashboard = (req, res, next) => {
    res.status(200).render('admin/dashboard', {
        page_title: 'BDCOE ~ Control Panel',
        user: req.user
    });
}

exports.getMembers = async (req, res, next) => {
    try {
        const data = await Member.find({}).sort({ graduation: -1, fullname: 1 }).lean();
        return res.status(200).render('admin/member', {
            page_title: 'BDCOE ~ Members',
            user: req.user,
            data
        });
    } catch (err) {
        next(err.message);
    }
}

exports.getEvents = async (req, res, next) => {
    try {
        const data = await Event.find({}).sort({ end: -1 }).lean();
        return res.status(200).render('admin/event', {
            page_title: 'BDCOE ~ Events',
            user: req.user,
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
            user: req.user,
            data
        });
    } catch (err) {
        next(err);
    }
}

exports.getEventForm = async (req, res, next) => {
    const code = req.params.code && req.params.code.toUpperCase();
    try {
        const data = await Event.findOne({ code }).lean();
        return res.status(200).render('admin/event-form', {
            page_title: code ? 'Update Event Details' : 'Add Event',
            user: req.user,
            data
        });
    } catch (err) {
        next(err);
    }
}

exports.getConfig = async (req, res, next) => {
    try {
        const data = await Config.findOne({}).sort({ createdAt: -1 }).lean();
        return res.status(200).render('admin/config', {
            page_title: 'Configuration',
            user: req.user,
            data
        });
    } catch (err) {
        next(err);
    }
}

exports.getProfile = async (req, res, next) => {
    try {
        const member = await Member.findOne({ stdno: req.user.username });
        return res.status(200).render('admin/profile', {
            page_title: `${req.user.username} ~ Profile`,
            user: req.user,
            member
        });
    } catch (err) {
        next(err);
    }
}


// API

exports.toggleRegistration = async (req, res, next) => {
    try {
        const config = await Config.findOne({}).sort({ createdAt: -1 });
        
        if (!config) return res.status(300).redirect('/admin/config');
        
        config.form_status = !config.form_status;
        config.modified_by = req.user.username;
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
        ...req.body,
        modified_by: req.user.username
    }
    try {
        const config = await Config.findOne({ event_code: data.event_code });
        if (!config) {
            await new Config(data).save();
            return res.status(300).redirect('/admin/dashboard');
        }
        Object.keys(data).forEach(key => config[key] = data[key]);
        await config.save();
        return res.status(300).redirect('/admin/dashboard');
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
        imageUrl: req.body.imageUrl.length === 0 ? undefined : req.body.imageUrl,
        github: req.body.github.length === 0 ? undefined : req.body.github,
        linkedin: req.body.linkedin.length === 0 ? undefined : req.body.linkedin,
        website: req.body.website.length === 0 ? undefined : req.body.website
    }

    try {

        const existing = await Member.findOne({ stdno: data.stdno });
        if (existing) {
            Object.keys(data).forEach(key => existing[key] = data[key]);
            await existing.save();
            return res.status(300).redirect('/admin/v/member');
        }

        await new Member(data).save();
        return res.status(300).redirect('/admin/v/member');

    } catch (err) {
        next(err);
    }
}

exports.postEvent = async (req, res, next) => {

    const data = {
        ...req.body,
        code: req.body.code && req.body.code.toUpperCase(),
        images: req.body.images && (Array.isArray(req.body.images) ? req.body.images.filter(img => img) : undefined)
    }

    try {

        const existing = await Event.findOne({ code: data.code });
        if (existing) {
            Object.keys(data).forEach(key => existing[key] = data[key]);
            const updated = await existing.save();
            return res.status(300).redirect('/admin/v/event');
        }

        const saved = await new Event(data).save();
        return res.status(300).redirect('/admin/v/event');

    } catch (err) {
        next(err);
    }
}

exports.deleteMember = async (req, res, next) => {
    const _id = req.params.id;
    try {
        const deleted = await Member.findByIdAndDelete(_id);
        return res.status(200).json({
            message: 'deleted',
            data: deleted
        });
    } catch (err) {
        next(err);
    }
}

exports.deleteEvent = async (req, res, next) => {
    const _id = req.params.id;
    try {
        const deleted = await Event.findByIdAndDelete(_id);
        return res.status(200).json({
            message: 'deleted',
            data: deleted
        });
    } catch (err) {
        next(err);
    }
}

exports.updateProfile = async (req, res, next) => {
    
    try {
        const existing = await Member.findOne({ stdno: req.user.username });
        if (!existing) {
            const error = new Error('member does not exist');
            error.code = 400;
            next(error);
        }

        const data = {
            ...req.body,
            stdno: req.user.username,
            email: req.body.email && req.body.email.toLowerCase(),
            branch: req.body.branch && req.body.branch.toUpperCase(),
            domain: req.body.domain && req.body.domain.toUpperCase(),
            imageUrl: req.body.imageUrl && req.body.imageUrl.length ? req.body.imageUrl : undefined,
            github: req.body.github && req.body.github.length ? req.body.github : undefined,
            linkedin: req.body.linkedin && req.body.linkedin.length ? req.body.linkedin : undefined,
            website: req.body.website && req.body.website.length ? req.body.website : undefined,
            coordinator: existing.coordinator,
            graduation: existing.graduation
        }

        Object.keys(data).forEach(key => existing[key] = data[key]);
        await existing.save();
        return res.status(300).redirect('/admin/profile');

    } catch (err) {
        next(err);
    }
}

exports.downloadRegistrationData = async (req, res, next) => {

}

exports.downloadEventData = async (req, res, next) => {
    try {
        const jsondata = await Event.find({}).sort({ start: -1 }).lean();

        const config = [
            { key: '_id', field: 'ID' },
            { key: 'eventname', field: 'Event name' },
            { key: 'code', field: 'Event code' },
            { key: 'tag', field: 'Tagline' },
            { key: 'description', field: 'Description' },
            { key: 'start', field: 'Start' },
            { key: 'end', field: 'End' },
            { key: 'participants', field: 'Participants' },
            { key: 'budget', field: 'Budget' }
        ];

        const CSV = jsontocsv(jsondata, config);
        const PATH = path.join(require.main.filename, '..', 'data', 'bdcoe_events.csv');
        fs.writeFileSync(PATH, CSV);
        return res.download(PATH);
    } catch (err) {
        next(err);
    }
}

exports.downloadMemberData = async (req, res, next) => {
    try {
        const jsondata = await Member.find({}).sort({ graduation: -1, fullname: 1 }).lean();

        const config = [
            { key: '_id', field: 'ID' },
            { key: 'fullname', field: 'Name' },
            { key: 'stdno', field: 'Std. no' },
            { key: 'email', field: 'Email' },
            { key: 'contact', field: 'Contact' },
            { key: 'branch', field: 'Branch' },
            { key: 'section', field: 'Section' },
            { key: 'graduation', field: 'Batch' },
            { key: 'domain', field: 'Domain' },
            { key: 'dob', field: 'DOB' },
            { key: 'imageUrl', field: 'Image' },
            { key: 'linkedin', field: 'Linkedin' },
            { key: 'github', field: 'Github' },
            { key: 'website', field: 'Website' },
            { key: 'coordinator', field: 'Coordinator' }
        ];

        const CSV = jsontocsv(jsondata, config);
        const PATH = path.join(require.main.filename, '..', 'data', 'bdcoe_members.csv');
        fs.writeFileSync(PATH, CSV);
        return res.download(PATH);
    } catch (err) {
        next(err);
    }
}