// checked

const { Allergen, Allergies, Children } = require('../models/model');
const createError = require('http-errors');

exports.create = async (req, res, next) => {
    console.log(req.body);
    try {
        const { severity, reactionType, treatment, note, child, allergen, description } = req.body;
        if (!severity || !reactionType || !treatment || !child || !allergen) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }

        const check_allergen = await Allergen.exists({
            name: allergen,
        })

        let allergenId = '';

        if (!check_allergen) {
            const new_allergen = await Allergen.create({
                name: allergen,
                description: description || 'không có',
            })
            allergenId = new_allergen._id;
        } else {
            const allergenInfo = await Allergen.findOne({
                name: allergen,
            })
            allergenId = allergenInfo._id;
        }

        const document = await Allergies.create({
            severity,
            reactionType,
            treatment,
            note: note || 'không có',
            child,
            allergen: allergenId,
        });

        await Children.findByIdAndUpdate(child, { $push: { allergies: document._id } })
        await Allergen.findByIdAndUpdate(allergenId, { $push: { allergies: document._id } })

        return res.send({
            error: false,
            message: 'Đã tạo thành công.'
        });
    } catch (error) {
        return next(createError(500, 'Error saving document'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Allergies.find()
            .populate([
                'child',
                'allergen'
            ]);
        res.send(documents);
    } catch (error) {
        return next(createError(500, 'Error finding documents'));
    }
};

exports.findAllAllergen = async (req, res, next) => {
    try {
        const documents = await Allergen.find();
        res.send(documents);
    } catch (error) {
        console.log(error);
        return next(createError(500, 'Error finding documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await Allergies.findByIdAndDelete(req.params.id);
        await Allergen.findByIdAndUpdate(result.allergen.toString(), { $pull: { allergies: result._id } });
        await Children.findByIdAndUpdate(result.child.toString(), { $pull: { allergies: result._id } });
        res.send({
            error: false,
            message: 'Đã xoá thành công.'
        });
    } catch (error) {
        return next(createError(500, 'Error deleting document'));
    }
};

exports.find = async (req, res, next) => {
    console.log('cc');
    try {
        const document = await Allergies.findById(req.params.id)
            .populate([
                'child',
                'allergen'
            ]);
        res.send(document);
    } catch (error) {
        return next(createError(500, 'Error findinggggggg document'));
    }
};

exports.update = async (req, res, next) => {
    try {
        const { severity, reactionType, treatment, note, description, name } = req.body;
        const _id = req.params.id;
        if (!severity || !reactionType || !treatment || !name) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }

        const allergen = await Allergen.findOne({ name: name });

        await Allergen.findByIdAndUpdate(allergen._id, { description: description || 'không có' });
        await Allergies.findByIdAndUpdate(_id, { severity, reactionType, treatment, note: note || 'không có' });
        return res.send({
            error: false,
            message: 'Đã cập nhật thông tin thành công.'
        })
    } catch (error) {
        return next(createError(500, 'Error saving document'));
    }
};