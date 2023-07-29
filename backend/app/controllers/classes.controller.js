const { Classes, SchoolYear, Grade, Children } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        const { name, grade, schoolYear } = req.body;

        if (Object.keys(req.body).length === 0) {
            return next(Error(400, 'Request body is empty'));
        }

        const check = await Classes.exists({ name, grade, schoolYear });
        if (check) {
            return res.send({ error: true, message: 'Already exists!' });
        } else {
            const document = await new Classes({
                name,
                grade,
                schoolYear,
            }).save();

            const [dGrade, dSchoolYear] = await Promise.all([
                Grade.findByIdAndUpdate(grade, { $push: { classes: document._id } }, { new: true }),
                SchoolYear.findByIdAndUpdate(schoolYear, { $push: { classes: document._id } }, { new: true })
            ]);

            return res.send({ error: false, message: [document] });
        }
    } catch (error) {
        return next(Error(500, 'Error saving'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Classes.find().populate("schoolYear").populate("grade");
        res.send(documents);
    } catch (error) {
        return next(Error(500, 'Error finding documents'));
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await Classes.deleteMany();
        res.send(documents);
    } catch (error) {
        return next(Error(500, 'Error deleting documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await Classes.findByIdAndDelete(req.params.id);

        const [dGrade, dSchoolYear] = await Promise.all([
            Grade.findByIdAndUpdate(result.grade, { $pull: { classes: result._id } }, { new: true }),
            SchoolYear.findByIdAndUpdate(result.schoolYear, { $pull: { classes: result._id } }, { new: true })
        ]);

        res.send(result);
    } catch (error) {
        return next(Error(500, 'Error deleting document'));
    }
};

exports.find = async (req, res, next) => {
    try {
        const document = await Classes.findById(req.params.id).populate("grade").populate("schoolYear").populate({
            path: 'assignment',
            populate: {
                path: 'teacher',
                populate: {
                    path: 'position',
                }
            }
        }).populate({
            path: 'cdi',
            populate: {
                path: 'child',
            }
        }).populate({
            path: 'children',
            populate: {
                path: 'cDI',
                populate: {
                    path: 'classes',
                }
            }
        }).populate('receipt').populate({
            path: 'mealTicket',
            populate: {
                path: 'meal', 
                populate: {
                    path: 'dish',
                    populate: {
                        path: 'ingredient',
                    }
                }
            }
        }).populate({
            path: 'attendance',
            populate: {
                path: 'child',
            }
        });
        res.send([document]);
    } catch (error) {
        return next(Error(500, 'Error finding document'));
    }
};

exports.update = async (req, res, next) => {
    try {
        const document = await Classes.findById(req.params.id);

        if (req.body.object === 'addChild') {
            const children = await Children.findById(req.body.child);

            document.children.push(req.body.child);
            children.classes.push(req.params.id);

            await document.save();
            await children.save();

            return res.send(document);
        } else if (req.body.object === 'delete') {
            const children = await Children.findById(req.body.child);

            document.children = document.children.filter(value => !value.toString().includes(req.body.child));
            await document.save();

            children.classes = children.classes.filter(value => !value.toString().includes(req.params.id));
            await children.save();

            return res.send(document);
        }
    } catch (error) {
        return next(Error(500, 'Error adding child'));
    }
};
