// checked

const { ParentDetails, Parents, Children } = require('../models/model');
const Error = require('http-errors');
const { letters_24 } = require('../utils/common');

exports.create = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(Error(400, 'Request body is empty.'));
    }

    const { name, gender, phone, email, address, relationship, parents, child } = req.body;

    if (!name || !gender || !phone || !email || !address || !relationship || !parents || !child) {
        return res.send({
            error: true,
            message: 'Missing required fields.',
        })
    }

    const check = await ParentDetails.exists({
        $and: [
            { name: name },
            { relationship: relationship },
            { child: child },
            { parents: parents },
        ]
    });

    if (check) {
        return res.send({
            error: true,
            message: 'Already exists.',
        });
    }

    try {
        const document = await ParentDetails.create({
            name,
            gender,
            phone,
            email,
            address,
            relationship,
            child: child,
            parents,
        });

        const updatePromises = [
            Children.findByIdAndUpdate(child, { $push: { parentDetails: document._id } }),
            Parents.findByIdAndUpdate(parents, { $push: { parentDetails: document._id } })
        ];

        await Promise.all(updatePromises);

        return res.send({
            error: false,
            message: [document]
        });
    } catch (error) {
        return next(Error(500, 'Error saving'));
    }
};

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
                message: 'Each child requires at least two parents.'
            })
        }

        const document = await ParentDetails.findByIdAndDelete(req.params.id);

        const updatePromises = [
            Children.findByIdAndUpdate(document.child, { $pull: { parentDetails: document._id } }),
            Parents.findByIdAndUpdate(document.parents, { $pull: { parentDetails: document._id } })
        ];

        await Promise.all(updatePromises);

        return res.send(document);
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
    const { name, gender, phone, email, address, relationship } = req.body;
    const parentDetails_id = req.params.id;
    if (!name || !gender || !phone || !email || !address || !relationship) {
        return res.send({
            error: true,
            message: 'Missing required fields.',
        })
    }

    const check = await ParentDetails.exists({
        name, relationship,
    });

    if (check) {
        return res.send({
            error: true,
            message: 'Already exists.',
        });
    }
    try {
        const document = await ParentDetails.findByIdAndUpdate(parentDetails_id, { name, gender, phone, email, address, relationship }, { new: true });
        return res.send({
            error: true,
            message: document,
        })
    } catch (error) {
        return next(Error(500, 'Error updating document'));
    }
}