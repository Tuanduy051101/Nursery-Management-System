const {Position} = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length != 0) {
        const name = req.body.name;
        const check = await Position.find({ name: name });
        if (check.length != 0) return next(Error(401, 'Already exists'));
        else {
            try {
                const document = await new Position({ name: name }).save();
                res.send([document]);
            } catch (error) {
                return next(
                    Error(500, 'Error saving')
                )
            }
        }
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Position.find();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error finding documents')
        )
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await Position.deleteMany();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error deleting documents')
        )
    }
}

exports.delete = async (req, res, next) => {
    try {
        const result = await Position.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        return next(
            Error(500, 'Error deleting document')
        )
    }
}

exports.find = async (req, res, next) => {
    try {
        const document = await Position.findById(req.params.id);
        res.send(document);
    } catch (error) {
        return next(
            Error(500, 'Error finding document')
        )
    }
}