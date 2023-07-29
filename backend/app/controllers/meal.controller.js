const { Meal, Classes, MealTicket } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length != 0) {
        const dish = req.body.dish,
            grade = req.body.grade,
            timeStart = req.body.timeStart,
            timeEnd = req.body.timeEnd,
            date = req.body.date;

        // const check = await Meal.find({ name: name });
        const check = 0;
        if (check != 0) return next(Error(401, 'Already exists'));
        else {
            try {
                const document = await new Meal({
                    timeStart: timeStart,
                    timeEnd: timeEnd,
                    date: date,
                }).save();

                const meal = await Meal.findById(document._id);

                for (var value of dish) {
                    meal.dish.push(value.id);
                }

                for (var value of grade) {
                    if (value.checked == true) {
                        meal.grade.push(value._id);
                    }
                }

                await meal.save();

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
        const documents = await Meal.find().populate("dish").populate({
            path: 'mealTicket',
            populate: {
                path: 'evaluate',
            }
        });
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error finding documents')
        )
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await Meal.deleteMany();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error deleting documents')
        )
    }
}

exports.delete = async (req, res, next) => {
    try {
        const result = await Meal.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        return next(
            Error(500, 'Error deleting document')
        )
    }
}

exports.find = async (req, res, next) => {
    try {
        const document = await Meal.findById(req.params.id).populate({
            path: 'dish',
            populate: {
                path: 'ingredient',
                populate: {
                    path: 'foodstuff',
                }
            }
        }).populate("grade").populate({
            path: 'mealTicket',
            populate: {
                path: 'evaluate',
            }
        });
        res.send(document);
    } catch (error) {
        return next(
            Error(500, 'Error finding document')
        )
    }
}