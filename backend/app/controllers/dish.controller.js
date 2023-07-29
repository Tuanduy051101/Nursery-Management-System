const { Dish, Classes, Meal, Ingredient,  } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length != 0) {
        const name = req.body.name,
        note = req.body.note,
        cooking = req.body.cooking,
            functionn = req.body.function;

        // const check = await Dish.find({ name: name });
        const check = 0;
        if (check != 0) return res.send({
            error: true,
            message: 'The dish already exists.'
        });
        else {
            try {
                const document = await new Dish({
                    name: name,
                    function: functionn,
                    note: note,
                    cooking: cooking,
                }).save();
                return res.send({
                    error: false,
                    message: document,
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
        const documents = await Dish.find();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error finding documents')
        )
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await Dish.deleteMany();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error deleting documents')
        )
    }
}

exports.delete = async (req, res, next) => {
    try {
        const result = await Dish.findByIdAndDelete(req.params.id);

        for (var value of result.ingredient) {
            await Ingredient.findByIdAndDelete(value);
        }

        res.send(result);
    } catch (error) {
        return next(
            Error(500, 'Error deleting document')
        )
    }
}

exports.find = async (req, res, next) => {
    try {
        const document = await Dish.findById(req.params.id).populate({
            path: 'ingredient',
            populate: {
                path: 'foodstuff',
            }
        });
        res.send(document);
    } catch (error) {
        return next(
            Error(500, 'Error finding document')
        )
    }
}