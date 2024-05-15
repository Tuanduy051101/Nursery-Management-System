// checked

const { SchoolYear, Session } = require('../models/model');
const createError = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        const { name, startTime, endTime, childcareCenter } = req.body;
        if (!name || !startTime || !endTime || !childcareCenter) {
            return res.send({
                error: true,
                message: 'Thiếu các trường bắt buộc.'
            })
        }
        const sessions = await Session.find();
        const check = sessions.filter(i => i.startTime == startTime && i.endTime == endTime && i.childcareCenter.every(j => j.toString() != childcareCenter));
        const check1 = sessions.filter(i => i.startTime == startTime && i.endTime == endTime && i.childcareCenter.some(j => j.toString() == childcareCenter));
        if (check1.length != 0) {
            // check.childcareCenter.push(childcareCenter);
            return res.send({
                error: true,
                message: 'Buổi đã tồn tại.'
            })
        }

        if (check.length != 0) {
            const document = await Session.findOne({ _id: check[0]._id })
            document.childcareCenter.push(childcareCenter);
            console.log(document);
            await document.save();
            return res.send({
                error: false,
                message: 'Đã tạo thành công.'
            })
        }

        const document = await Session.create({ name, startTime, endTime });
        document.childcareCenter.push(childcareCenter);
        await document.save();
        return res.send({
            error: false,
            message: 'Đã tạo thành công.'
        })
    } catch (error) {
        return next(createError(500, 'Error saving document'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Session.find().populate('childcareCenter');
        res.send(documents);
    } catch (error) {
        return next(createError(500, 'Error finding documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const documents = await Session.findById(req.params.id);
        if (documents.childcareCenter.length == 1) {
            await Session.findByIdAndDelete(req.params.id);
        }else if (documents.childcareCenter.length > 1) {
            Session.findByIdAndUpdate(documents._id, {$pull: {childcareCenter: documents.childcareCenter}});
        }
        res.send({
            error: false,
            message: 'Đã xoá thành công.'
        });
    } catch (error) {
        return next(createError(500, 'Error deleting document'));
    }
};

exports.find = async (req, res, next) => {
    try {
        const document = await Session.findById(req.params.id);
        res.send(document);
    } catch (error) {
        return next(createError(500, 'Error finding document'));
    }
};

exports.update = async (req, res, next) => {
    try {
        const { name, startTime, endTime, childcareCenter } = req.body;
        const _id = req.params.id;
        if (!name) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }

        const check = await Session.exists({ name });
        if (check) {
            await Session.findByIdAndUpdate(_id, { startTime, endTime });
            return res.send({
                error: false,
                message: 'Đã cập nhật thành công.'
            })
        }

        await Session.findByIdAndUpdate(_id, { name, startTime, endTime });
        return res.send({
            error: false,
            message: 'Đã cập nhật thành công.'
        })
    } catch (error) {
        return next(createError(500, 'Error saving document'));
    }
};