const { MealTicket, Classes, Meal, Children, Evaluate, } = require('../models/model');
const Error = require('http-errors');
const { letters_24 } = require('../utils/common');

exports.create = async (req, res, next) => {

}

exports.findAll = async (req, res, next) => {
    try {
        const documents = await MealTicket.find().populate([
            {
                path: 'child',
                populate: {
                    path: 'parentDetails',
                }
            },
            {
                path: 'classes',
                populate: {
                    path: 'schoolYear grade'
                }
            },
            {
                path: 'meal',
                populate: {
                    path: 'dish session'
                }
            }
        ])
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error finding documents')
        )
    }
}

exports.delete = async (req, res, next) => {
    try {
        const result = await MealTicket.findByIdAndDelete(req.params.id);

        await Classes.findByIdAndUpdate(result.classes, { $pull: { mealTicket: result._id } });
        await Children.findByIdAndUpdate(result.child, { $pull: { mealTicket: result._id } });
        await Meal.findByIdAndUpdate(result.meal, { $pull: { mealTicket: result._id } });

        return res.send({
            error: false,
            message: 'Đã xoá thành công.'
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

exports.update = async (req, res, next) => {
    try {
        const { task } = req.body;
        const _id = req.params.id;
        const mealTicket = await MealTicket.findById(_id);

        if (task == 'save') {
            console.log(req.body);
            const { evaluate, remark } = req.body;
            await MealTicket.findByIdAndUpdate(_id, { evaluate, remark: remark || 'không có' });
            return res.send({
                error: true,
                message: 'Đã cập nhật thông tin thành công.'
            })
        }

        const check = await MealTicket.exists({
            classes: mealTicket.classes.toString(),
            child: mealTicket.child.toString(),
            meal: req.body.meal,
        });
        if (check) {
            return res.send({
                error: true,
                message: 'Khẩu phần ăn đã được đăng ký.'
            })
        }
        // Lưu lại tài liệu mới
        const savedMealTicket = await MealTicket.create({
            note: 'không có',
            evaluate: 'yêu thích',
            remark: 'không có',
            classes: mealTicket.classes.toString(),
            child: mealTicket.child.toString(),
            meal: req.body.meal,
        });
        const x = await Children.findByIdAndUpdate(mealTicket.child.toString(), { $push: { mealTicket: savedMealTicket._id } }, { new: true });
        const y = await Classes.findByIdAndUpdate(mealTicket.classes.toString(), { $push: { mealTicket: savedMealTicket._id } }, { new: true });
        await Meal.findByIdAndUpdate(req.body.meal, { $push: { mealTicket: savedMealTicket._id } });
        return res.send({
            error: false,
            message: 'Đã thay đổi khẩu phần ăn thành công.'
        })
    } catch (error) {
        return next(
            Error(500, 'Error saving document')
        )
    }
}
