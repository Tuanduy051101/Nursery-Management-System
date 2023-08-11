const { CollectionRates, TuitionFees, SchoolYear, Grade } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        const { money, tuitionFees, grade, schoolYear } = req.body;

        if (!money || !tuitionFees || !grade || !schoolYear) {
            return res.send({
                error: true,
                message: 'Missing required fields.'
            })
        }

        const check = await CollectionRates.exists({
            tuitionFees: { $in: [tuitionFees] },
            grade: { $in: [grade] },
            schoolYear: { $in: [schoolYear] }
        });

        if (check) {
            return res.send({
                error: true,
                message: 'Already exists!'
            });
        }
        const document = await CollectionRates.create({
            money,
            tuitionFees,
            grade,
            schoolYear
        });

        await Promise.all([
            TuitionFees.findByIdAndUpdate(tuitionFees, { $push: { collectionRates: document._id } }),
            Grade.findByIdAndUpdate(grade, { $push: { collectionRates: document._id } }),
            SchoolYear.findByIdAndUpdate(schoolYear, { $push: { collectionRates: document._id } })
        ]);

        return res.send({
            error: false,
            message: 'Successfully created.'
        });
    } catch (error) {
        return next(Error(500, 'Error saving'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await CollectionRates.find()
            .populate("schoolYear grade tuitionFees")
        res.send(documents);
    } catch (error) {
        return next(Error(500, 'Error finding documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await CollectionRates.findByIdAndDelete(req.params.id);

        await Promise.all([
            TuitionFees.findByIdAndUpdate(result.tuitionFees, { $pull: { collectionRates: result._id } }),
            Grade.findByIdAndUpdate(result.grade, { $pull: { collectionRates: result._id } }),
            SchoolYear.findByIdAndUpdate(result.schoolYear, { $pull: { collectionRates: result._id } })
        ]);

        res.send({
            error: false,
            message: 'Successfully deleted.'
        });
    } catch (error) {
        return next(Error(500, 'Error deleting document'));
    }
};

exports.find = async (req, res, next) => {
    try {
        const document = await CollectionRates.findById(req.params.id)
            .populate("schoolYear grade tuitionFees");

        if (!document) {
            return next(Error(404, 'Document not found'));
        }

        res.send(document);
    } catch (error) {
        return next(Error(500, 'Error finding document'));
    }
};

exports.update = async (req, res, next) => {
    try {
        console.log(req.body);
        const { money } = req.body;
        const _id = req.params.id;
        console.log(money);

        if (!money) {
            return res.send({
                error: true,
                message: 'Missing required fields.'
            })
        }

        const check = await CollectionRates.exists({
            _id: _id,
            money: money,
        });

        if (check) {
            return res.send({
                error: true,
                message: 'Already exists!'
            });
        }
        await CollectionRates.findByIdAndUpdate(_id, { money });

        return res.send({
            error: false,
            message: 'Successfully updated.'
        });
    } catch (error) {
        return next(Error(500, 'Error saving'));
    }
};