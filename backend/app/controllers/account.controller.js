const { Children, Teacher, Account } = require('../models/model');
const Error = require('http-errors');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length != 0) {
        var name = req.body.name,
            password = req.body.password,
            user = req.body.user,
            child = req.body.child,
            teacher = req.body.teacher,
            role = req.body.role;
        const check = await Account.find({ name: name });
        if (check.length != 0) {
            return res.send({
                error: true,
                message: 'Already exists',
            });
        } else {
            try {
                console.log(req.body);
                const document = await new Account({
                    name: name,
                    password: bcrypt.hashSync(req.body.password, salt, null),
                    role: role,
                }).save();

                if (user == 'child') {
                    const childd = await Children.findById(child);
                    childd.account = document;
                    await childd.save();
                }

                if (user == 'teacher') {
                    const teacherd = await Teacher.findById(teacher);
                    teacherd.account = document;
                    await teacherd.save();
                }

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
        const documents = await Account.find();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error finding documents')
        )
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await Account.deleteMany();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error deleting documents')
        )
    }
}

exports.delete = async (req, res, next) => {
    try {
        const result = await Account.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        return next(
            Error(500, 'Error deleting document')
        )
    }
}

exports.find = async (req, res, next) => {
    try {
        const document = await Account.findById(req.params.id);
        res.send(document);
    } catch (error) {
        return next(
            Error(500, 'Error finding document')
        )
    }
}

exports.signin = async (req, res, next) => {
    try {
        let user = await Account.findOne({ name: req.body.name });
        let signinStatus = null;
        if (user != null) {
            signinStatus = bcrypt.compareSync(req.body.password, user.password);
        }
        if (signinStatus) {
            return res.send({
                status: signinStatus,
                message: user,
            });
        }
        return res.send({
            status: signinStatus,
        });
    } catch (error) {

    }
}

