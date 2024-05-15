const { Payment, PaymentDetail } = require('../models/model');
const createError = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        const { name, makeDate, teacher, note, listItem } = req.body;
        let total = 0;

        if (!name || !makeDate || !teacher || listItem.length === 0) {
            return res.status(400).json({
                error: true,
                message: 'Missing required fields.'
            });
        }

        const payment = await Payment.create({
            name,
            total,
            teacher,
            datePerForm: makeDate,
            note: note || 'không có'
        });

        for (const value of listItem) {
            const payDetail = await PaymentDetail.create({
                amount: value.amount,
                cost: value.cost,
                item: value.item,
                note: value.note,
                payment: payment._id
            });

            await Payment.findByIdAndUpdate(payment._id, { $push: { paymentDetail: payDetail._id } });
            total += parseFloat(value.cost) * parseFloat(value.amount);
        }

        await Payment.findByIdAndUpdate(payment._id, { total });

        return res.json({
            error: false,
            message: 'Successfully created.'
        });
    } catch (error) {
        return next(createError(500, 'Error saving'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Payment.find().populate([
            'paymentDetail',
            'teacher'
        ]);
        res.json(documents);
    } catch (error) {
        return next(createError(500, 'Error finding documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await Payment.findByIdAndDelete(req.params.id);
        for (const value of result.paymentDetail) {
            await PaymentDetail.findByIdAndDelete(value);
        }
        res.json({
            error: false,
            message: 'Successfully deleted.'
        });
    } catch (error) {
        return next(createError(500, 'Error deleting document'));
    }
};

exports.find = async (req, res, next) => {
    try {
        const document = await Payment.findById(req.params.id)
            .populate([
                'paymentDetail',
                'teacher'
            ]);

        res.json(document);
    } catch (error) {
        return next(createError(500, 'Error finding document'));
    }
};
