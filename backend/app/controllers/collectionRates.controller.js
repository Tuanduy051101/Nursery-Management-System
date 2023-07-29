const { CollectionRates, TuitionFees, SchoolYear, Grade } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length != 0) {
        const money = req.body.money,
            tuitionFees = req.body.tuitionFees,
            grade = req.body.grade,
            schoolYear = req.body.schoolYear;
        const check = await CollectionRates.find({
            $and: [
                { tuitionFees: { $in: tuitionFees } },
                { grade: { $in: grade } },
                { schoolYear: { $in: schoolYear } }
            ]
        });
        if (check.length != 0) return res.send({
            error: true,
            message: 'Already exists !'
        })
        else {
            try {
                const document = await new CollectionRates({
                    money: money,
                    tuitionFees: tuitionFees,
                    grade: grade,
                    schoolYear: schoolYear,
                }).save();

                const dTuitionFees = await TuitionFees.findById(tuitionFees);
                const dGrade = await Grade.findById(grade);
                const dSchoolYear = await SchoolYear.findById(schoolYear);

                // update tuition fees
                dTuitionFees.collectionRates.push(document._id);
                dGrade.collectionRates.push(document._id);
                dSchoolYear.collectionRates.push(document._id);

                await dTuitionFees.save();
                await dGrade.save();
                await dSchoolYear.save();

                return res.send({
                    error: false,
                    message: [document]
                });
            } catch (error) {
                return next(
                    Error(500, 'Error saving')
                )
            }
        }
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const documents = await CollectionRates.find().populate("schoolYear").populate("grade").populate("tuitionFees");
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error finding documents')
        )
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await CollectionRates.deleteMany();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error deleting documents')
        )
    }
}

exports.delete = async (req, res, next) => {
    try {
        const result = await CollectionRates.findByIdAndDelete(req.params.id);

        const dTuitionFees = await TuitionFees.findById(result.tuitionFees);
        const dGrade = await Grade.findById(result.grade);
        const dSchoolYear = await SchoolYear.findById(result.schoolYear);

        dTuitionFees.collectionRates = dTuitionFees.collectionRates.filter(
            (value, index) => {
                return ![value].join("").includes(result._id);
            }
        )

        dGrade.collectionRates = dGrade.collectionRates.filter(
            (value, index) => {
                return ![value].join("").includes(result._id);
            }
        )

        dSchoolYear.collectionRates = dSchoolYear.collectionRates.filter(
            (value, index) => {
                return ![value].join("").includes(result._id);
            }
        )

        await dTuitionFees.save();
        await dGrade.save();
        await dSchoolYear.save();

        res.send(result);
    } catch (error) {
        return next(
            Error(500, 'Error deleting document')
        )
    }
}

exports.find = async (req, res, next) => {
    try {
        const document = await CollectionRates.findById(req.params.id).populate("schoolYear").populate("grade").populate("tuitionFees");
        res.send(document);
    } catch (error) {
        return next(
            Error(500, 'Error finding document')
        )
    }
}