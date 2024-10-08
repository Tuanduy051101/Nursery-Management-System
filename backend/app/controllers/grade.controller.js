// checked

const { Grade } = require('../models/model');
const createError = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            });
        }

        const check = await Grade.exists({ name });
        if (check) {
            return res.send({
                error: true,
                message: 'Khối đã tồn tại.'
            });
        }
        const document = await Grade.create({ name, description: description || 'không có' });

        return res.send({
            error: false,
            message: 'Đã tạo thành công.',
        });
    } catch (error) {
        // console.log(error);
        return next(createError(500, 'Error saving document'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Grade.find()
            .populate([
                { path: 'classes', populate: { path: 'grade schoolYear' } },
                { path: 'collectionRates', populate: { path: 'tuitionFees' } },
            ])
        res.send(documents);
    } catch (error) {
        console.log(error);
        return next(createError(500, 'Error finding documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await Grade.findByIdAndDelete(req.params.id);
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
        const document = await Grade.findById(req.params.id)
            .populate([
                { path: 'classes', populate: { path: 'grade schoolYear' } },
                { path: 'collectionRates', populate: { path: 'tuitionFees' } },
            ]);
        res.send(document);
    } catch (error) {
        return next(createError(500, 'Error finding document'));
    }
};

exports.update = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const _id = req.params.id;
        if (!name) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            });
        }

        const check = await Grade.exists({ name });
        if (check) {
            const grade = await Grade.findById(_id);
            if (grade.name == name && grade.description != description) {
                await Grade.findByIdAndUpdate(_id, { description: description || "không có" });
                return res.send({
                    error: false,
                    message: 'Đã cập nhật thông tin thành công.',
                });
            }
            return res.send({
                error: true,
                message: 'Khối đã tồn tại.'
            });
        }
        await Grade.findByIdAndUpdate(_id, { name, description: description || "không có" });

        return res.send({
            error: false,
            message: 'Đã cập nhật thông tin thành công.',
        });
    } catch (error) {
        // console.log(error);
        return next(createError(500, 'Error saving document'));
    }
};
