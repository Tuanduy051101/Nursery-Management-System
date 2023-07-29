const { NutritionalIngredient, Classes, Meal } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length != 0) {
        const nutritional = req.body.nutritional,
            foodstuff = req.body.foodstuff;

        // const check = await NutritionalIngredient.find({ name: name });
        const check = 0;
        if (check.length != 0) return next(Error(401, 'Already exists'));
        else {
            try {
                const document = await new NutritionalIngredient({
                    foodstuff: foodstuff,
                    nutritional: nutritional,
                }).save();

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
        const documents = await NutritionalIngredient.find();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error finding documents')
        )
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await NutritionalIngredient.deleteMany();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error deleting documents')
        )
    }
}

exports.delete = async (req, res, next) => {
    try {
        const result = await NutritionalIngredient.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        return next(
            Error(500, 'Error deleting document')
        )
    }
}

exports.find = async (req, res, next) => {
    try {
        const document = await NutritionalIngredient.findById(req.params.id);
        res.send(document);
    } catch (error) {
        return next(
            Error(500, 'Error finding document')
        )
    }
}