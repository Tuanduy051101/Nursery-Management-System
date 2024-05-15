const { Foodstuff, Classes, Meal } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length != 0) {
        const name = req.body.name,
        functionn = req.body.function,
        making = req.body.making,
        note = req.body.note;

        // const check = await Foodstuff.find({ name: name });
        const check = 0;
        if (check != 0) return res.send({
            error: true,
            message: 'Thực phẩm đã tồn tại.'
        });
        else {
            try {
                const document = await new Foodstuff({
                    name: name,
                    function: functionn,
                    note: note,
                    making: making,
                }).save();

                return res.send({
                    error: false,
                    message: document
                });
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
        const documents = await Foodstuff.find();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error finding documents')
        )
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await Foodstuff.deleteMany();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error deleting documents')
        )
    }
}

exports.delete = async (req, res, next) => {
    try {
        const result = await Foodstuff.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        return next(
            Error(500, 'Error deleting document')
        )
    }
}

exports.find = async (req, res, next) => {
    try {
        const document = await Foodstuff.findById(req.params.id);
        res.send(document);
    } catch (error) {
        return next(
            Error(500, 'Error finding document')
        )
    }
}