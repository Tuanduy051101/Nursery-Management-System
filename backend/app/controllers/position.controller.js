const { Position } = require('../models/model');
const createError = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.send({
                error: true,
                message: 'Missing required fields.',
            });
        }

        const check = await Position.exists({ name });
        if (check) {
            return res.send({
                error: true,
                message: 'Already exists.',
            });
        }

        const document = await Position.create({ name });
        return res.send({
            error: false,
            message: document,
        });
    } catch (error) {
        return next(createError(500, 'Error saving document'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Position.find();
        res.send(documents);
    } catch (error) {
        return next(createError(500, 'Error finding documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await Position.findByIdAndDelete(req.params.id);
        res.send(result);
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
