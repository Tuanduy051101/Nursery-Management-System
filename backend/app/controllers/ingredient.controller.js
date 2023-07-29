const { Ingredient, Classes, Meal, Dish } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length != 0) {
        const foodstuff = req.body.foodstuff,
            amount = req.body.amount,
            dish = req.body.dish;

        // const check = await Ingredient.find({ name: name });
        const check = 0;
        if (check != 0) return next(Error(401, 'Already exists'));
        else {
            try {
                console.log(req.body);
                console.log(req.body.foodstuff);
                const document = await new Ingredient({
                    foodstuff: foodstuff,
                    amount: amount,
                    dish: dish,
                }).save();

                console.log('con dit me')

                console.log(document);

                const dishd = await Dish.findById(document.dish);
                dishd.ingredient.push(document._id);
                await dishd.save();

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
        const documents = await Ingredient.find();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error finding documents')
        )
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await Ingredient.deleteMany();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error deleting documents')
        )
    }
}

exports.delete = async (req, res, next) => {
    try {
        const result = await Ingredient.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        return next(
            Error(500, 'Error deleting document')
        )
    }
}

exports.find = async (req, res, next) => {
    try {
        const document = await Ingredient.findById(req.params.id);
        res.send(document);
    } catch (error) {
        return next(
            Error(500, 'Error finding document')
        )
    }
}