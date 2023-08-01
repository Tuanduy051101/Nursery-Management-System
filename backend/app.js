const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// advanced
const connect_flash = require('connect-flash');
const passport = require('passport');
const passport_local = require('passport-local');
const dotenv = require('dotenv');
const express_validator = require('express-validator');
const session = require('express-session');
const bcrypt = require('bcrypt');

// d/n router
const schoolYearRouter = require('./app/routes/schoolYear.route');
const gradeRouter = require('./app/routes/grade.route');
const tuitionFeesRouter = require('./app/routes/tuitionFees.route');
const monthRouter = require('./app/routes/month.route');
const positionRouter = require('./app/routes/position.route');
const diplomaRouter = require('./app/routes/diploma.route');
const dutyRouter = require('./app/routes/duty.route');
const assignmentRouter = require('./app/routes/assignment.route');
const collectionRatesRouter = require('./app/routes/collectionRates.route');
const classesRouter = require('./app/routes/classes.route');
const teacherRouter = require('./app/routes/teacher.route');
const childrenRouter = require('./app/routes/children.route');
const parentsRouter = require('./app/routes/parents.route');
const parentDetailsRouter = require('./app/routes/parentDetails.route');
const cDIRouter = require('./app/routes/cdi.route');
const receiptRouter = require('./app/routes/receipt.route');
const mealTicketRouter = require('./app/routes/mealTicket.route');
const mealRouter = require('./app/routes/meal.route');
const dishRouter = require('./app/routes/dish.route');
const ingredientRouter = require('./app/routes/ingredient.route');
const foodstuffRouter = require('./app/routes/foodstuff.route');
const nutritionalIngredientRouter = require('./app/routes/nutritionalIngredient.route');
const nutritionalRouter = require('./app/routes/nutritional.route');
const attendanceRouter = require('./app/routes/attendance.route');
// const paymentRouter = require('./app/routes/payment.route');
// const paymentDetailRouter = require('./app/routes/paymentDetail.route');
// const evaluateRouter = require('./app/routes/evaluate.route');
const evaluateRouter = require('./app/routes/evaluate.route');
const accountRouter = require('./app/routes/account.route');
const mailRouter = require('./app/routes/mail.route');


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// use router
app.use('/api/schoolYear', schoolYearRouter);
app.use('/api/grade', gradeRouter);
app.use('/api/tuitionFees', tuitionFeesRouter);
app.use('/api/month', monthRouter);
app.use('/api/position', positionRouter);
app.use('/api/diploma', diplomaRouter);
app.use('/api/duty', dutyRouter);
app.use('/api/assignment', assignmentRouter);
app.use('/api/collectionRates', collectionRatesRouter);
app.use('/api/classes', classesRouter);
app.use('/api/teacher', teacherRouter);
app.use('/api/children', childrenRouter);
app.use('/api/parents', parentsRouter);
app.use('/api/parentDetails', parentDetailsRouter);
app.use('/api/cdi', cDIRouter);
app.use('/api/receipt', receiptRouter);
app.use('/api/mealTicket', mealTicketRouter);
app.use('/api/meal', mealRouter);
app.use('/api/dish', dishRouter);
app.use('/api/ingredient', ingredientRouter);
app.use('/api/foodstuff', foodstuffRouter);
app.use('/api/nutritionalIngredient', nutritionalIngredientRouter);
app.use('/api/nutritional', nutritionalRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/evaluate', evaluateRouter);
app.use('/api/account', accountRouter);
app.use('/api/mail', mailRouter);
// app.use('/api/payment', paymentRouter);
// app.use('/api/paymentDetail', paymentDetailRouter);

// simple route
app.get('/', (req, res, next) => {
    res.json({
        message: 'Welcome to here with us'
    })
});

// check error
app.use((req, res, next) => {
    return next(
        createError(404, "Resource not found")
    );
});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

module.exports = app;

