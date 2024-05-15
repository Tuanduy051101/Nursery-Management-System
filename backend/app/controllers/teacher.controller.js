const { response } = require('express');
const { Teacher, Position, Diploma, SchoolYear, Account, ChildcareCenter, WorkTransferHistory } = require('../models/model');
const Error = require('http-errors');
const { hashPassword } = require('./common/index.js');
const nodemailer = require('nodemailer');

exports.create = async (req, res, next) => {
    console.log(req.body);
    try {
        const { name, gender, phone, email, address, position, diploma, childcareCenter, startWorking } = req.body;
        const { user_name, password, role } = req.body;
        if (!name || !gender || !phone || !email || !address || !position || !diploma || !user_name || !password || !role || !childcareCenter || !startWorking) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
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
            if (check_account) {
                return res.send({
                    error: true,
                    message: `Tên tài khoản đã tồn tại.`
                });
            }
            return res.send({
                error: true,
                message: `E-mail hoặc số điện thoại đã tồn tại.`
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
                startWorking,
            });
            document.childcareCenter.push(childcareCenter);
            await document.save();
            await ChildcareCenter.findByIdAndUpdate(childcareCenter, { $push: { teacher: document._id } });
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
                message: 'Đã thêm thành công.'
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
        const documents = await Teacher.find().populate([
            'position',
            'diploma',
            'childcareCenter',
            {
                path: 'workTransferHistory',
                populate: {
                    path: 'childcareCenter'
                }
            },
            'account',
            {
                path: 'assignment',
                populate: {
                    path: 'classes',
                    populate: {
                        path: 'grade schoolYear'
                    }
                }
            }
        ]);
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
            message: 'Đã xoá thành công.'
        });
    } catch (error) {
        return next(
            Error(500, 'Error deleting document')
        )
    }
}

exports.deleteDiploma = async (req, res, next) => {
    const { diplomas } = req.body;
    const _id = req.params.id;
    if (!diplomas || diplomas.length == 0) {
        return res.send({
            error: true,
            message: 'Thiếu các trường bắt buộc.'
        })
    }
    let count = 0;
    try {
        for (let diploma of diplomas) {
            const check_diploma = await Teacher.exists({ _id: _id, diploma: { $in: [diploma] } });
            if (check_diploma) {
                const teacher = await Teacher.findByIdAndUpdate(_id, { $pull: { diploma: diploma } }, { new: true });
                const diploma_update = await Diploma.findByIdAndUpdate(diploma, { $pull: { teacher: teacher._id } }, { new: true });
                count++;
            }
        }

        return res.send({
            error: false,
            message: `Đã xoá ${count} bằng cấp.`
        })
    } catch (error) {
        console.log(error);
    }
}

exports.addDiploma = async (req, res, next) => {
    const { diplomas } = req.body;
    const _id = req.params.id;
    if (!diplomas || diplomas.length == 0) {
        return res.send({
            error: true,
            message: 'Thiếu các trường bắt buộc.'
        })
    }
    let count = 0;
    try {
        for (let diploma of diplomas) {
            const check_diploma = await Teacher.exists({ _id: _id, diploma: { $in: [diploma] } });
            if (!check_diploma) {
                const teacher = await Teacher.findByIdAndUpdate(_id, { $push: { diploma: diploma } }, { new: true });
                const diploma_update = await Diploma.findByIdAndUpdate(diploma, { $push: { teacher: teacher._id } }, { new: true });
                count++;
            }
        }

        return res.send({
            error: false,
            message: `Đã thêm thành công.`
        })
    } catch (error) {
        console.log(error);
    }
}

exports.find = async (req, res, next) => {
    try {
        const document = await Teacher.findById(req.params.id).populate([
            'position', 'diploma',
            'childcareCenter',
            {
                path: 'workTransferHistory',
                populate: {
                    path: 'childcareCenter'
                }
            },
            {
                path: 'assignment',
                populate: [
                    'duty',
                    {
                        path: 'classes',
                        populate: {
                            path: 'schoolYear grade'
                        }
                    }
                ]
            }
        ]);
        res.send(document);
    } catch (error) {
        return next(
            Error(500, 'Error finding document')
        )
    }
}

exports.update = async (req, res, next) => {
    const { name, gender, phone, email, address, position } = req.body;
    if (!name || !gender || !phone || !email || !address || !position) {
        return res.send({
            error: true,
            message: 'Thiếu các trường bắt buộc.'
        })
    }
    const check = await Teacher.exists({
        _id: req.params.id,
        $or: [
            { phone: phone },
            { email: email }
        ]
    });
    if (check) {
        const check_phone = await Teacher.exists({
            _id: req.params.id,
            $and: [
                { phone: phone },
            ]
        });
        const check_email = await Teacher.exists({
            _id: req.params.id,
            $and: [
                { email: email }
            ]
        });
        const check_info = await Teacher.exists({
            _id: req.params.id,
            $and: [
                { name: name },
                { gender: gender },
                { address: address },
                { position: position },
                { phone: phone },
                { email: email }
            ]
        });
        if (!check_phone) {
            await Teacher.findByIdAndUpdate(req.params.id, { name, gender, address, position, phone }, { new: true });
        }
        if (!check_email) {
            await Teacher.findByIdAndUpdate(req.params.id, { name, gender, address, position, email }, { new: true });
        }
        if (!check_info) {
            await Teacher.findByIdAndUpdate(req.params.id, { name, gender, address, position }, { new: true });
            return res.send({
                error: false,
                message: 'Đã cập nhật thông tin thành công.'
            });
        }
        return res.send({
            error: true,
            message: 'Thông tin đã tồn tại.'
        });
    }
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, { name, gender, phone, email, address, position }, { new: true });
        res.send({
            error: false,
            message: teacher,
        });
    } catch (error) {
        console.log(error);
    }
}

exports.transferWork = async (req, res, next) => {
    try {
        const { teacher, childcareCenter, date } = req.body;
        if (teacher.length == 0) {
            return res.send({
                error: true,
                message: 'Vui lòng chọn giáo viên cần chuyển công tác.'
            });
        }
        if (!childcareCenter) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }

        for (let value of teacher) {
            const teacherInfo = await Teacher.findById(value._id);
            await ChildcareCenter.findByIdAndUpdate(teacherInfo.childcareCenter[teacherInfo.childcareCenter.length - 1].toString(), { $pull: { teacher: value._id } });

            const document = await WorkTransferHistory.create({
                teacher: value._id,
                childcareCenter: teacherInfo.childcareCenter[teacherInfo.childcareCenter.length - 1].toString(),
                date: teacherInfo.startWorking,
            });

            teacherInfo.startWorking = date;
            teacherInfo.childcareCenter.push(childcareCenter);
            await teacherInfo.save();

            await Teacher.findByIdAndUpdate(teacher, { $push: { workTransferHistory: document._id } });
            await ChildcareCenter.findByIdAndUpdate(childcareCenter, { $push: { teacher: value._id } });
        }

        return res.send({
            error: false,
            message: 'Đã chuyển trường thành công.'
        })

    } catch (error) {
        console.log(error);
    }
}