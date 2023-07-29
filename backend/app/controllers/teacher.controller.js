const { response } = require('express');
const { Teacher, Position, Diploma, SchoolYear } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    console.log(req.body);
    if (Object.keys(req.body).length != 0) {
        const name = req.body.name,
            gender = req.body.gender,
            phone = req.body.phone,
            email = req.body.email,
            address = req.body.address,
            position = req.body.position,
            account = 'aaaaaaaaaaaaaaaaaaaaaaaa',
            diploma = req.body.diploma;
        const check = await Teacher.find({
            $or: [
                { phone: { $in: phone } },
                { email: { $in: email } }
            ]
        });
        console.log(check);
        if (check.length != 0) return res.send({
            error: true,
            message: 'Already exists of phone or email !'
        });
        else {
            console.log('cc');
            try {
                const document = await new Teacher({
                    name: name,
                    gender: gender,
                    phone: phone,
                    email: email,
                    address: address,
                    position: position,
                    diploma: diploma,
                    account: account,
                }).save();

                const dPosition = await Position.findById(position);
                const dDiploma = await Diploma.findById(diploma);

                dPosition.teacher.push(document._id);
                dDiploma.teacher.push(document._id);

                await dPosition.save();
                await dDiploma.save();

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
        const documents = await Teacher.find().populate("position").populate("diploma").populate({
            path: 'assignment',
            populate: {
                path: "classes",
                populate: {
                    path: 'schoolYear',
                }
            }
        }).populate("account");
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error finding documents')
        )
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await Teacher.deleteMany();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error deleting documents')
        )
    }
}

exports.delete = async (req, res, next) => {
    try {
        const result = await Teacher.findByIdAndDelete(req.params.id);

        const dPosition = await Position.findById(result.position);
        const dDiploma = await Diploma.findById(result.diploma);

        dPosition.teacher = dPosition.teacher.filter(
            (value, index) => {
                return ![value].join("").includes(result._id);
            }
        )

        dDiploma.teacher = dDiploma.teacher.filter(
            (value, index) => {
                return ![value].join("").includes(result._id);
            }
        )

        await dPosition.save();
        await dDiploma.save();

        res.send(result);
    } catch (error) {
        return next(
            Error(500, 'Error deleting document')
        )
    }
}

exports.deleteDiploma = async (req, res, next) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        teacher.diploma = teacher.diploma.filter(
            (value, index) => {
                return value != req.body.diploma;
            }
        )
        await teacher.save();

        const diploma = await Diploma.findById(req.body.diploma);
        console.log(diploma);
        diploma.teacher = diploma.teacher.filter(
            (value, index) => {
                console.log([value].join("").includes([teacher._id].join("")));
                console.log([value].join(""));
                console.log([teacher._id].join(""));
                return ![value].join("").includes([teacher._id].join(""));
            }
        );
        console.log(diploma);
        await diploma.save();
        return res.send({
            error: false,
        })
    } catch (error) {

    }
}

exports.addDiploma = async (req, res, next) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        teacher.diploma.push(req.body.diploma);
        await teacher.save();

        const diploma = await Diploma.findById(req.body.diploma);
        diploma.teacher.push(teacher._id);
        await diploma.save();
        return res.send({
            error: false,
        })
    } catch (error) {
        console.log(error);
    }
}

exports.find = async (req, res, next) => {
    try {
        const document = await Teacher.findById(req.params.id).populate("position").populate("diploma").populate({
            path: 'assignment',
        }).populate("account");
        res.send(document);
    } catch (error) {
        return next(
            Error(500, 'Error finding document')
        )
    }
}

exports.update = async (req, res, next) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        teacher.name = req.body.name;
        teacher.gender = req.body.gender;
        teacher.phone = req.body.phone;
        teacher.email = req.body.email;
        teacher.address = req.body.address;
        teacher.position = req.body.position;

        await teacher.save();

        res.send({
            error: false,
            message: teacher,
        });

    } catch (error) {
        console.log(error);
    }
}