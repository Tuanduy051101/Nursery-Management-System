const { Parents } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        const document = await new Parents({
        }).save();

        return res.send({
            error: false,
            message: [document]
        });
    } catch (error) {
        return next(
            Error(500, 'Error saving')
        )
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Parents.find().populate("Parents").populate("grade");
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error finding documents')
        )
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await Parents.deleteMany();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error deleting documents')
        )
    }
}

exports.delete = async (req, res, next) => {
    try {
        const document = await Parents.findByIdAndDelete(req.params.id);
        res.send(document);
    } catch (error) {
        console.error(error);
    }
}

exports.find = async (req, res, next) => {
    try {
        const document = await Parents.findById(req.params.id);
        res.send(document);
    } catch (error) {
        return next(
            Error(500, 'Error finding document')
        )
    }
}