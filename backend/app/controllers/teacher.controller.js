const { response } = require('express');
const { Teacher, Position, Diploma, SchoolYear, Account } = require('../models/model');
const Error = require('http-errors');
const { hashPassword } = require('./common/index.js');
const nodemailer = require('nodemailer');

exports.create = async (req, res, next) => {
    // {
    //     "name": "bay bay",
    //     "gender": "true",
    //     "phone": "0345670987",
    //     "email": "trantuanduy.05112001@gmail.com",
    //     "address": "soc trang",
    //     "position": "64c8bee4595b92759aa32795",
    //     "diploma": "64c4a3713ae308fbdced5159",
    //     "user_name": "cp8",
    //     "password": "cp8",
    //     "role": "teacher"
    // }
    try {
        const { name, gender, phone, email, address, position, diploma } = req.body;
        const { user_name, password, role } = req.body;
        if (!name || !gender || !phone || !email || !address || !position || !diploma || !user_name || !password || !role) {
            return res.send({
                error: true,
                message: 'Missing required fields.'
            })
        }
        const check = await Teacher.exists({
            $or: [
                { phone: phone },
                { email: email }
            ]
        });
        const check_account = await Account.exists({ $and: [{ name: user_name }] });

        if (check || check_account) {
            return res.send({
                error: true,
                message: 'Already exists.'
            });
        } else {
            const hashedPassword = await hashPassword(password);
            const new_account = await Account.create({ name: user_name, password: hashedPassword, role: role, });
            const document = await Teacher.create({
                name,
                gender,
                phone,
                email,
                address,
                position,
                diploma,
                account: new_account._id,
            });

            await Position.findByIdAndUpdate(position, { $push: { teacher: document._id } });
            await Diploma.findByIdAndUpdate(diploma, { $push: { teacher: document._id } });

            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'trantuanduy.20011105@gmail.com',
                    pass: 'yiavsqlfngxnxeod'
                }
            });
            const mailOptions = {
                from: 'trantuanduy.05112001@gmail.com',
                to: email,
                subject: 'Login',
                text: `Username: ${user_name}, Password: ${password}.`
                // html: html || null, // Sử dụng nội dung email dạng HTML của bạn hoặc nếu không có thì mặc định (null)
            };

            await transporter.sendMail(mailOptions);

            return res.send({
                error: false,
                message: [document]
            });
        }
    } catch (error) {
        console.log(error);
        return next(
            Error(500, 'Error saving')
        )
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Teacher.find().populate("position diploma assignment.classes.schoolYear account");
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error finding documents')
        )
    }
}

exports.delete = async (req, res, next) => {
    try {
        const result = await Teacher.findByIdAndDelete(req.params.id);
        await Position.findByIdAndUpdate(result.position, { $pull: { teacher: result._id } });
        await Diploma.findByIdAndUpdate(result.diploma, { $pull: { teacher: result._id } });
        await Account.findByIdAndDelete(result.account);

        res.send({
            error: false,
            message: 'Successfully deleted.'
        });
    } catch (error) {
        return next(
            Error(500, 'Error deleting document')
        )
    }
}

exports.deleteDiploma = async (req, res, next) => {
    const { diplomas } = req.body;
    if (!diplomas || diplomas.length == 0) {
        return res.send({
            error: true,
            message: 'Missing required fields.'
        })
    }
    let count = 0;
    try {
        for (let diploma of diplomas) {
            const check_diploma = await Teacher.exists({ _id: request.params.id, diploma: { $in: [diploma] } });
            if (!check_diploma) {
                const teacher = await Teacher.findByIdAndUpdate(req.params.id, { $push: { diploma: diploma } }, { new: true });
                const diploma_update = await Diploma.findByIdAndUpdate(diploma, { $push: { teacher: teacher._id } }, { new: true });
                count++;
            }
        }

        return res.send({
            error: false,
            message: `Successfully add ${count} diplomas.`
        })
    } catch (error) {
        console.log(error);
    }
}

exports.addDiploma = async (req, res, next) => {
    const { diplomas } = req.body;
    if (!diplomas || diplomas.length == 0) {
        return res.send({
            error: true,
            message: 'Missing required fields.'
        })
    }
    let count = 0;
    try {
        for (let diploma of diplomas) {
            const check_diploma = await Teacher.exists({ _id: request.params.id, diploma: { $in: [diploma] } });
            if (!check_diploma) {
                const teacher = await Teacher.findByIdAndUpdate(req.params.id, { $push: { diploma: diploma } }, { new: true });
                const diploma_update = await Diploma.findByIdAndUpdate(diploma, { $push: { teacher: teacher._id } }, { new: true });
                count++;
            }
        }

        return res.send({
            error: false,
            message: `Successfully add ${count} diplomas.`
        })
    } catch (error) {
        console.log(error);
    }
}

exports.find = async (req, res, next) => {
    try {
        const document = await Teacher.findById(req.params.id).populate("position diploma assignment account");
        res.send(document);
    } catch (error) {
        return next(
            Error(500, 'Error finding document')
        )
    }
}

exports.update = async (req, res, next) => {
    const { name, gender, phone, email, address, position, diploma } = req.body;
    if (!name || !gender || !phone || !email || !address || !position || !diploma) {
        return res.send({
            error: true,
            message: 'Missing required fields.'
        })
    }
    const check = await Teacher.exists({
        _id: !req.params.id,
        $or: [
            { phone: phone },
            { email: email }
        ]
    });
    if (check) {
        return res.send({
            error: true,
            message: 'Already exists.'
        });
    }
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send({
            error: false,
            message: teacher,
        });
    } catch (error) {
        console.log(error);
    }
}
