const { Dish, Ingredient, Foodstuff } = require('../models/model');
const httpError = require('http-errors');

exports.create = async (req, res, next) => {
    console.log(req.body);
    try {
        // i = ingredient
        const { name, note = 'không có', cooking = 'không có', function: functionn, ingredients, childcareCenter } = req.body;
        let ingredientList = [];
        if (!name || !functionn || !ingredients || !childcareCenter) {
            return res.send({ error: true, message: 'Thiếu những trường bắt buộc.' });
        }
        const existingDish = await Dish.exists({ name, childcareCenter });

        if (existingDish) {
            return res.send({ error: true, message: 'Món ăn đã tồn tại.' });
        }

        if (ingredients[0].name_i.length == 0) {
            await Dish.create({ name, function: functionn, note: note || 'không có', cooking: cooking || 'không có', childcareCenter });
            return res.send({ error: false, message: 'Đã thêm thành công.' });
        }

        for (let value of ingredients) {
            if (value.name_i.length == 0 || value.amount_i.length == 0) continue;
            const existingFoodstuff = await Foodstuff.exists({ name: value.name_i });
            let foodstuff = {};
            if (existingFoodstuff) {
                foodstuff = await Foodstuff.findOne({ name: value.name_i });
            } else {
                foodstuff = await Foodstuff.create({ name: value.name_i, function: value.function_i || 'không có' });
            }
            const ingredient = await Ingredient.create({ foodstuff: foodstuff._id.toString(), amount: value.amount_i, note: value.note_i || 'không có', making: value.making_i || 'không có' });
            ingredientList.push(ingredient);
        }

        const document = await Dish.create({ name, function: functionn, note: note || 'không có', cooking: cooking || 'không có', childcareCenter });

        for (let value of ingredientList) {
            document.ingredient.push(value._id);
        }
        await document.save();

        res.send({ error: false, message: 'Đã tạo thành công.' });
    } catch (error) {
        console.log(error);
        next(httpError(500, 'Error saving'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Dish.find().populate('childcareCenter');
        res.send(documents);
    } catch (error) {
        next(httpError(500, 'Error finding documents'));
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await Dish.deleteMany();
        res.send(documents);
    } catch (error) {
        next(httpError(500, 'Error deleting documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await Dish.findByIdAndDelete(req.params.id);
        for (const value of result.ingredient) {
            await Ingredient.findByIdAndDelete(value);
        }
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
        const document = await Dish.findById(req.params.id).populate([
            {
                path: 'ingredient',
                populate: { path: 'foodstuff' },
            },
            'childcareCenter'
        ]);
        res.send(document);
    } catch (error) {
        next(httpError(500, 'Error finding document'));
    }
};

exports.update = async (req, res, next) => {
    console.log(req.body);
    try {
        const { name, function: functionn, cooking, note } = req.body;
        const _id = req.params.id;

        if (!name || !functionn) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }

        const check = await Dish.exists({ name: name });

        if (check) {
            const check_info = await Dish.exists({
                name: name,
                function: functionn,
                cooking: cooking,
                note: note,
            });
            if (!check_info) {
                await Dish.findByIdAndUpdate(_id, {
                    function: functionn,
                    cooking: cooking,
                    note: note,
                });
                return res.send({
                    error: false,
                    message: 'Đã cập nhật thông tin thành công.'
                })
            }
            return res.send({
                error: true,
                message: 'Món ăn đã tồn tại.'
            })
        }

        await Dish.findByIdAndUpdate(_id, {
            function: functionn,
            cooking: cooking,
            note: note,
            name: name,
        });
        return res.send({
            error: false,
            message: 'Đã cập nhật thông tin thành công.'
        })
    } catch (error) {
        next(httpError(500, 'Error updating document'));
    }
}
