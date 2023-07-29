const { models } = require('mongoose');
const model = require('./common/index');

// ? 1 
const CollectionRates = model.newModel('CollectionRates', {
    money: model.stringTrue,
    tuitionFees: model.objectId('TuitionFees'),
    grade: model.objectId('Grade'),
    schoolYear: model.objectId('SchoolYear'),
});

// ? 2
const SchoolYear = model.newModel('SchoolYear', {
    name: model.stringTrue,
    classes: model.arrayId('Classes'),
    collectionRates: model.arrayId('CollectionRates'),
});

// ? 3
const Grade = model.newModel('Grade', {
    name: model.stringTrue,
    description: model.stringTrue,
    classes: model.arrayId('Classes'),
    collectionRates: model.arrayId('CollectionRates'),
    meal: model.arrayId('Meal'),
});

//  ? 4
const TuitionFees = model.newModel('TuitionFees', {
    name: model.stringTrue,
    collectionRates: model.arrayId('CollectionRates'),
});

// ? 5
const Month = model.newModel('Month', {
    name: model.stringTrue,
    cDI: model.arrayId('CDI'),
});

// ! 6
const CDI = model.newModel('CDI', {
    height: model.stringTrue,
    weight: model.stringTrue,
    health: model.stringTrue,
    roses: model.stringTrue,
    note: model.stringTrue,
    child: model.objectId('Children'),
    month: model.objectId('Month'),
    classes: model.objectId('Classes')
});

// ? 7
const Parents = model.newModel('Parents', {
    parentDetails: model.arrayId('ParentDetails'),
});

// ? 8
const ParentDetails = model.newModel('ParentDetails', {
    name: model.stringTrue,
    gender: model.stringTrue,
    phone: model.stringTrue,
    email: model.stringTrue,
    address: model.stringTrue,
    relationship: model.stringTrue,
    parents: model.objectId('Parents'),
    child: model.objectId('Children'),
});

// ? 9
const Children = model.newModel('Children', {
    name: model.stringTrue,
    gender: model.stringTrue,
    birthday: model.stringTrue,
    address: model.stringTrue,
    cDI: model.arrayId('CDI'),
    parentDetails: model.arrayId('ParentDetails'),
    receipt: model.arrayId('Receipt'),
    classes: model.arrayId('Classes'),
    attendance: model.arrayId('Attendance'),
    account: model.objectId('Account'),
    mealTicket: model.arrayId('MealTicket'),
});

// ? 10
const Classes = model.newModel('Classes', {
    name: model.stringTrue,
    grade: model.objectId('Grade'),
    schoolYear: model.objectId('SchoolYear'),
    receipt: model.arrayId('Receipt'),
    children: model.arrayId('Children'),
    assignment: model.arrayId('Assignment'),
    cdi: model.arrayId('CDI'),
    mealTicket: model.arrayId('MealTicket'),
    attendance: model.arrayId('Attendance'),
});

// ! 11
const Receipt = model.newModel('Receipt', {
    dateStart: model.stringTrue,
    dateEnd: model.stringTrue,
    datePerForm: model.stringFalse,
    total: model.stringTrue,
    status: model.stringTrue,
    child: model.objectId('Children'),
    classes: model.objectId('Classes'),
});

// ? 12
const Position = model.newModel('Position', {
    name: model.stringTrue,
    teacher: model.arrayId('Teacher'),
});

// ? 13
const Diploma = model.newModel('Diploma', {
    name: model.stringTrue,
    teacher: model.arrayId('Teacher'),
});

// ? 14
const Teacher = model.newModel('Teacher', {
    name: model.stringTrue,
    gender: model.stringTrue,
    phone: model.stringTrue,
    email: model.stringTrue,
    address: model.stringTrue,
    position: model.objectId('Position'),
    diploma: model.arrayId('Diploma'),
    assignment: model.arrayId('Assignment'),
    account: model.objectId('Account'),
    payment: model.arrayId('Payment'),
});

// ? 15
const Duty = model.newModel('Duty', {
    name: model.stringTrue,
    description: model.stringTrue,
    assignment: model.arrayId('Assignment'),
});

// ? 16
const Assignment = model.newModel('Assignment', {
    note: model.stringFalse,
    teacher: model.objectId('Teacher'),
    duty: model.objectId('Duty'),
    classes: model.objectId('Classes'),
});

// ! 17
// const FeedBack = model.newModel('FeedBack', {
//     message: model.stringTrue,
//     teacher: model.objectId('Teacher'),
//     child: model.objectId('Children'),
// });

// ! 18
const Account = model.newModel('Account', {
    name: model.stringTrue,
    password: model.stringTrue,
    role: { type: String, enum: ['child', 'teacher'], required: true },
});

// ! 19
// const Role = model.newModel('Role', {
//     name: model.stringTrue,
//     account: model.arrayId('Account'),
// });

// ! 20
const MealTicket = model.newModel('MealTicket', {
    note: model.stringTrue,
    classes: model.objectId('Classes'),
    child: model.objectId('Children'),
    meal: model.objectId('Meal'),
    evaluate: model.objectId('Evaluate'),
})

// ! 21
const Meal = model.newModel('Meal', {
    dish: model.arrayId('Dish'),
    date: model.stringTrue,
    timeStart: model.stringTrue,
    timeEnd: model.stringTrue,
    mealTicket: model.arrayId('MealTicket'),
    grade: model.arrayId('Grade'),
})

// ! 22
const Dish = model.newModel('Dish', {
    name: model.stringTrue,
    ingredient: model.arrayId('Ingredient'),
    meal: model.arrayId('Meal'),
    function: model.stringTrue,
    note: model.stringTrue,
    cooking: model.stringTrue,
})

// ! 23
const Ingredient = model.newModel('Ingredient', {
    foodstuff: model.objectId('Foodstuff'),
    amount: model.stringTrue,
    dish: model.objectId('Dish'),
});

// ! 24
const Foodstuff = model.newModel('Foodstuff', {
    name: model.stringTrue,
    function: model.stringTrue,
    note: model.stringTrue,
    making: model.stringTrue,
    ingredient: model.arrayId('Ingredient'),
});

// !25
// const NutritionalIngredient = model.newModel('NutritionalIngredient', {
//     nutritional: model.objectId('Nutritional'),
//     foodstuff: model.objectId('Foodstuff'),
// });

// !26
// const Nutritional = model.newModel('Nutritional', {
//     name: model.stringTrue,
//     function: model.stringTrue,
//     nutritionalIngredient: model.arrayId('NutritionalIngredient'),
// })

// !27
const Payment = model.newModel('Payment', {
    name: model.stringTrue,
    total: model.stringTrue,
    datePerform: model.stringTrue,
    paymentDetail: model.arrayId('PaymentDetail'),
    teacher: model.objectId('Teacher'),
    note: model.stringTrue
});

// !28
const PaymentDetail = model.newModel('PaymentDetail', {
    amount: model.stringTrue,
    cost: model.stringTrue,
    item: model.stringTrue,
    payment: model.objectId('Payment'),
    note: model.stringTrue
})

// !29
const Evaluate = model.newModel('Evaluate', {
    status: model.stringTrue,
    content: model.stringTrue,
    mealTicket: model.objectId('MealTicket'),
})

// !30
const Attendance = model.newModel('Attendance', {
    present: model.stringTrue,
    reason: model.stringTrue,
    date: model.stringTrue,
    child: model.objectId('Children'),
    classes: model.objectId('Classes'),
    session: model.objectId('Session'),
});

const Session = model.newModel('Session', {
    name: model.stringTrue,
    startTime: model.stringTrue,
    endTime: model.stringTrue,
    attendance: model.arrayId('Attendance'),
});

module.exports = {
    CollectionRates,
    SchoolYear,
    Grade,
    TuitionFees,
    Month,
    CDI,
    Parents,
    ParentDetails,
    Children,
    Classes,
    Receipt,
    Position,
    Diploma,
    Teacher,
    Duty,
    Assignment,
    // FeedBack,
    Account,
    MealTicket,
    Meal,
    Dish,
    Ingredient,
    Foodstuff,
    // NutritionalIngredient,
    // Nutritional,
    Payment,
    PaymentDetail,
    Evaluate,
    Attendance,
    Session,
}




