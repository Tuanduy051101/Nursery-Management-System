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
    startDate: model.stringTrue,
    endDate: model.stringTrue,
    classes: model.arrayId('Classes'),
    collectionRates: model.arrayId('CollectionRates'),
    childcareCenter: model.objectId('ChildcareCenter'),
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
    health: { type: String, enum: ['không có', 'kém', 'tốt', 'bình thường'] },
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
    statusChild: model.stringTrue,
    parentDetails: model.arrayId('ParentDetails'),
    receipt: model.arrayId('Receipt'),
    classes: model.arrayId('Classes'),
    attendance: model.arrayId('Attendance'),
    account: model.objectId('Account'),
    mealTicket: model.arrayId('MealTicket'),
    historyStatus: model.arrayId('HistoryStatus'),
    childcareCenter: model.arrayId('ChildcareCenter'),
    schoolTransferHistory: model.arrayId('SchoolTransferHistory'),
    startSchooling: model.stringTrue,
    allergies: model.arrayId('Allergies'),
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
    childcareCenter: model.objectId('ChildcareCenter'),
    historyStatus: model.arrayId('HistoryStatus'),
});

const HistoryStatus = model.newModel('HistoryStatus', {
    status: model.stringTrue,
    date: model.stringTrue,
    child: model.objectId('Children'),
    classes: model.objectId('Classes'),
})

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
    childcareCenter: model.arrayId('ChildcareCenter'),
    workTransferHistory: model.arrayId('WorkTransferHistory'),
    startWorking: model.stringTrue,
});

const WorkTransferHistory = model.newModel('WorkTransferHistory', {
    date: model.stringTrue,
    teacher: model.objectId('Teacher'),
    childcareCenter: model.objectId('ChildcareCenter'),
})

const SchoolTransferHistory = model.newModel('SchoolTransferHistory', {
    date: model.stringTrue,
    child: model.objectId('Children'),
    childcareCenter: model.objectId('ChildcareCenter'),
})

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
    password: {
        type: String,
    },
    role: { type: String, enum: ['quản trị hệ thống', 'ban giám hiệu', 'phụ huynh', 'giáo viên quản lý trẻ', 'kế toán', 'nhân viên bếp'], required: true },
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
    evaluate: model.stringTrue,
    remark: model.stringTrue,
})

// ! 21
const Meal = model.newModel('Meal', {
    dish: model.arrayId('Dish'),
    date: model.stringTrue,
    session: model.objectId('Session'),
    mealTicket: model.arrayId('MealTicket'),
    note: model.stringTrue,
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
    childcareCenter: model.objectId('ChildcareCenter'),
})

// ! 23
const Ingredient = model.newModel('Ingredient', {
    foodstuff: model.objectId('Foodstuff'),
    amount: model.stringTrue,
    note: model.stringTrue,
    making: model.stringTrue,
    dish: model.objectId('Dish'),
});

// ! 24
const Foodstuff = model.newModel('Foodstuff', {
    name: model.stringTrue,
    function: model.stringTrue,
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
    meal: model.objectId('Meal'),
    child: model.objectId('Children'),
    classes: model.objectId('Classes'),
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
    meal: model.arrayId('Meal'),
    childcareCenter: model.arrayId('ChildcareCenter'),
});

// CollectionRates.add({
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now }
// })
// CollectionRates.pre('save', function (next) {
//     this.updatedAt = Date.now();
//     next();
// });

const Notification = model.newModel('Notification', {
    title: model.stringTrue,
    content: model.stringTrue,
    dateSent: model.stringTrue,
    recipient: model.stringTrue,
    typeRecipient: model.stringTrue,
    sender: model.stringTrue,
    status: model.stringTrue,
})

const ChildcareCenter = model.newModel('ChildcareCenter', {
    name: model.stringTrue,
    address: model.stringTrue,
    phone: model.stringTrue,
    email: model.stringTrue,
    director: model.stringTrue,
    isHeadquarters: { type: String, enum: ['trụ sở chính', 'chi nhánh'], required: true },
    children: model.arrayId('Children'),
    teacher: model.arrayId('teacher'),
})

const Allergies = model.newModel('Allergies', {
    severity: model.stringTrue,
    reactionType: model.stringTrue,
    treatment: model.stringTrue,
    note: model.stringTrue,
    child: model.objectId('Children'),
    allergen: model.objectId('Allergen'),
})

const Allergen = model.newModel('Allergen', {
    name: model.stringTrue,
    description: model.stringTrue,
    allergies: model.arrayId('Allergies')
})


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
    HistoryStatus,
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
    Notification,
    ChildcareCenter,
    SchoolTransferHistory,
    WorkTransferHistory,
    Allergies,
    Allergen
}




