const { Classes, SchoolYear, Grade, Children } = require('../models/model');
const Error = require('http-errors');

exports.create = async (req, res, next) => {
    try {
        const { name, grade, schoolYear } = req.body;

        if (!name || !grade || !schoolYear) {
            return res.send({
                error: true,
                message: 'Missing required fields.'
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
            return res.send({ error: true, message: 'Already exists.' });
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

            return res.send({ error: false, message: [document] });
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
                message: 'Missing required fields.'
            })
        }

        // temporary variables
        let j = 1, h = amountClasses;
        let grade_name = (await Grade.findById(grade)).name;
        let schoolYear_name = (await SchoolYear.findById(schoolYear)).name;
        let result = [];
        do {
            let name = `K1${grade_name.split('')[0]}${schoolYear_name.split('-')[0].split('').slice(2).join('')}`;
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

        return res.send({ error: false, message: `Successfully created ${amountClasses} ${amountClasses == 1 ? 'class' : 'classes'}.`, result: result });

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
            message: 'Successfully deleted.'
        });
    } catch (error) {
        return next(Error(500, 'Error deleting document'));
    }
};

exports.find = async (req, res, next) => {
    try {
        const document = await Classes.findById(req.params.id).populate("grade").populate("schoolYear").populate({
            path: 'assignment',
            populate: {
                path: 'teacher',
                populate: {
                    path: 'position',
                }
            }
        }).populate({
            path: 'cdi',
            populate: {
                path: 'child',
            }
        }).populate({
            path: 'children',
            populate: {
                path: 'parentDetails',
            }
        }).populate('receipt').populate({
            path: 'mealTicket',
            populate: {
                path: 'meal',
                populate: {
                    path: 'dish',
                    populate: {
                        path: 'ingredient',
                    }
                }
            }
        }).populate({
            path: 'attendance',
            populate: {
                path: 'child',
            }
        });
        res.send([document]);
    } catch (error) {
        return next(Error(500, 'Error finding document'));
    }
};

exports.update = async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return res.send({
            error: true,
            message: 'Missing required fields.'
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
            message: 'Already exists.'
        });
    }
    try {
        const document = await Classes.findByIdAndUpdate(req.params.id, { name }, { new: true });
        return res.send({
            error: false,
            message: 'Successfully updated.'
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
            message: 'Missing required fields.'
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

exports.addChild_many = async (req, res, next) => {
    const { children } = req.body;
    const classes = req.params.id;
    if (!classes || !children) {
        return res.send({
            error: true,
            message: 'Missing required fields.'
        })
    }
    const check_checked = children.some(value => value.checked);
    if (!check_checked) {
        return res.send({
            error: true,
            message: 'Please select a child.'
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
            } catch (error) {
                return next(Error(500, 'Error add child document'));
            }
        }
    }

    return res.send({
        error: false,
        message: `Successfully added ${count} child to the class.`,
    })

}

exports.children_noneClass = async (req, res, next) => {
    let { grade, schoolYear } = await Classes.findById(req.params.id);
    grade = grade.toString();
    schoolYear = schoolYear.toString();
    try {
        let classes = await Classes.find({ schoolYear });
        classes = classes.map(value => value._id.toString())
        let children = await Children.find({}).populate('parentDetails');
        children = children.filter(value => !value.classes.some(value1 => classes.includes(value1.toString())));
        return res.send(children);
    } catch (error) {
        return next(Error(500, 'Error find child document'));
    }
}


exports.addChild_auto = async (req, res, next) => {
    let { amountChildren } = req.body;
    let ageList = req.body.age ? [req.body.age] : [];
    const classesId = req.params.id;
    let { grade, schoolYear } = await Classes.findById(classesId);
    const gradeInfo = await Grade.findById(grade);
    grade = grade.toString();
    schoolYear = schoolYear.toString();
    if (!ageList || ageList.length == 0) {
        if (gradeInfo.name == 'mầm') {
            ageList = [0, 1, 2];
        }
        else if (gradeInfo.name == 'chồi') {
            ageList = [3, 4];
        }
        else if (gradeInfo.name == 'lá') {
            ageList = [5, 6];
        }
    }
    if (!amountChildren || !ageList || !grade || !schoolYear) {
        return res.send({
            error: true,
            message: 'Missing reuired fields.'
        })
    }
    try {
        let classes = await Classes.find({ schoolYear });
        classes = classes.map(value => value._id.toString())
        let count = 0;
        for (let age of ageList) {
            let children = await Children.find({});
            children = children.filter(value => !value.classes.some(value1 => classes.includes(value1.toString())));
            children = children.filter(value => age == (new Date().getFullYear() - new Date(value.birthday).getFullYear()).toString());
            for (let i = 0; i < parseInt(amountChildren); i++) {
                children = children.filter(value => !value.classes.some(value1 => classes.includes(value1.toString())));
                let child = children.shift();
                if (child) {
                    const classes_D = await Classes.findByIdAndUpdate(classesId, { $push: { children: child._id } }, { new: true });
                    const children_D = await Children.findByIdAndUpdate(child._id, { $push: { classes: classesId } }, { new: true });
                    count++;
                }
            }
        }
        return res.send({
            error: false,
            message: `Successfully added ${count} child to the class.`,
        })
    } catch (error) {
        console.log(error);
        return next(Error(500, 'Error find child document'));
    }
}

exports.removeChild_many = async (req, res, next) => {
    const { children } = req.body;
    console.log(req.body);
    const classes = req.params.id;
    if (!classes || !children) {
        return res.send({
            error: true,
            message: 'Missing required fields.'
        })
    }
    const check_checked = children.some(value => value.checked);
    if (!check_checked) {
        return res.send({
            error: true,
            message: 'Please select a child.'
        })
    }
    let count = 0;
    for (let child of children) {
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
            } catch (error) {
                return next(Error(500, 'Error add child document'));
            }
        }
    }

    return res.send({
        error: false,
        message: `Successfully deleted ${count} child from the class.`,
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
    console.log(child, classes);
    try {
        const classes_D = await Classes.findByIdAndUpdate(classes, { $pull: { children: child } }, { new: true });
        const children_D = await Children.findByIdAndUpdate(child, { $pull: { classes } }, { new: true });
        return res.send({
            error: false,
            message: 'Successfully removed child from the class.',
        })
    } catch (error) {
        console.log(error);
        return next(Error(500, 'Error add child document'));
    }
}

