const { Grade } = require('../models/model');
const createError = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.send({
                error: true,
                message: 'Missing required fields.'
            });
        }

        const check = await Grade.exists({ name });
        if (check) {
            return res.send({
                error: true,
                message: 'Already exists.'
            });
        }
        const document = await Grade.create({ name, description: description || 'không có' });

        return res.send({
            error: false,
            message: document,
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
                { path: 'classes', populate: { path: 'grade, schoolYear' } },
                { path: 'collectionRates', populate: { path: 'tuitionFees' } },
            ])
        res.send(documents);
    } catch (error) {
        return next(createError(500, 'Error finding documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await Grade.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        return next(createError(500, 'Error deleting document'));
    }
};

exports.find = async (req, res, next) => {
    try {
        const document = await Grade.findById(req.params.id)
            .populate([
                { path: 'classes', populate: { path: 'grade, schoolYear' } },
                { path: 'collectionRates', populate: { path: 'tuitionFees' } },
            ]);
        res.send(document);
    } catch (error) {
        return next(createError(500, 'Error finding document'));
    }
};
