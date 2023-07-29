const { MealTicket, Classes, Meal, Children, Evaluate } = require('../models/model');
const Error = require('http-errors');
const { letters_24 } = require('../utils/common');

exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length != 0) {
        const classes = req.body.classes,
            children = req.body.children,
            meal = req.body.meal;

        // const check = await MealTicket.find({
        //     $and: [
        //         { date: { $in: date } },
        //         { classes: { $in: classes } },
        //         { child: { $in: child } },
        //     ]
        // });
        const check = 0;
        if (check != 0) return res.send({
            error: true,
            message: 'Can not choose the same meal in 1 day.',
        })
        else {
            try {
                for (let value of children) {
                    const document = await new MealTicket({
                        classes: classes,
                        child: value._id,
                        meal: meal,
                        evaluate: 'aaaaaaaaaaaaaaaaaaaaaaaa'
                    }).save();


                    const evaluate = await new Evaluate({
                        like: true,
                        allergy: false,
                        mealTicket: document._id,
                        note: '',
                    }).save();

                    const mealTicket = await MealTicket.findById(document._id);

                    mealTicket.evaluate = evaluate;

                    await mealTicket.save();


                    const childd = await Children.findById(value._id);
                    childd.mealTicket.push(document._id);
                    await childd.save();

                    const classesd = await Classes.findById(document.classes);
                    classesd.mealTicket.push(document._id);
                    await classesd.save();

                    const meald = await Meal.findById(document.meal);
                    meald.mealTicket.push(document._id);
                    await meald.save();
                }

                res.send({
                    error: false,
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
        const documents = await MealTicket.find().populate({
            path: 'meal',
            populate: {
                path: 'dish',
            }
        }).populate("classes").populate("child").populate("evaluate");
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error finding documents')
        )
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await MealTicket.deleteMany();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error deleting documents')
        )
    }
}

exports.delete = async (req, res, next) => {
    try {
        const result = await MealTicket.findByIdAndDelete(req.params.id);
        const evaluated = await Evaluate.findByIdAndDelete(result.evaluate);

        const child = await Children.findById(result.child);
        console.log(child);
        child.mealTicket = child.mealTicket.filter(
            (value, index) => {
                console.log(value);
                console.log(result._id);
                return !(value != result._id);
            }
        )
        await child.save();

        const classd = await Classes.findById(result.classes);
        classd.mealTicket = classd.mealTicket.filter(
            (value, index) => {
                return !(value != result._id);
            }
        )
        await classd.save();

        const meald = await Meal.findById(result.meal);
        meald.mealTicket = meald.mealTicket.filter(
            (value, index) => {
                return !(value != result._id);
            }
        )
        await meald.save();

        // await evaluated.save();

        return res.send({
            error: false,
        });
    } catch (error) {
        return next(
            Error(500, 'Error deleting document')
        )
    }
}

exports.find = async (req, res, next) => {
    try {
        const document = await MealTicket.findById(req.params.id);
        res.send(document);
    } catch (error) {
        return next(
            Error(500, 'Error finding document')
        )
    }
}