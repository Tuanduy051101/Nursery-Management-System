const { Position } = require('../models/model');
const createError = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc..',
            });
        }

        const check = await Position.exists({ name });
        if (check) {
            return res.send({
                error: true,
                message: 'Chức vụ đã tồn tại.',
            });
        }

        const document = await Position.create({ name });
        console.log(document);
        return res.send({
            error: false,
            message: 'Đã tạo thành công.',
            document: document,
        });
    } catch (error) {
        return next(createError(500, 'Error saving document'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Position.find().populate([
            {
                path: 'teacher',
                populate: {
                    path: 'childcareCenter'
                }
            }
        ]);
        res.send(documents);
    } catch (error) {
        return next(createError(500, 'Error finding documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await Position.findByIdAndDelete(req.params.id);
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
        const document = await Position.findById(req.params.id);
        if (!document) {
            return next(createError(404, 'Position not found'));
        }
        res.send(document);
    } catch (error) {
        return next(createError(500, 'Error finding document'));
    }
};

exports.update = async (req, res, next) => {
    try {
        const { name } = req.body;
        const _id = req.params.id;
        if (!name) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.',
            });
        }

        const check = await Position.exists({ name });
        if (check) {
            return res.send({
                error: true,
                message: 'Chức vụ đã tồn tại.',
            });
        }

        await Position.findByIdAndUpdate(_id, { name });
        return res.send({
            error: false,
            message: 'Đã cập nhật thông tin thành công.',
        });
    } catch (error) {
        return next(createError(500, 'Error saving document'));
    }
};