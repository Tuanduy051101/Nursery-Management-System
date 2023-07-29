const {Evaluate} = require('../models/model');
const Error = require('http-errors');

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Evaluate.find();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error finding documents')
        )
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await Evaluate.deleteMany();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error deleting documents')
        )
    }
}

exports.delete = async (req, res, next) => {
    try {
        const result = await Evaluate.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        return next(
            Error(500, 'Error deleting document')
        )
    }
}

exports.find = async (req, res, next) => {
    try {
        const document = await Evaluate.findById(req.params.id);
        res.send(document);
    } catch (error) {
        return next(
            Error(500, 'Error finding document')
        )
    }
}

exports.update = async (req, res, next) => {
    try {
        console.log(req.body);
        const evaluate = await Evaluate.findById(req.params.id);
        evaluate.like = req.body.like;
        evaluate.allergy = req.body.allergy;
        evaluate.note = req.body.note;
        await evaluate.save();

        return res.send({
            error: false,
            message: evaluate,
        })
    } catch (error) {
        console.log(error);
    }
}