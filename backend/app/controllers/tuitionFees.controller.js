const { TuitionFees } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        const name = req.body.name;
        if (!name) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }
        const check = await TuitionFees.exists({ name });

        if (check) {
            return res.send({
                error: true,
                message: 'Khoản thu đã tồn tại.'
            })
        }

        const document = await TuitionFees.create({ name });
        return res.send({
            error: false,
            message: 'Đã tạo thành công.'
        })
    } catch (error) {
        return next(Error(500, 'Error saving'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await TuitionFees.find();
        res.send(documents);
    } catch (error) {
        return next(Error(500, 'Error finding documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await TuitionFees.findByIdAndDelete(req.params.id);
        res.send({
            error: false,
            message: 'Đã xoá thành công',
        });
    } catch (error) {
        return next(Error(500, 'Error deleting document'));
    }
};

exports.find = async (req, res, next) => {
    try {
        const document = await TuitionFees.findById(req.params.id);
        if (!document) {
            return next(Error(404, 'Document not found'));
        }
        res.send(document);
    } catch (error) {
        return next(Error(500, 'Error finding document'));
    }
};

exports.update = async (req, res, next) => {
    try {
        const name = req.body.name;
        const _id = req.params.id;
        if (!name) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }
        const check = await TuitionFees.exists({ name });

        if (check) {
            return res.send({
                error: true,
                message: 'Khoản thu đã tồn tại.'
            })
        }
        await TuitionFees.findByIdAndUpdate(_id, { name });
        return res.send({
            error: false,
            message: 'Đã cập nhật thông tin thành công.'
        })
    } catch (error) {
        return next(Error(500, 'Error saving'));
    }
};