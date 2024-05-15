const { CDI, Classes, Children, Month } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    console.log(req.body);
    try {
        const { children, classes, month, height = 0, weight = 0, health = 'bình thường', roses = 0, note = 'không có' } = req.body;

        if (!children || !classes || !month) {
            return res.send({
                error: true,
                message: 'Thiếu các trường bắt buộc.'
            });
        }

        var s = 0, e = 0;

        for (let child of children) {
            const check = await CDI.exists({ child: child, month: month, classes: classes });
            const x = await CDI.find({ child: child, month: month, classes: classes });
            console.log(x);
            if (check) {
                e++;
            } else {
                const document = await CDI.create({ child, classes, month, height, weight, health, roses, note });

                const [dChild, dClasses, dMonth] = await Promise.all([
                    Children.findByIdAndUpdate(child, { $push: { cDI: document._id } }, { new: true }),
                    Classes.findByIdAndUpdate(classes, { $push: { cdi: document._id } }, { new: true }),
                    Month.findByIdAndUpdate(month, { $push: { cDI: document._id } }, { new: true })
                ]);
            }
        }
        if (e != 0) {
            return res.send({
                error: true,
                message: `Chỉ số phát triển của ${month} này đã tồn tại.`
            })
        }
        return res.send({
            error: false,
            message: 'Đã tạo thành công.'
        })
    } catch (error) {
        return next(Error(500, 'Error saving'));
    }
};

exports.update = async (req, res, next) => {
    try {
        const { height, weight, health, roses, note } = req.body;
        const cdi = await CDI.findByIdAndUpdate(req.params.id, { height, weight, health, roses, note }, { new: true });
        return res.send(cdi);
    } catch (error) {
        return next(Error(500, 'Error updating'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await CDI.find()
            .populate('month')
            .populate({
                path: 'classes',
                populate: {
                    path: 'grade schoolYear'
                }
            })
            .populate({
                path: 'child',
                populate: {
                    path: 'parentDetails',
                }
            });
        return res.send(documents);
    } catch (error) {
        return next(Error(500, 'Error finding documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await CDI.findByIdAndDelete(req.params.id);
        const [dChild, dClasses, dMonth] = await Promise.all([
            Children.findByIdAndUpdate(result.child, { $pull: { cDI: result._id } }, { new: true }),
            Classes.findByIdAndUpdate(result.classes, { $pull: { cdi: result._id } }, { new: true }),
            Month.findByIdAndUpdate(result.month, { $pull: { cDI: result._id } }, { new: true })
        ]);
        return res.send(result);
    } catch (error) {
        return next(Error(500, 'Error deleting document'));
    }
};

exports.find = async (req, res, next) => {
    try {
        const document = await CDI.findById(req.params.id)
            .populate('month')
            .populate({
                path: 'classes',
                populate: {
                    path: 'grade schoolYear'
                }
            })
            .populate({
                path: 'child',
                populate: {
                    path: 'parentDetails',
                }
            });
        return res.send(document);
    } catch (error) {
        return next(Error(500, 'Error finding document'));
    }
};
