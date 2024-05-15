// checked

const { Children, ParentDetails, Parents, Account, HistoryStatus, Classes, SchoolTransferHistory, ChildcareCenter } = require('../models/model');
const Error = require('http-errors');
const { letters_24 } = require('../utils/common');
const { hashPassword } = require('./common/index.js');
const nodemailer = require('nodemailer');

exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(Error(400, 'Request body is empty'));
    }

    console.log(req.body);

    const { c_name, c_gender, c_birthday, c_address } = req.body;
    const { p_name, p_gender, p_phone, p_email, p_address, p_relationship } = req.body;
    const { user_name, password, role, startSchooling, childcareCenter } = req.body;


    if (!c_name || !c_gender || !c_birthday || !c_address
        || !p_name || !p_gender || !p_phone || !p_address || !p_relationship
        || !user_name || !password || !role || !startSchooling || !childcareCenter) {
        return res.send({
            error: true,
            message: 'Thiếu các trường bắt buộc.',
        });
    }

    try {
        const check_child = await Children.exists({ $and: [{ name: c_name }, { gender: c_gender }, { birthday: c_birthday }] });
        const check_account = await Account.exists({ $and: [{ name: user_name }] });
        const check_passwd = await Account.exists({ $and: [{ password: password }] });
        if (check_child) {
            return res.send({ error: true, message: 'Trẻ đã tồn tại.' });
        }
        if (check_account || check_passwd) {
            return res.send({ error: true, message: 'Tài khoản đã tồn tại.' });
        }

        // create
        const hashedPassword = await hashPassword(password);
        const new_account = await Account.create({ name: user_name, password: hashedPassword, role: role, });
        const new_children = await Children.create({
            name: c_name,
            gender: c_gender,
            birthday: c_birthday,
            address: c_address,
            account: new_account._id,
            statusChild: 'nhập học',
            startSchooling,
        });
        new_children.childcareCenter.push(childcareCenter);
        await new_children.save();
        await ChildcareCenter.findByIdAndUpdate(childcareCenter, { $push: { children: new_children._id } });
        const new_parent = await Parents.create({});
        const new_parentDetail = await ParentDetails.create({
            name: p_name, gender: p_gender, phone: p_phone, email: p_email.length != 0 ? p_email : 'không có', address: p_address, relationship: p_relationship, child: new_children._id, parents: new_parent._id,

        });
        const updatePromises = [
            Children.findByIdAndUpdate(new_children._id, { $push: { parentDetails: new_parentDetail._id } }),
            Parents.findByIdAndUpdate(new_parent._id, { $push: { parentDetails: new_parentDetail._id } })
        ];

        await Promise.all(updatePromises);

        if (p_email.length != 0) {
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'trantuanduy.20011105@gmail.com',
                    pass: 'yiavsqlfngxnxeod'
                }
            });
            const mailOptions = {
                from: 'trantuanduy.05112001@gmail.com',
                to: p_email,
                subject: 'Login',
                text: `Username: ${user_name}, Password: ${password}.`
                // html: html || null, // Sử dụng nội dung email dạng HTML của bạn hoặc nếu không có thì mặc định (null)
            };

            await transporter.sendMail(mailOptions);
        }

        return res.send({ error: false, message: 'Đã thêm thành công.' });
    } catch (error) {
        console.log(error);
        return next(Error(500, 'Error saving'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Children.find()
            .populate([
                'parentDetails',
                'childcareCenter',
                'account',
                {
                    path: 'receipt',
                    populate: {
                        path: 'classes',
                        populate: {
                            path: 'schoolYear grade'
                        }
                    }
                },
                {
                    path: 'classes',
                    populate: {
                        path: 'schoolYear grade',
                    },
                },
                {
                    path: 'attendance',
                    populate: {
                        path: 'session',
                    },
                },
                {
                    path: 'mealTicket',
                    populate: {
                        path: 'meal evaluate',
                        populate: {
                            path: 'dish',
                            populate: {
                                path: 'ingredient',
                                populate: {
                                    path: 'foodstuff',
                                },
                            },
                        },
                    },
                },
                {
                    path: 'cDI',
                    populate: {
                        path: 'month classes'
                    }
                }
            ]);

        res.send(documents);
    } catch (error) {
        console.log(error);
        return next(Error(500, 'Error finding documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await Children.findByIdAndDelete(req.params.id).populate('parentDetails');
        for (const value of result.parentDetails) {
            await ParentDetails.findByIdAndDelete(value._id);
        }
        await Parents.findByIdAndDelete(result.parentDetails[0].parents);
        await Account.findByIdAndDelete(result.account);
        return res.send({
            error: false,
            message: 'Đã xoá thành công.'
        });
    } catch (error) {
        return next(Error(500, 'Error deleting document'));
    }
};

exports.find = async (req, res, next) => {
    try {
        const document = await Children.findById(req.params.id)
            .populate([
                'parentDetails',
                'childcareCenter',
                {
                    path: 'cDI',
                    populate: {
                        path: 'month classes'
                    }
                },
                'account',
                {
                    path: 'classes',
                    populate: {
                        path: 'schoolYear grade',
                    },
                },
                {
                    path: 'attendance',
                    populate: {
                        path: 'session classes',
                    },
                },
                {
                    path: 'mealTicket',
                    populate: [
                        'classes',
                        {
                            path: 'meal',
                            populate: {
                                path: 'dish session'
                            }
                        }
                    ]
                },
                {
                    path: 'receipt',
                    populate: {
                        path: 'classes'
                    }
                }
            ]);
        res.send(document);
    } catch (error) {
        return next(Error(500, 'Error finding document'));
    }
};

exports.update = async (req, res, next) => {
    try {
        const { name, gender, birthday, address } = req.body;
        const _id = req.params.id;
        if (!name || !gender || !birthday || !address) {
            return res.send({
                error: true,
                message: 'Thiếu những trưởng bắt buộc.',
            });
        }
        const check_child = await Children.exists({ $and: [{ name: name }, { gender: gender }, { birthday: birthday }] });
        if (check_child) {
            const check_info = await Children.exists({
                _id: _id,
                address: address,
            });
            if (!check_info) {
                await Children.findByIdAndUpdate(_id, { address });
                return res.send({ error: false, message: 'Cập nhật thông tin thành công.' });
            }
            return res.send({ error: true, message: 'Trẻ đã tồn tại.' });
        }
        await Children.findByIdAndUpdate(_id, { name, gender, birthday, address });
        return res.send({ error: false, message: 'Cập nhật thông tin thành công.' });
    } catch (error) {
        return next(Error(500, 'Error updating'));
    }
};

exports.create_statusChange = async (req, res, next) => {
    try {
        const { status, date, children } = req.body;
        if (children.length == 0) {
            return res.send({
                error: true,
                message: 'Vui lòng chọn trẻ cần thay đổi trạng thái.'
            });
        }
        if (!status || !date) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            });
        }

        for (let value of children) {
            if (value.classes.length == 0) {
                return res.send({
                    error: true,
                    message: 'Trẻ chưa học lớp nào.'
                })
            }
            const classId = value.classes[value.classes.length - 1]._id;
            const currentYear = new Date().getFullYear().toString();
            const checkYear = value.classes[value.classes.length - 1].schoolYear.name.includes(currentYear);
            if (!classId || !checkYear) {
                return res.send({
                    error: true,
                    message: 'Trẻ chưa học lớp nào.'
                })
            }
        }

        for (let value of children) {
            const classId = value.classes[value.classes.length - 1]._id;

            const historyStatus = await HistoryStatus.create({
                status,
                date,
                child: value._id,
                classes: classId,
            });
            await Children.findByIdAndUpdate(value._id, { $push: { historyStatus: historyStatus._id.toString() }, statusChild: historyStatus.status });
            await Classes.findByIdAndUpdate(classId, { $push: { historyStatus: historyStatus._id.toString() } });
        }

        return res.send({
            error: false,
            message: 'Đã cập nhật trạng thái thành công.'
        })

    } catch (error) {
        console.log(error);
        return next(Error(500, 'Error create status change'));
    }
}

exports.transferSchool = async (req, res, next) => {
    try {
        const { children, childcareCenter, date } = req.body;
        console.log(childcareCenter);
        if (children.length == 0) {
            return res.send({
                error: true,
                message: 'Vui lòng chọn trẻ cần chuyển trường.'
            });
        }
        if (!childcareCenter) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }
        for (let child of children) {
            const childInfo = await Children.findById(child._id);
            await ChildcareCenter.findByIdAndUpdate(childInfo.childcareCenter[childInfo.childcareCenter.length - 1].toString(), { $pull: { children: child._id } });
            console.log('cc');
            const document = await SchoolTransferHistory.create({
                child: child._id,
                childcareCenter: childInfo.childcareCenter[childInfo.childcareCenter.length - 1].toString(),
                date: childInfo.startSchooling,
            });
            childInfo.startSchooling = date;
            childInfo.statusChild = 'Nhập học';
            childInfo.childcareCenter.push(childcareCenter);
            await childInfo.save();


            await Children.findByIdAndUpdate(child, { $push: { schoolTransferHistory: child } });
            await ChildcareCenter.findByIdAndUpdate(childcareCenter, { $push: { children: child._id } });
        }
        return res.send({
            error: false,
            message: 'Đã chuyển trường thành công.'
        })

    } catch (error) {
        console.log(error);
    }
}