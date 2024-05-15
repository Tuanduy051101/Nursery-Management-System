// checked

const { ParentDetails, Parents, Children } = require('../models/model');
const Error = require('http-errors');
const { letters_24 } = require('../utils/common');

exports.create = async (req, res, next) => {
    console.log(req.body);
    try {
        const { name, gender, phone, email, address, relationship, child, parents } = req.body;

        if (!name || !phone || !address || !relationship || !child || !parents) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }

        const check = await ParentDetails.exists({
            child: child,
            name: name,
            phone: phone,
        });

        if (check) {
            return res.send({
                error: true,
                message: 'Phụ huynh đã tồn tại.'
            })
        }

        if (!email) req.body.email = 'không có';

        const document = await ParentDetails.create(req.body);

        await Children.findByIdAndUpdate(child, { $push: { parentDetails: document._id } });
        await Parents.findByIdAndUpdate(parents, { $push: { parentDetails: document._id } })

        return res.send({
            error: false,
            message: 'Đã thêm thành công.'
        });
    } catch (error) {
        console.log(error);
        return next(
            Error(500, 'Error saving')
        )
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const documents = await ParentDetails.find().populate("parents");
        res.send(documents);
    } catch (error) {
        return next(Error(500, 'Error finding documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const children = await Children.find({
            parentDetails: req.params.id,
        });

        if (children[0].parentDetails.length <= 1) {
            return res.send({
                error: true,
                message: 'Mỗi trẻ phải có ít nhất một phụ huynh.'
            })
        }

        const document = await ParentDetails.findByIdAndDelete(req.params.id);

        const updatePromises = [
            Children.findByIdAndUpdate(document.child, { $pull: { parentDetails: document._id } }),
            Parents.findByIdAndUpdate(document.parents, { $pull: { parentDetails: document._id } })
        ];

        await Promise.all(updatePromises);

        return res.send({
            error: false,
            message: 'Đã xoá thành công.'
        });
    } catch (error) {
        console.log(error);
    }
};

exports.find = async (req, res, next) => {
    try {
        const document = await ParentDetails.findById(req.params.id);
        res.send(document);
    } catch (error) {
        return next(Error(500, 'Error finding document'));
    }
};

exports.update = async (req, res, next) => {
    console.log(req.body)
    const { name, gender, phone, email, address, relationship, child } = req.body;
    const parentDetails_id = req.params.id;
    if (!name || !gender || !phone || !address || !relationship) {
        return res.send({
            error: true,
            message: 'Thiếu những trường bắt buộc.',
        })
    }
    const check = await ParentDetails.exists({
        name, child, phone, email, address, relationship, gender
    });

    if (check) {
        return res.send({
            error: true,
            message: 'Phụ huynh đã tồn tại.',
        });
    }
    try {
        const document = await ParentDetails.findByIdAndUpdate(parentDetails_id, { name, gender, phone, email: email.length != 0 ? email : 'không có', address, relationship }, { new: true });
        return res.send({
            error: false,
            message: 'Cập nhật thông tin thành công.',
        })
    } catch (error) {
        return next(Error(500, 'Error updating document'));
    }
}