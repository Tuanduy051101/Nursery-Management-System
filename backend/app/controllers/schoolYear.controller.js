// checked

const { SchoolYear } = require('../models/model');
const createError = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.send({
                error: true,
                message: 'Missing required fields.'
            })
        }

        const check = await SchoolYear.exists({ name });
        if (check) {
            return res.send({
                error: true,
                message: 'Already exists.'
            })
        }

        const document = await SchoolYear.create({ name });
        return res.send({
            error: false,
            message: document
        })
    } catch (error) {
        return next(createError(500, 'Error saving document'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await SchoolYear.find()
            .populate([
                { path: 'classes', populate: { path: 'grade, schoolYear' } },
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
        res.send(result);
    } catch (error) {
        return next(createError(500, 'Error deleting document'));
    }
};

exports.find = async (req, res, next) => {
    try {
        const document = await SchoolYear.findById(req.params.id)
            .populate([
                { path: 'classes', populate: { path: 'grade, schoolYear' } },
                { path: 'collectionRates', populate: { path: 'tuitionFees' } },
            ]);
        res.send(document);
    } catch (error) {
        return next(createError(500, 'Error finding document'));
    }
};
