// checked

const { Parents, ParentDetails, Children } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    console.log(req.body);
    try {
        const { name, gender, phone, email, address, relationship, child } = req.body;

        if (!name || !gender || !phone || !email || !address || !child) {
            return res.send({
                error: true,
                message: 'Missing required fields.'
            })
        }

        const check = await ParentDetails.exists({
            child: child,
            name: name,
            phone: phone,
            email: email,
        });

        if (check) {
            return res.send({
                error: true,
                message: 'Already exists.'
            })
        }

        const new_parent = await Parents.create({});

        req.body.parents = new_parent._id;

        const document = await ParentDetails.create(req.body);

        await Children.findByIdAndUpdate(child, { $push: { parentDetails: document._id } });
        await Parents.findByIdAndUpdate(new_parent._id, { $push: { parentDetails: document._id } })

        return res.send({
            error: false,
            message: 'Successfully created.'
        });
    } catch (error) {
        return next(
            Error(500, 'Error saving')
        )
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Parents.find().populate("Parents").populate("grade");
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error finding documents')
        )
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await Parents.deleteMany();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error deleting documents')
        )
    }
}

exports.delete = async (req, res, next) => {
    try {
        const document = await Parents.findByIdAndDelete(req.params.id);
        res.send(document);
    } catch (error) {
        console.error(error);
    }
}

exports.find = async (req, res, next) => {
    try {
        const document = await Parents.findById(req.params.id);
        res.send(document);
    } catch (error) {
        return next(
            Error(500, 'Error finding document')
        )
    }
}