// checked

const { SchoolYear, Notification, Teacher, Children } = require('../models/model');
const createError = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        let { title, content, dateSent, recipient, sender, status, typeRecipient } = req.body;
        const document = await Notification.create({ title, content, dateSent, recipient, sender, status, typeRecipient });
        return res.send({
            error: false,
            message: 'Đã tạo thành công.'
        });
    } catch (error) {
        console.log(error);
        return next(createError(500, 'Error saving document'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        let documents = await Notification.find();

        // Sử dụng Promise.all để đợi tất cả các Promise được giải quyết
        documents = await Promise.all(documents.map(async (i) => {
            let recipientInfo = null;
            if (i.typeRecipient == 'teacher') {
                recipientInfo = await Teacher.findById(i.recipient);
            } else {
                recipientInfo = await Children.findById(i.recipient);
            }

            return {
                ...i,
                recipientInfo: recipientInfo,
            };
        }));

        return res.send(documents);

        // res.send({
        //     notification: documents[0]._doc,
        //     recipientInfo: documents[0].recipientInfo
        // });
    } catch (error) {
        console.log(error);
        return next(createError(500, 'Error finding documents'));
    }
};


exports.delete = async (req, res, next) => {
    try {
        const result = await SchoolYear.findByIdAndDelete(req.params.id);
        res.send({
            error: false,
            message: 'Đã xoá thành công.'
        });
    } catch (error) {
        return next(createError(500, 'Error deleting document'));
    }
};

exports.find = async (req, res, next) => {
    try {
        const document = await SchoolYear.findById(req.params.id)
            .populate([
                'childcareCenter',
                { path: 'classes', populate: { path: 'grade schoolYear' } },
                { path: 'collectionRates', populate: { path: 'tuitionFees' } },
            ]);
        res.send(document);
    } catch (error) {
        return next(createError(500, 'Error finding document'));
    }
};

exports.update = async (req, res, next) => {
    try {
        const _id = req.params.id;
        await Notification.findByIdAndUpdate(_id, { status: 'đã xem' });
        return res.send({
            error: false,
            message: 'Đã cập nhật thông tin thành công.'
        })
    } catch (error) {
        return next(createError(500, 'Error saving document'));
    }
};