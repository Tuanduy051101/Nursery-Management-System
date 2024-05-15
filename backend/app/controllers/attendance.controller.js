const { Attendance, Children, Classes, Session, MealTicket, Meal, Evaluate } = require("../models/model");
const Error = require("http-errors");

exports.create = async (req, res, next) => {
  console.log(req.body);
  try {
    const { present = 'true', reason = 'không có', date, session, children, classes } = req.body;

    if (!date || !session || !children || !classes) {
      return res.send({
        error: true,
        message: 'Thiếu những trường bắt buộc.'
      });
    }

    for (let child of children) {
      const document = await Attendance.create({
        present,
        reason,
        date,
        child,
        classes,
        session,
      });
      const updatePromises = [
        Children.findByIdAndUpdate(child, { $push: { attendance: document._id } }, { new: true }),
        Session.findByIdAndUpdate(session, { $push: { attendance: document._id } }, { new: true }),
        Classes.findByIdAndUpdate(classes, { $push: { attendance: document._id } }, { new: true })
      ];

      await Promise.all(updatePromises);
    }

    return res.send({
      error: false,
      message: 'Đã tạo thành công.',
    });
  } catch (error) {
    return next(Error(500, "Error saving"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const documents = await Attendance.find()
      .populate('session')
      .populate({
        path: 'classes',
        populate: {
          path: 'grade schoolYear'
        }
      })
      .populate({
        path: 'child',
        populate: {
          path: 'parentDetails',
        }
      });
    return res.send(documents);
  } catch (error) {
    return next(Error(500, "Error finding documents"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const result = await Attendance.findByIdAndDelete(req.params.id);

    const updatePromises = [
      Children.findByIdAndUpdate(result.child, { $pull: { attendance: result._id } }, { new: true }),
      Session.findByIdAndUpdate(result.session, { $pull: { attendance: result._id } }, { new: true }),
      Classes.findByIdAndUpdate(result.classes, { $pull: { attendance: result._id } }, { new: true })
    ];

    await Promise.all(updatePromises);
    return res.send(result);
  } catch (error) {
    return next(Error(500, "Error deleting document"));
  }
};

exports.find = async (req, res, next) => {
  try {
    const document = await Attendance.findById(req.params.id)
      .populate('session')
      .populate({
        path: 'classes',
        populate: {
          path: 'grade schoolYear'
        }
      })
      .populate({
        path: 'child',
        populate: {
          path: 'parentDetails',
        }
      });
    return res.send(document);
  } catch (error) {
    return next(Error(500, "Error finding document"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const { present, reason } = req.body;
    console.log(req.body);
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, { present, reason }, { new: true });

    let meals = await Meal.find({ session: attendance.session, date: attendance.date }).populate([
      {
        path: 'dish',
        populate: {
          path: 'ingredient',
          populate: {
            path: 'foodstuff'
          }
        }
      }
    ]);
    // console.log(meals[0].dish);

    if (meals.length != 0) {
      meals = meals.map(meal => meal._id);
    }

    const check_mealTicket = await MealTicket.exists({
      classes: attendance.classes,
      child: attendance.child,
      meal: { $in: meals },
    });

    if (!check_mealTicket && meals.length != 0 && (present == true || present == 'true')) {

      const childInfo = await Children.findById(attendance.child);

      const mealTicket = await MealTicket.create({
        note: 'không có',
        classes: attendance.classes,
        child: attendance.child,
        meal: meals[0],
        evaluate: 'yêu thích',
        remark: 'không có'
      });

      await Classes.findByIdAndUpdate(attendance.classes, { $push: { mealTicket: mealTicket._id } });
      await Children.findByIdAndUpdate(attendance.child, { $push: { mealTicket: mealTicket._id } });
      await Meal.findByIdAndUpdate(meals[0], { $push: { mealTicket: mealTicket._id } });
    }

    return res.send({
      error: false,
      message: 'Đã lưu thành công.'
    });
  } catch (error) {
    console.log(error);
    return next(Error(500, "Error updating document"));
  }
};

exports.checkUpdate = async (req, res, next) => {
  try {
    const { classes, child, date, session } = req.body;
    const check = await Attendance.exists({
      classes: { $in: classes },
      child: { $in: child },
      date: { $in: date },
      session: { $in: session }
    });

    return res.send({
      found: check,
      message: check ? await Attendance.findOne({ classes: { $in: classes }, child: { $in: child }, date: { $in: date }, session: { $in: session } }) : null,
    });
  } catch (error) {
    return next(Error(500, "Error checking update"));
  }
};

