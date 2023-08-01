// services
const servicesPath = "../../services";

import Account from `${servicesPath}/account.service`;
import Assignment from `${servicesPath}/assignment.service`;
import Attendance from `${servicesPath}/attendance.service`;
import CDI from `${servicesPath}/cdi.service`;
import Children from `${servicesPath}/children.service`;
import Classes from `${servicesPath}/classes.service`;
import CollectionRates from `${servicesPath}/collectionRates.service`;
import Diploma from `${servicesPath}/diploma.service`;
import Dish from `${servicesPath}/dish.service`;
import Duty from `${servicesPath}/duty.service`;
import Evaluate from `${servicesPath}/evaluate.service`;
import Foodstuff from `${servicesPath}/foodstuff.service`;
import Grade from `${servicesPath}/grade.service`;
import Ingredient from `${servicesPath}/ingredient.service`;
import Login from `${servicesPath}/login.service`;
import Meal from `${servicesPath}/meal.service`;
import MealTicket from `${servicesPath}/mealTicket.service`;
import Month from `${servicesPath}/month.service`;
import Parents from `${servicesPath}/parents.service`;
import ParentDetails from `${servicesPath}/parentDetails.service`;
import Payment from `${servicesPath}/payment.service`;
import PaymentDetail from `${servicesPath}/paymentDetail.service`;
import Position from `${servicesPath}/position.service`;
import Receipt from `${servicesPath}/receipt.service`;
import SchoolYear from `${servicesPath}/sYear.service`;
import Teacher from `${servicesPath}/teacher.service`;
import TuitionFees from `${servicesPath}/tuitionFees.service`;

// vue composition
import { ref, reactive, watch, computed, onMounted, onUnmounted, watchEffect, provide, inject, onBeforeMount, } from 'vue';

// vue router
import { useRoute, useRouter } from 'vue-router';

// vee-validate
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { validate, resetForm, isSubmitting, handleSubmit } from 'vee-validate';

export {
    // service
    Account,
    Assignment,
    Attendance,
    CDI,
    Children,
    Classes,
    CollectionRates,
    Diploma,
    Dish,
    Duty,
    Evaluate,
    Foodstuff,
    Grade,
    Ingredient,
    Login,
    Meal,
    MealTicket,
    Month,
    Parents,
    ParentDetails,
    Payment,
    PaymentDetail,
    Position,
    Receipt,
    SchoolYear,
    Teacher,
    TuitionFees,
    // vue composition
    ref, reactive, watch, computed, onMounted, onUnmounted, watchEffect, provide, inject, onBeforeMount,
    // vue router
    useRoute, useRouter,
    // vee-validate
    Form, Field, ErrorMessage,
    validate, resetForm, isSubmitting, handleSubmit,
    yup,
    
}















