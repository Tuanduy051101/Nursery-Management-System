// checked

const { ChildcareCenter } = require('../models/model');
const createError = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        const { name, address, phone, email, director, isHeadquarters } = req.body;
        if (!name || !address || !phone || !email || !director || !isHeadquarters) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }
        console.log(name);

        const check = await ChildcareCenter.exists({ name });
        if (check) {
            return res.send({
                error: true,
                message: 'Nhà trẻ đã tồn tại.'
            })
        }

        const document = await ChildcareCenter.create({ name, address, phone, email, director, isHeadquarters });
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
        const documents = await ChildcareCenter.find();
        res.send(documents);
    } catch (error) {
        return next(createError(500, 'Error finding documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await ChildcareCenter.findByIdAndDelete(req.params.id);
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
        const document = await ChildcareCenter.findById(req.params.id);
        res.send(document);
    } catch (error) {
        return next(createError(500, 'Error finding document'));
    }
};

exports.update = async (req, res, next) => {
    try {
        const { name, address, phone, email, director, isHeadquarters } = req.body;
        const _id = req.params.id;
        if (!name || !address || !phone || !email || !director || !isHeadquarters) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }

        const check = await ChildcareCenter.exists({ name });
        if (check) {
            await ChildcareCenter.findByIdAndUpdate(_id, { address, phone, email, director, isHeadquarters });

            return res.send({
                error: false,
                message: 'Đã cập nhật thông tin thành công.'
            })
        }

        await ChildcareCenter.findByIdAndUpdate(_id, { name, address, phone, email, director, isHeadquarters });
        return res.send({
            error: false,
            message: 'Đã cập nhật thông tin thành công.'
        })
    } catch (error) {
        return next(createError(500, 'Error saving document'));
    }
};