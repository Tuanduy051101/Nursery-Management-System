const { Duty } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    const { name, description } = req.body;
    if (!name) {
        return res.send({
            error: true,
            message: 'Thiếu những trường bắt buộc.'
        })
    }
    const check = await Duty.exists({ name: name });
    if (check) {
        return res.send({
            error: true,
            message: 'Nhiệm vụ đã tồn tại.'
        })
    }
    try {
        const document = await Duty.create({ name: name, description: description || 'không có' });
        res.send({
            error: false,
            message: 'Đã tạo thành công.'
        });
    } catch (error) {
        return next(
            Error(500, 'Error saving')
        )
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Duty.find();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error finding documents')
        )
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await Duty.deleteMany();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error deleting documents')
        )
    }
}

exports.delete = async (req, res, next) => {
    try {
        const result = await Duty.findByIdAndDelete(req.params.id);
        res.send({
            error: false,
            message: 'Đã xoá thành công.'
        });
    } catch (error) {
        return next(
            Error(500, 'Error deleting document')
        )
    }
}

exports.find = async (req, res, next) => {
    try {
        const document = await Duty.findById(req.params.id);
        res.send(document);
    } catch (error) {
        return next(
            Error(500, 'Error finding document')
        )
    }
}

exports.update = async (req, res, next) => {
    const { name, description } = req.body;
    const _id = req.params.id;
    if (!name) {
        return res.send({
            error: true,
            message: 'Thiếu những trường bắt buộc.'
        })
    }
    const check = await Duty.exists({ name: name });
    if (check) {
        const check_info = await Duty.exists({ name: name, description: description });
        if (!check_info) {
            const document = await Duty.findByIdAndUpdate(_id, { description: description || 'không có' });
            return res.send({
                error: false,
                message: 'Đã tạo thành công.'
            });
        }
        return res.send({
            error: true,
            message: 'Nhiệm vụ đã tồn tại.'
        })
    }
    try {
        const document = await Duty.findByIdAndUpdate(_id, { name: name, description: description || 'không có' });
        res.send({
            error: false,
            message: 'Đã cập nhật thông tin thành công.'
        });
    } catch (error) {
        return next(
            Error(500, 'Error saving')
        )
    }
}