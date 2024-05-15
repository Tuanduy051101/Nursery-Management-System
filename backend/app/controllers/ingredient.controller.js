const { Ingredient, Dish, Foodstuff } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        const { name, amount, function: functionn, note, making, dish } = req.body;
        const existingFoodstuff = await Foodstuff.exists({ name: name });
        let foodstuff = {};

        if (!name || !amount || !dish) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }

        if (existingFoodstuff) {
            foodstuff = await Foodstuff.findOne({ name: name });
        } else {
            foodstuff = await Foodstuff.create({ name: name, function: functionn || 'không có' });
        }
        const ingredient = await Ingredient.create({ foodstuff: foodstuff._id.toString(), amount: amount, note: note || 'không có', making: making || 'không có' });

        await Dish.findByIdAndUpdate(dish, { $push: { ingredient: ingredient._id } });

        return res.send({
            error: false,
            message: 'Đã thêm thành công..'
        })
    } catch (error) {
        return next(Error(500, 'Error saving'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Ingredient.find();
        res.send(documents);
    } catch (error) {
        return next(Error(500, 'Error finding documents'));
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await Ingredient.deleteMany();
        res.send(documents);
    } catch (error) {
        return next(Error(500, 'Error deleting documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await Ingredient.findByIdAndDelete(req.params.id);

        const dish = await Dish.findOne({
            ingredient: result._id,
        });

        await Dish.findByIdAndUpdate(dish._id, { $pull: { ingredient: result._id } });
        res.send({
            error: false,
            message: 'Đã xoá thành công.'
        });
    } catch (error) {
        return next(Error(500, 'Error deleting document'));
    }
};

exports.find = async (req, res, next) => {
    try {
        const document = await Ingredient.findById(req.params.id);
        res.send(document);
    } catch (error) {
        return next(Error(500, 'Error finding document'));
    }
};

exports.update = async (req, res, next) => {
    try {
        const { name, amount, function: functionn, note, making, foodstuff_id } = req.body;
        const existingFoodstuff = await Foodstuff.exists({ name: name });
        let foodstuff = {};

        if (!name || !amount) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }

        if (existingFoodstuff) {
            foodstuff = await Foodstuff.findByIdAndUpdate(foodstuff_id, { function: functionn || 'không có' });
        } else {
            foodstuff = await Foodstuff.findByIdAndUpdate(foodstuff_id, { name, function: functionn || 'không có' });
        }

        await Ingredient.findByIdAndUpdate(req.params.id, { amount, note: note || 'không có', making: making || 'không có' });

        console.log('cc');

        return res.send({
            error: false,
            message: 'Đã cập nhật thông tin thành công.'
        })
    } catch (error) {
        return next(Error(500, 'Error updating ingredient'));
    }
};
