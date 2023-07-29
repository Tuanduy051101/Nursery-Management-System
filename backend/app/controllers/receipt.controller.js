const { Receipt, Classes, Children, Month } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    console.log(req.body);
    if (Object.keys(req.body).length != 0) {
        const child = req.body.child,
            classes = req.body.classes,
            dateStart = req.body.dateStart,
            dateEnd = req.body.dateEnd,
            datePerForm = req.body.datePerForm,
            total = req.body.total,
            status = req.body.status;

        const check = await Receipt.find({
            $and: [
                { child: { $in: child } },
                { classes: { $in: classes } },
            ]
        });
        if (check.length != 0) return res.send('Already existing');
        else {
            try {
                const document = await new Receipt({
                    child: child,
                    classes: classes,
                    dateStart: dateStart,
                    dateEnd: dateEnd,
                    datePerForm: datePerForm,
                    total: total,
                    status: status,
                }).save();

                const dChild = await Children.findById(child);
                const dClasses = await Classes.findById(classes);

                dChild.receipt.push(document._id);
                dClasses.receipt.push(document._id);

                await dChild.save();
                await dClasses.save();

                return res.send(document);

            } catch (error) {
                return next(
                    Error(500, 'Error saving')
                )
            }
        }
    }
}

exports.update = async (req, res, next) => {
    try {
        console.log(req.params.id);
        let Receipt = await Receipt.findById(req.params.id);
        Receipt.height = req.body.height || Receipt.height;
        Receipt.weight = req.body.weight || Receipt.weight;
        Receipt.health = req.body.health || Receipt.health;
        Receipt.roses = req.body.roses || Receipt.roses;
        await Receipt.save();
        return res.send(Receipt);
    } catch (error) {
        return next(
            Error(500, 'Error updating')
        )
    }
}

exports.findAll = async (req, res, next) => {
    try {
        console.log('start')
        const documents = await Receipt.find().populate("child").populate("classes");
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error finding documents')
        )
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await Receipt.deleteMany();
        res.send(documents);
    } catch (error) {
        return next(
            Error(500, 'Error deleting documents')
        )
    }
}

exports.delete = async (req, res, next) => {
    try {
        const result = await Receipt.findByIdAndDelete(req.params.id);
        const child = await Children.findById(result.child);
        const classes = await Classes.findById(result.classes);

        child.receipt = child.receipt.filter(
            (value, index) => {
                return ![value].join("").includes(result._id);
            }
        )

        classes.receipt = classes.receipt.filter(
            (value, index) => {
                return ![value].join("").includes(result._id);
            }
        )

        await child.save();
        await classes.save();

        res.send(result);
    } catch (error) {
        return next(
            Error(500, 'Error deleting document')
        )
    }
}

exports.find = async (req, res, next) => {
    try {
        const document = await Receipt.findById(req.params.id).populate({
            path: 'child',
            populate: {
                path: 'parentDetails'
            }
        }).populate({
            path: 'classes',
            populate: {
                path: 'schoolYear',
            }
        });
        res.send(document);
    } catch (error) {
        return next(
            Error(500, 'Error finding document')
        )
    }
}

exports.update = async (req, res, next) => {
    try {
        const receipt = await Receipt.findById(req.params.id);
        receipt.status = true;
        receipt.datePerForm = req.body.makeDate;
        await receipt.save();

        res.send({
            error: false,
            message: receipt,
        })
    } catch (error) {
        
    }
}