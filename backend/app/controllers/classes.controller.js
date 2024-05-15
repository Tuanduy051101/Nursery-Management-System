const { Classes, SchoolYear, Grade, Children, HistoryStatus } = require('../models/model');
const Error = require('http-errors');

const calculateAgeInMonths = (birthDate, currentDate) => {
    // Convert birthDate and currentDate to Date objects
    var birthDateObj = new Date(birthDate);
    var currentDateObj = new Date(currentDate);

    // Calculate the number of years old
    var yearsOld = currentDateObj.getFullYear() - birthDateObj.getFullYear();

    // Calculate the remaining months
    var remainingMonths = currentDateObj.getMonth() - birthDateObj.getMonth();

    // Calculate the total number of months
    var totalMonths = yearsOld * 12 + remainingMonths;

    return totalMonths;
}

exports.create = async (req, res, next) => {
    try {
        const { name, grade, schoolYear } = req.body;

        if (!name || !grade || !schoolYear) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }

        const check = await Classes.exists({
            $and: [
                { name: name },
                { grade: grade },
                { schoolYear: schoolYear }
            ]
        });
        if (check) {
            return res.send({ error: true, message: 'Lớp đã tồn tại.' });
        } else {
            const document = await new Classes({
                name,
                grade,
                schoolYear,
            }).save();

            const [dGrade, dSchoolYear] = await Promise.all([
                Grade.findByIdAndUpdate(grade, { $push: { classes: document._id } }, { new: true }),
                SchoolYear.findByIdAndUpdate(schoolYear, { $push: { classes: document._id } }, { new: true })
            ]);

            return res.send({ error: false, message: 'Đã tạo thành công.' });
        }
    } catch (error) {
        return next(Error(500, 'Error saving'));
    }
};

exports.createAuto = async (req, res, next) => {
    try {
        let { grade, schoolYear, amountClasses } = req.body;
        console.log(req.body);
        if (!grade || !schoolYear || !amountClasses) {
            return res.send({
                error: true,
                message: 'Thiếu những trường bắt buộc.'
            })
        }
        // temporary variables
        let j = 1, h = amountClasses;
        let grade_name = (await Grade.findById(grade)).name;
        let schoolYear_name = (await SchoolYear.findById(schoolYear)).name;
        let result = [];
        do {
            let name = `NT${grade_name.split(' ')[2]}t${schoolYear_name.split('-')[0].split('').slice(2).join('')}`;
            if (j < 10) name += `0${j}`;
            else name += j + 1;
            const check = await Classes.exists({
                $and: [
                    { name: name },
                    { grade: grade },
                    { schoolYear: schoolYear }
                ]
            });
            if (check) {
                j++;
            } else {
                const document = await Classes.create({
                    name,
                    grade,
                    schoolYear,
                });
                result.push(document);
                const [dGrade, dSchoolYear] = await Promise.all([
                    Grade.findByIdAndUpdate(grade, { $push: { classes: document._id } }, { new: true }),
                    SchoolYear.findByIdAndUpdate(schoolYear, { $push: { classes: document._id } }, { new: true })
                ]);
                h--;
            }
        } while (h > 0)

        return res.send({ error: false, message: `Đã tạo thành công ${amountClasses} lớp.`, result: result });

    } catch (error) {
        console.log(error);
        return next(Error(500, 'Error saving'));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Classes.find().populate([
            "schoolYear",
            "grade",
            "children",
            {
                path: 'assignment',
                populate: {
                    path: 'teacher',
                }
            },
            {
                path: 'cdi',
                populate: {
                    path: 'month child'
                }
            },
            {
                path: 'attendance',
                populate: {
                    path: 'session',
                }
            },
            {
                path: 'mealTicket',
                populate: {
                    path: 'meal',
                    populate: {
                        path: 'session',
                    }
                }
            }
        ]);
        res.send(documents);
    } catch (error) {
        return next(Error(500, 'Error finding documents'));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await Classes.findByIdAndDelete(req.params.id);

        result.children.forEach(async child => {
            await Children.findByIdAndUpdate(child, { $pull: { classes: result._id } });
        });

        const [dGrade, dSchoolYear] = await Promise.all([
            Grade.findByIdAndUpdate(result.grade, { $pull: { classes: result._id } }, { new: true }),
            SchoolYear.findByIdAndUpdate(result.schoolYear, { $pull: { classes: result._id } }, { new: true }),
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
        const document = await Classes.findById(req.params.id).populate([
            {
                path: 'schoolYear',
                populate: {
                    path: 'childcareCenter',
                }
            },
            'grade',
            {
                path: 'assignment',
                populate: {
                    path: 'duty teacher',
                }
            },
            {
                path: 'cdi',
                populate: [
                    {
                        path: 'month'
                    },
                    {
                        path: 'child',
                        populate: {
                            path: 'parentDetails'
                        }
                    }
                ]
            },
            {
                path: 'children',
                populate: {
                    path: 'parentDetails',
                }
            },
            {
                path: 'receipt',
                populate: {
                    path: 'child classes'
                }
            },
            {
                path: 'mealTicket',
                populate: [
                    {
                        path: 'meal', populate: {
                            path: 'dish session'
                        }
                    },
                    { path: 'child' }
                ]
            },
            {
                path: 'attendance',
                populate: {
                    path: 'child session',
                }
            }
        ]);
        res.send([document]);
    } catch (error) {
        console.log(error);
        return next(Error(500, 'Error finding document'));
    }
};

exports.update = async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return res.send({
            error: true,
            message: 'Thiếu những trường bắt buộc.'
        });
    }
    const classes = await Classes.findById(req.params.id);
    const check = await Classes.exists({
        $and: [
            { name: name },
            { grade: classes.grade },
            { schoolYear: classes.schoolYear }
        ]
    });
    if (check) {
        return res.send({
            error: true,
            message: 'Lớp đã tồn tại.'
        });
    }
    try {
        const document = await Classes.findByIdAndUpdate(req.params.id, { name }, { new: true });
        return res.send({
            error: false,
            message: 'Đã cập nhật thông tin thành công.'
        });
    } catch (error) {
        return next(Error(500, 'Error updating document'));
    }
};


exports.addChild_one = async (req, res, next) => {
    const { child } = req.body;
    const classes = req.params.id;
    if (!classes || !child) {
        return res.send({
            error: true,
            message: 'Thiếu những trường bắt buộc.'
        })
    }
    const check = await Classes.exists({
        $and: [
            { _id: classes }, { children: { $in: [child] } }
        ]
    });
    if (check) {
        return res.send({
            error: true,
            message: 'Already exists.'
        })
    }
    try {
        const classes_D = await Classes.findByIdAndUpdate(classes, { $push: { children: child } }, { new: true });
        const children_D = await Children.findByIdAndUpdate(child, { $push: { classes } }, { new: true });
        return res.send({
            error: false,
            message: classes_D,
        })
    } catch (error) {
        return next(Error(500, 'Error add child document'));
    }
}

const formatDateReverse = (value = new Date()) => {
    const date = new Date(value);
    let day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    return `${year}-${month}-${day}`;
}

exports.addChild_many = async (req, res, next) => {
    const { children } = req.body;
    const classes = req.params.id;
    if (!classes || !children) {
        return res.send({
            error: true,
            message: 'Thiếu những trường bắt buộc.'
        })
    }
    const check_checked = children.some(value => value.checked);
    if (!check_checked) {
        return res.send({
            error: true,
            message: 'Vui lòng chọn trẻ cần thêm vào lớp.'
        })
    }
    let count = 0;
    for (let child of children) {
        const check = await Classes.exists({
            $and: [
                { _id: classes }, { children: { $in: [child._id] } }
            ]
        });
        if (child.checked && !check) {
            try {
                const classes_D = await Classes.findByIdAndUpdate(classes, { $push: { children: child._id } }, { new: true });
                const children_D = await Children.findByIdAndUpdate(child._id, { $push: { classes } }, { new: true });
                count++;
                const historyStatus = await HistoryStatus.create({
                    status: 'đang học',
                    date: formatDateReverse(),
                    child: child._id,
                    classes: classes,
                });
                await Children.findByIdAndUpdate(child._id, { $push: { historyStatus: historyStatus._id.toString() }, statusChild: historyStatus.status });
                await Classes.findByIdAndUpdate(classes, { $push: { historyStatus: historyStatus._id.toString() } });
            } catch (error) {
                return next(Error(500, 'Error add child document'));
            }
        }
    }

    return res.send({
        error: false,
        message: `Đã thêm thành công ${count} trẻ vào lớp.`,
    })

}

exports.children_noneClass = async (req, res, next) => {
    let { grade, schoolYear } = await Classes.findById(req.params.id);
    const gradeInfo = await Grade.findById(grade);
    const schoolYearInfo = await SchoolYear.findById(schoolYear);
    const childcareCenter = (await SchoolYear.findById(schoolYear)).childcareCenter.toString();
    grade = grade.toString();
    schoolYear = schoolYear.toString();

    let ageList = [];
    if (gradeInfo.name.split(' ')[2] == '3-12') {
        ageList = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    } else if (gradeInfo.name.split(' ')[2] == '13-24') {
        ageList = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    } else if (gradeInfo.name.split(' ')[2] == '25-36') {
        ageList = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
    }

    try {
        let classes = await Classes.find({ schoolYear });
        classes = classes.map(value => value._id.toString())
        let children = await Children.find({ childcareCenter }).populate('parentDetails');
        children = children.filter(i => i.childcareCenter[i.childcareCenter.length - 1] == childcareCenter);
        children = children.filter(value => !value.classes.some(value1 => classes.includes(value1.toString())));
        children = children.filter(i => ageList.some(j => j == calculateAgeInMonths(i.birthday, schoolYearInfo.startDate)));
        return res.send(children);
    } catch (error) {
        return next(Error(500, 'Error find child document'));
    }
}

exports.addChild_auto = async (req, res, next) => {
    let { amountChildren } = req.body;
    const classesId = req.params.id;
    let { grade, schoolYear } = await Classes.findById(classesId);
    const childcareCenter = (await SchoolYear.findById(schoolYear)).childcareCenter.toString();
    const gradeInfo = await Grade.findById(grade);
    const schoolYearInfo = await SchoolYear.findById(schoolYear);
    let ageList = [];
    if (gradeInfo.name.split(' ')[2] == '3-12') {
        ageList = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    } else if (gradeInfo.name.split(' ')[2] == '13-24') {
        ageList = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    } else if (gradeInfo.name.split(' ')[2] == '25-36') {
        ageList = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
    }
    grade = grade.toString();
    schoolYear = schoolYear.toString();
    if (!amountChildren || !grade || !schoolYear) {
        return res.send({
            error: true,
            message: 'Thiếu những trường bắt buộc.'
        })
    }
    try {
        let classes = await Classes.find({ schoolYear });
        classes = classes.map(value => value._id.toString())
        let count = 0;
        let children = await Children.find({ childcareCenter });
        children = children.filter(i => i.childcareCenter[i.childcareCenter.length - 1] == childcareCenter);
        children = children.filter(i => i.statusChild == 'nhập học' || i.statusChild == 'đang học');
        // console.log(children);
        children = children.filter(i => ageList.some(j => j == calculateAgeInMonths(i.birthday, schoolYearInfo.startDate)));
        console.log(children);
        children = children.filter(value => !value.classes.some(value1 => classes.includes(value1.toString())));
        // children = children.filter(value => age == (new Date().getFullYear() - new Date(value.birthday).getFullYear()).toString());
        for (let i = 0; i < parseInt(amountChildren); i++) {
            children = children.filter(value => !value.classes.some(value1 => classes.includes(value1.toString())));
            let child = children.shift();
            if (child) {
                const classes_D = await Classes.findByIdAndUpdate(classesId, { $push: { children: child._id } }, { new: true });
                const children_D = await Children.findByIdAndUpdate(child._id, { $push: { classes: classesId } }, { new: true });
                count++;
                const historyStatus = await HistoryStatus.create({
                    status: 'đang học',
                    date: formatDateReverse(),
                    child: child._id,
                    classes: classesId,
                });
                await Children.findByIdAndUpdate(child._id, { $push: { historyStatus: historyStatus._id.toString() }, statusChild: historyStatus.status });
                await Classes.findByIdAndUpdate(classesId, { $push: { historyStatus: historyStatus._id.toString() } });
            }
        }
        return res.send({
            error: false,
            message: `Đã thêm thành công ${count} trẻ vào lớp.`,
        })
    } catch (error) {
        console.log(error);
        return next(Error(500, 'Error find child document'));
    }
}

exports.removeChild_many = async (req, res, next) => {
    const { children } = req.body;
    const classes = req.params.id;
    if (!classes || !children) {
        return res.send({
            error: true,
            message: 'Thiếu những trường bắt buộc.'
        })
    }
    const check_checked = children.some(value => value.checked);
    if (!check_checked) {
        return res.send({
            error: true,
            message: 'Vui lòng chọn trẻ muốn xoá khỏi lớp.'
        })
    }
    let count = 0;
    for (let child of children) {
        const childInfo = await Children.findById(child._id);
        if (childInfo.attendance.length != 0 || childInfo.mealTicket.length != 0) {
            return res.send({
                error: true,
                message: `Vui lòng thực hiện chuyển lớp.`,
            })
        }
        const check = await Classes.exists({
            $and: [
                { _id: classes }, { children: { $in: [child._id] } }
            ]
        });
        if (child.checked && check) {
            try {
                const classes_D = await Classes.findByIdAndUpdate(classes, { $pull: { children: child._id } }, { new: true });
                const children_D = await Children.findByIdAndUpdate(child._id, { $pull: { classes } }, { new: true });
                count++;
                const classesInfo = await Classes.findById(classes).populate('historyStatus');
                const historyStatusInfo = classesInfo.historyStatus.filter(i => i.child.toString() == child._id)[0];
                console.log(historyStatusInfo);
                await Children.findByIdAndUpdate(child, { $pull: { historyStatus: historyStatusInfo._id.toString() } });
                await Classes.findByIdAndUpdate(classes, { $pull: { historyStatus: historyStatusInfo._id.toString() } });
                await HistoryStatus.findByIdAndDelete(historyStatusInfo._id.toString());

                const childrenInfo = await Children.findById(child._id).populate('historyStatus');

                if (childrenInfo.historyStatus.length > 0) {
                    await Children.findByIdAndUpdate(child._id, { statusChild: childrenInfo.historyStatus[childrenInfo.historyStatus.length - 1].status });
                } else {
                    await Children.findByIdAndUpdate(child._id, { statusChild: 'nhập học' });
                }
                console.log(historyStatusInfo);
            } catch (error) {
                console.log(error);
                return next(Error(500, 'Error add child document'));
            }
        }
    }

    return res.send({
        error: false,
        message: `Đã xoá thành công ${count} trẻ khỏi lớp.`,
    })
}

exports.removeChild = async (req, res, next) => {
    const { child } = req.body;
    const classes = req.params.id;
    if (!classes || !child) {
        return res.send({
            error: true,
            message: 'Missing required fields.'
        })
    }
    const childInfo = await Children.findById(child);
    if (childInfo.attendance.length != 0 || childInfo.mealTicket.length != 0) {
        return res.send({
            error: true,
            message: `Vui lòng thực hiện chuyển lớp.`,
        })
    }
    try {
        const classes_D = await Classes.findByIdAndUpdate(classes, { $pull: { children: child } }, { new: true });
        const children_D = await Children.findByIdAndUpdate(child, { $pull: { classes } }, { new: true });
        const classesInfo = await Classes.findById(classes).populate('historyStatus');
        const historyStatusInfo = classesInfo.historyStatus.filter(i => i.child.toString() == child)[0];
        await Children.findByIdAndUpdate(child, { $pull: { historyStatus: historyStatusInfo._id.toString() } });
        await Classes.findByIdAndUpdate(classes, { $pull: { historyStatus: historyStatusInfo._id.toString() } });
        await HistoryStatus.findByIdAndDelete(historyStatusInfo._id.toString());

        const childrenInfo = await Children.findById(child).populate('historyStatus');

        if (childrenInfo.historyStatus.length > 0) {
            await Children.findByIdAndUpdate(child, { statusChild: childrenInfo.historyStatus[childrenInfo.historyStatus.length - 1].status });
        } else {
            await Children.findByIdAndUpdate(child, { statusChild: 'nhập học' });
        }

        return res.send({
            error: false,
            message: 'Đã xoá trẻ khỏi lớp thành công.',
        })
    } catch (error) {
        console.log(error);
        return next(Error(500, 'Error add child document'));
    }
}

