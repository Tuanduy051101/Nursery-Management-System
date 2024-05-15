const { Meal } = require('../models/model');
const httpError = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        console.log(req.body);
        const { dishes, grade, session, date, note } = req.body;

        const check_grade = grade.every(item => !item.checked);

        if (!dishes.length || check_grade || !session || !date) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            });
        }
        const newMeal = await Meal.create({
            session,
            date,
            note: note || 'không có',
            dish: dishes.map(item => item._id),
            grade: grade.filter(item => item.checked).map(item => item._id)
        });

        res.send({ error: false, message: 'Đã tạo thành công.' });
    } catch (error) {
        console.log(error);
        next(httpError(500, 'Error saving'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Meal.find().populate([
            'grade',
            'session',
            {
                path:'dish',
                populate: {
                    path: 'childcareCenter',
                }
            },
            {
                path: 'mealTicket',
                populate: {
                    path: 'child'
                }
            }
        ]);
        res.send(documents);
    } catch (error) {
        next(httpError(500, 'Error finding documents'));
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await Meal.deleteMany();
        res.send(documents);
    } catch (error) {
        next(httpError(500, 'Error deleting documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await Meal.findByIdAndDelete(req.params.id);
        return res.send({ 
            error: false,
            message: 'Đã xoá thành công.'
        });
    } catch (error) {
        next(httpError(500, 'Error deleting document'));
    }
};

exports.find = async (req, res, next) => {
    try {
        const document = await Meal.findById(req.params.id).populate([
            'session',
            'grade',
            'mealTicket',
            {
                path: 'dish',
                populate: {
                    path: 'ingredient',
                    populate: {
                        path: 'foodstuff'
                    }
                }
            }
        ])
        res.send(document);
    } catch (error) {
        next(httpError(500, 'Error finding document'));
    }
};
