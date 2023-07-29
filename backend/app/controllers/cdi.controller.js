const { CDI, Classes, Children, Month } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        const { child, classes, month, height = 0, weight = 0, health = 'không có', roses = 0, note = 'không có' } = req.body;

        if (!child || !classes || !month) {
            return res.send({
              error: true,
              message: 'Missing required fields.'
            });
          }

        const check = await CDI.exists({ child: { $in: child }, classes: { $in: classes }, month: { $in: month } });
        if (check) {
            return next(Error(401, 'Already exists'));
        } else {
            const document = await CDI.create({ child, classes, month, height, weight, health, roses, note });

            const [dChild, dClasses, dMonth] = await Promise.all([
                Children.findByIdAndUpdate(child, { $push: { cDI: document._id } }, { new: true }),
                Classes.findByIdAndUpdate(classes, { $push: { cdi: document._id } }, { new: true }),
                Month.findByIdAndUpdate(month, { $push: { cDI: document._id } }, { new: true })
            ]);

            return res.send(document);
        }
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
