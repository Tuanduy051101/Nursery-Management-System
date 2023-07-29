const { Assignment, Teacher, Classes, Duty } = require('../models/model');
const Error = require('http-errors');
const { letters_24 } = require('../utils/common');

exports.create = async (req, res, next) => {
    try {
        const { duty, note, teacher, classes } = req.body;

        if (!duty || !teacher || !classes) {
            return res.send({
                error: true,
                message: 'Missing required fields.'
            });
        }

        const check = await Assignment.exists({
            duty: { $in: duty },
            teacher: { $in: teacher },
            classes: { $in: classes }
        });

        if (check) {
            return res.send({
                error: true,
                message: 'Already exists.'
            });
        }

        const document = await Assignment.create({
            teacher: teacher,
            duty: duty,
            classes: classes,
            note: note || 'không có'
        });

        const updatePromises = [
            Teacher.findByIdAndUpdate(teacher, { $push: { assignment: document._id } }, { new: true }),
            Duty.findByIdAndUpdate(duty, { $push: { assignment: document._id } }, { new: true }),
            Classes.findByIdAndUpdate(classes, { $push: { assignment: document._id } }, { new: true })
        ];

        await Promise.all(updatePromises);

        return res.send({
            error: false,
            message: [document]
        });
    } catch (error) {
        return next(Error(500, 'Error saving'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Assignment.find()
            .populate('teacher duty')
            .populate({
                path: 'classes',
                populate: {
                    path: 'grade schoolYear'
                }
            });

        return res.send(documents);
    } catch (error) {
        return next(Error(500, 'Error finding documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await Assignment.findByIdAndDelete(req.params.id);

        const updatePromises = [
            Teacher.findByIdAndUpdate(result.teacher, { $pull: { assignment: result._id } }, { new: true }),
            Duty.findByIdAndUpdate(result.duty, { $pull: { assignment: result._id } }, { new: true }),
            Classes.findByIdAndUpdate(result.classes, { $pull: { assignment: result._id } }, { new: true })
        ];

        await Promise.all(updatePromises);

        return res.send(result);
    } catch (error) {
        return next(Error(500, 'Error deleting document'));
    }
};

exports.find = async (req, res, next) => {
    try {
        const document = await Assignment.findById(req.params.id)
            .populate('teacher duty')
            .populate({
                path: 'classes',
                populate: {
                    path: 'grade schoolYear'
                }
            });
        res.send(document);
    } catch (error) {
        return next(Error(500, 'Error finding document'));
    }
};
