// checked

const { SchoolYear } = require('../models/model');
const createError = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        let { name, startDate, endDate, childcareCenter } = req.body;

        const startYear = new Date(startDate).getFullYear();
        const endYear = new Date(endDate).getFullYear();

        console.log(startYear);
        console.log(endYear);

        if (startYear == endYear) {
            name = startYear;
        } else {
            name = `${startYear}-${endYear}`;
        }

        if (!name || !startDate || !endDate || !childcareCenter) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }

        const check = await SchoolYear.exists({ name, childcareCenter });
        if (check) {
            return res.send({
                error: true,
                message: 'Năm học đã tồn tại.'
            })
        }

        const document = await SchoolYear.create({ name, startDate, endDate, childcareCenter });
        return res.send({
            error: false,
            message: 'Đã tạo thành công.'
        })
    } catch (error) {
        console.log(error);
        return next(createError(500, 'Error saving document'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await SchoolYear.find()
            .populate([
                'childcareCenter',
                { path: 'classes', populate: { path: 'grade schoolYear' } },
                { path: 'collectionRates', populate: { path: 'tuitionFees' } },
            ]);
        res.send(documents);
    } catch (error) {
        return next(createError(500, 'Error finding documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await SchoolYear.findByIdAndDelete(req.params.id);
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
        const document = await SchoolYear.findById(req.params.id)
            .populate([
                'childcareCenter',
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
        console.log(req.body);
        const { name, startDate, endDate, childcareCenter } = req.body;
        const _id = req.params.id;
        if (!name || !startDate || !endDate || !childcareCenter) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }
        const check = await SchoolYear.exists({ name, childcareCenter: childcareCenter._id });
        if (check) {

            await SchoolYear.findByIdAndUpdate(_id, { startDate, endDate });


            return res.send({
                error: false,
                message: 'Đã cập nhật thông tin thành công.'
            })
        }

        await SchoolYear.findByIdAndUpdate(_id, { name, startDate, endDate });
        return res.send({
            error: false,
            message: 'Đã cập nhật thông tin thành công.'
        })
    } catch (error) {
        return next(createError(500, 'Error saving document'));
    }
};