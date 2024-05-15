const { Receipt, Classes, Children, CollectionRates } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        const {
            schoolYear,
            dateStart,
            dateEnd,
            datePerForm = 'chưa thanh toán',
            status = 'false',
        } = req.body;

        if (!schoolYear || !dateStart || !dateEnd) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            });
        }

        const classes = await Classes.find({ schoolYear: schoolYear }).populate('children');
        for (let item of classes) {
            const collectionRates = await CollectionRates.find({
                grade: item.grade,
                schoolYear: item.schoolYear,
            });
            const total = collectionRates.reduce((acc, r) => acc + parseInt(r.money), 0).toString();
            for (let item1 of item.children) {
                const check = await Receipt.exists({
                    child: item1._id,
                    classes: item._id,
                });
                if (!check) {
                    const document = await Receipt.create({
                        child: item1._id,
                        classes: item._id,
                        dateStart,
                        dateEnd,
                        datePerForm,
                        total,
                        status
                    });

                    await Promise.all([
                        Children.findByIdAndUpdate(item1._id, { $push: { receipt: document._id } }),
                        Classes.findByIdAndUpdate(item._id, { $push: { receipt: document._id } })
                    ]);
                }
            }
        }

        return res.send({
            error: false,
            message: 'Đã tạo thành công.'
        });
    } catch (error) {
        return next(Error(500, 'Error saving'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Receipt.find().populate("child").populate({
            path: "classes",
            populate: {
                path: "grade schoolYear"
            }
        });
        res.send(documents);
    } catch (error) {
        return next(Error(500, 'Error finding documents'));
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const documents = await Receipt.deleteMany();
        res.send(documents);
    } catch (error) {
        return next(Error(500, 'Error deleting documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await Receipt.findByIdAndDelete(req.params.id);
        await Promise.all([
            Children.findByIdAndUpdate(result.child, { $pull: { receipt: result._id } }),
            Classes.findByIdAndUpdate(result.classes, { $pull: { receipt: result._id } })
        ]);

        res.send({
            error: false,
            message: 'Đã xoá thành công.'
        });
    } catch (error) {
        return next(Error(500, 'Error deleting document'));
    }
};

exports.find = async (req, res, next) => {
    try {
        const document = await Receipt.findById(req.params.id)
            .populate({ path: 'child', populate: { path: 'parentDetails' } })
            .populate({ path: 'classes', populate: { path: 'schoolYear' } });

        if (!document) {
            return next(Error(404, 'Document not found'));
        }

        res.send(document);
    } catch (error) {
        return next(Error(500, 'Error finding document'));
    }
};

exports.update = async (req, res, next) => {
    try {
        let { status } = req.body;

        console.log(status);

        const currentDate = new Date();

        // Định dạng chuỗi ngày tháng theo format YYYY-MM-DD
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;

        let datePerForm = formattedDate;
        if (status == 'false' || status == false) {
            datePerForm = 'chưa thanh toán'
        }

        const receipt = await Receipt.findByIdAndUpdate(req.params.id, {
            status,
            datePerForm
        });

        if (!receipt) {
            return next(Error(404, 'Receipt not found'));
        }

        res.send({
            error: false,
            message: 'Đã cập nhật thông tin thành công.'
        });
    } catch (error) {
        // Handle error
        return next(Error(500, 'Error updating document'));
    }
};
