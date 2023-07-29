const { Attendance, Children, Classes, Session } = require("../models/model");
const Error = require("http-errors");

exports.create = async (req, res, next) => {
  try {
    const { present, reason = 'không có', date, session, child, classes } = req.body;

    if (!present || !date || !session || !child || !classes) {
      return res.send({
        error: true,
        message: 'Missing required fields.'
      });
    }

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

    return res.send({
      error: false,
      message: [document],
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
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, { present, reason }, { new: true });
    return res.send(attendance);
  } catch (error) {
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

