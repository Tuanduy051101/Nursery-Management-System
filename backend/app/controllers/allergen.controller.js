// checked

const { Allergen } = require('../models/model');
const createError = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }

        const document = await Allergen.create({ name, description: description || 'không có', });
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
        const documents = await Allergen.find().populate([
            {
                path: 'allergies',
                populate: {
                    path: 'child',
                    populate: {
                        path: 'classes',
                    }
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
        const result = await Allergen.findByIdAndDelete(req.params.id);
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
        const document = await Allergen.findById(req.params.id)
            .populate([
                'childcareCenter',
                { path: 'classes', populate: { path: 'grade Allergen' } },
                { path: 'collectionRates', populate: { path: 'tuitionFees' } },
            ]);
        res.send(document);
    } catch (error) {
        return next(createError(500, 'Error finding document'));
    }
};

exports.update = async (req, res, next) => {
    try {
        const { name, startDate, endDate, childcareCenter } = req.body;
        const _id = req.params.id;
        if (!name || !startDate || !endDate || !childcareCenter) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }

        const check = await Allergen.exists({ name, childcareCenter });
        if (check) {

            await Allergen.findByIdAndUpdate(_id, { startDate, endDate });


            return res.send({
                error: false,
                message: 'Đã cập nhật thông tin thành công.'
            })
        }

        await Allergen.findByIdAndUpdate(_id, { name, startDate, endDate, childcareCenter });
        return res.send({
            error: false,
            message: 'Đã cập nhật thông tin thành công.'
        })
    } catch (error) {
        return next(createError(500, 'Error saving document'));
    }
};