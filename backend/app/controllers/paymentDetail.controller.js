const { PaymentDetail, Payment } = require('../models/model');
const createError = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        const { amount, cost, note, item, payment } = req.body;
        if (!amount || !cost || !item) {
            return res.status(400).json({
                error: true,
                required: 'Missing required fields.'
            });
        }

        const document = await PaymentDetail.create({ amount, cost, item, payment, note: note || 'không có' });

        const _payment = await Payment.findById(payment);
        const total = parseFloat(_payment.total) + parseFloat(amount) * parseFloat(cost);
        await Payment.findByIdAndUpdate(payment, { $push: { paymentDetail: document._id }, total });

        return res.json({
            error: false,
            message: 'Successfully created.',
        });
    } catch (error) {
        return next(createError(500, 'Error saving document'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await PaymentDetail.find();
        res.json(documents);
    } catch (error) {
        return next(createError(500, 'Error finding documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await PaymentDetail.findByIdAndDelete(req.params.id);
        await Payment.findByIdAndUpdate(result.payment, { $pull: { paymentDetail: result._id } });

        const _payment = await Payment.findById(result.payment);
        const total = _payment.paymentDetail.reduce((acc, r) => acc + (parseFloat(r.amount) * parseFloat(r.cost)), 0);
        await Payment.findByIdAndUpdate(result.payment, { total });

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
        const document = await PaymentDetail.findById(req.params.id);
        res.json(document);
    } catch (error) {
        return next(createError(500, 'Error finding document'));
    }
};

exports.update = async (req, res, next) => {
    try {
        const { amount, cost, note, item, payment } = req.body;
        if (!amount || !cost || !item) {
            return res.status(400).json({
                error: true,
                required: 'Missing required fields.'
            });
        }
        await PaymentDetail.findByIdAndUpdate(req.params.id, {
            amount, cost, note, item,
        });

        const _payment = await Payment.findById(payment);
        const total = _payment.paymentDetail.reduce((acc, r) => acc + (parseFloat(r.amount) * parseFloat(r.cost)), 0);
        await Payment.findByIdAndUpdate(payment, { total });

        return res.json({
            error: false,
            message: 'Successfully updated.',
        });
    } catch (error) {
        return next(createError(500, 'Error saving document'));
    }
};
