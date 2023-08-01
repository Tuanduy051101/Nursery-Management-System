// checked

const { Children, ParentDetails, Parents, Account } = require('../models/model');
const Error = require('http-errors');
const { letters_24 } = require('../utils/common');
const { hashPassword } = require('./common/index.js');
const nodemailer = require('nodemailer');

exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(Error(400, 'Request body is empty'));
    }

    const { c_name, c_gender, c_birthday, c_address } = req.body;
    const { p_name, p_gender, p_phone, p_email, p_address, p_relationship } = req.body;
    const { user_name, password, role } = req.body;


    if (!c_name || !c_gender || !c_birthday || !c_address
        || !p_name || !p_gender || !p_phone || !p_email || !p_address || !p_relationship
        || !user_name || !password || !role) {
        return res.send({
            error: true,
            message: 'Missing required fields.',
        });
    }

    try {
        const check_child = await Children.exists({ $and: [{ name: c_name }, { gender: c_gender }, { birthday: c_birthday }] });
        const check_account = await Account.exists({ $and: [{ name: user_name }] });
        if (check_child || check_account) {
            return res.send({ error: true, message: 'Already exists.' });
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
        });
        const new_parent = await Parents.create({});
        const new_parentDetail = await ParentDetails.create({
            name: p_name, gender: p_gender, phone: p_phone, email: p_email, address: p_address, relationship: p_relationship, child: new_children._id, parents: new_parent._id,
        });

        const updatePromises = [
            Children.findByIdAndUpdate(new_children._id, { $push: { parentDetails: new_parentDetail._id } }),
            Parents.findByIdAndUpdate(new_parent._id, { $push: { parentDetails: new_parentDetail._id } })
        ];

        await Promise.all(updatePromises);

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

        return res.send({ error: false, message: [new_account, new_children, new_parent, new_parentDetail] });
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
                'cDI',
                'account',
                'receipt',
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
        return res.send(result);
    } catch (error) {
        return next(Error(500, 'Error deleting document'));
    }
};

exports.find = async (req, res, next) => {
    try {
        const document = await Children.findById(req.params.id)
            .populate([
                'parentDetails',
                'cDI',
                'account',
                'receipt',
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
            ]);
        res.send(document);
    } catch (error) {
        return next(Error(500, 'Error finding document'));
    }
};

exports.update = async (req, res, next) => {
    try {
        const { name, gender, birthday, address } = req.body;
        const child = await Children.findByIdAndUpdate(req.params.id, { name, gender, birthday, address }, { new: true });
        return res.send({ error: false, message: child });
    } catch (error) {
        return next(Error(500, 'Error updating'));
    }
};
