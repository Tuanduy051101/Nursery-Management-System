// services
const servicesPath = "../../services";

import Account from '../../services/account.service';
import Assignment from '../../services/assignment.service';
import Attendance from '../../services/attendance.service';
import CDI from '../../services/cdi.service';
import Children from '../../services/children.service';
import Classes from '../../services/classes.service';
import CollectionRates from '../../services/collectionRates.service';
import Diploma from '../../services/diploma.service';
import Dish from '../../services/dish.service';
import Duty from '../../services/duty.service';
import Evaluate from '../../services/evaluate.service';
import Foodstuff from '../../services/foodstuff.service';
import Grade from '../../services/grade.service';
import Ingredient from '../../services/ingredient.service';
// import Login from '../../services/login.service';
import Meal from '../../services/meal.service';
import MealTicket from '../../services/mealTicket.service';
import Month from '../../services/month.service';
import Parents from '../../services/parents.service';
import ParentDetails from '../../services/parentDetails.service';
import Payment from '../../services/payment.service';
import PaymentDetail from '../../services/paymentDetail.service';
import Position from '../../services/position.service';
import Receipt from '../../services/receipt.service';
import SchoolYear from '../../services/sYear.service';
import Teacher from '../../services/teacher.service';
import TuitionFees from '../../services/tuitionFees.service';
import Session from '../../services/session.service';
import ChildcareCenter from '../../services/childcareCenter.service';
import Allergies from '../../services/allergies.service';
import Allergen from '../../services/allergen.service';
import Notification from '../../services/notification.service';

// vue composition
import { ref, reactive, watch, computed, onMounted, onUnmounted, watchEffect, provide, inject, onBeforeMount, defineProps } from 'vue';

// vue router
import { useRoute, useRouter } from 'vue-router';

// vee-validate
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

// sweetalert2
import Swal from "sweetalert2";

// components
import Navbar from "../../components/layouts/Navbar.vue";
import Sidebar from "../../components/layouts/Sidebar.vue";
import Footer from "../../components/layouts/Footer.vue";
import Login from "../../views/Login.vue";
import BAdd from "../../components/buttons/Add.vue";
import BEdit from "../../components/buttons/Edit.vue";
import BDelete from "../../components/buttons/Delete.vue";
import BCancel from "../../components/buttons/Cancel.vue";
import FSelect from "../../components/forms/Select.vue";
import inputDate from "../../components/forms/input-date.vue";
import FSearch from "../../components/forms/Search.vue";
import Pagination from "../../components/Pagination.vue";
import FormOne from "../../components/forms/FormOne.vue";
import ASuccess from "../../components/alerts/Success.vue";
import Table from "../../components/Table.vue";
import FormChildren from "../../components/forms/FormChildren.vue";
import FormTeacher from "../../components/forms/FormTeacher.vue";
import ChildrenList from "../../views/children/cRoom/children/index.vue";
import CDIList from "../../views/children/cRoom/cdi/index.vue";
import MealTicketList from "../../views/children/cRoom/mealTicket/index.vue";
import AttendanceList from "../../views/children/cRoom/attendance/index.vue";
import ReceiptList from "../../views/children/cRoom/receipt/index.vue";
import AddMany from "../../views/children/cRoom/addition/addMany.vue";
import AddAuto from "../../views/children/cRoom/addition/addAuto.vue";
import FormAssignment from "../../components/forms/FormAssignment.vue";
import teacher_assignment from "../../components/common/teacher-assignment.vue";
import FormSession from "../../components/forms/FormSession.vue";
import FormAttendance from "../../components/forms/FormAttendance.vue";
import FormCDI from "../../components/forms/FormCDI.vue";
import FormReceipt from "../../components/forms/FormReceipt.vue";
import FormDish from "../../components/forms/FormDish.vue";
import FormMeal from "../../components/forms/FormMeal.vue";
import FormMealTicket from "../../components/forms/FormMealTicket.vue";
import dishes from "../../components/common/dishes.vue";
import meal from "../../components/common/meal.vue";
import FormAddParent from "../../components/forms/FormAddParent.vue";
import FormAddDiploma from "../../components/forms/FormAddDiploma.vue";
import FormChangeStatus from "../../components/forms/FormChangeStatus.vue";
import FormAssignmentClass from "../../components/forms/FormAssignmentClass.vue";
import FormChildcareCenter from "../../components/forms/FormChildcareCenter.vue";
import FormSchoolYear from "../../components/forms/FormSchoolYear.vue";
import FormGrade from "../../components/forms/FormGrade.vue";
import FormAllergies from "../../components/forms/FormAllergies.vue";
import FormEditAllergen from "../../components/forms/FormEditAllergen.vue";
import FormAddManyAssignment from "../../components/forms/FormAddManyAssignment.vue";
import FormViewManyAssignment from "../../components/forms/FormViewManyAssignment.vue";
import NotificationDetail from "../../components/forms/NotificationDetail.vue";
import FormViewDetailChild from "../../components/forms/FormViewDetailChild.vue";
import FormViewManyMealTicket from "../../components/forms/FormViewManyMealTicket.vue";

// alert
import { alert_error, alert_warning, alert_success, run_alert, alert_input_1, alert_remove } from './alert';

// image letters
import VueLetterAvatar from "vue-letter-avatar";

// http 
import { http_getAll, http_getOne, http_deleteOne, http_create, http_update } from '../../assets/js/http';

// format money
import { formatCurrencyVND, convertToWords, convertChunk } from '../../assets/js/money';

// format date-time
import { formatDate, formatDateReverse, formatDateTime, formatDateTime_2, format_input, getpreviousDate, excelNumberToDate } from '../../assets/js/date-time';

// eventBus
import eventBus from '../../assets/js/event-bus';
// import { useSocket } from '@/socket';

// excel
import * as XLSX from 'xlsx';

const generateOTP = () => {
    var string =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$&!?";
    let OTP = "";
    // Tìm độ dài của chuỗi
    var len = string.length;
    for (let i = 0; i < 10; i++) {
        OTP += string[Math.floor(Math.random() * len)];
    }
    return OTP;
}

const verifyToken = async () => {
    const token = sessionStorage.getItem('token');
    const isHeadquarters = sessionStorage.getItem("owner_isHeadquarters");
    const isToken = await Account.verifyToken({
        token,
        isHeadquarters,
    });
    return isToken.isHeadquarters;
}

import jsPDF from 'jspdf';

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
    Session,
    ChildcareCenter,
    Allergies,
    Allergen,
    Notification,
    // vue composition
    ref, reactive, watch, computed, onMounted, onUnmounted, watchEffect, provide, inject, onBeforeMount, defineProps,
    // vue router 
    useRoute, useRouter,
    // vee-validate 
    Form, Field, ErrorMessage,
    yup,
    // Swal 
    Swal,
    // components  
    Navbar,
    Sidebar,
    Footer,
    Login,
    BAdd,
    BEdit,
    BDelete,
    BCancel,
    FSelect,
    FSearch,
    Table,
    Pagination,
    FormOne,
    ASuccess,
    FormChildren,
    FormTeacher,
    ChildrenList,
    CDIList,
    MealTicketList,
    AttendanceList,
    ReceiptList,
    AddMany,
    AddAuto,
    FormAssignment,
    teacher_assignment,
    FormSession,
    FormAttendance,
    inputDate,
    FormCDI,
    FormReceipt,
    FormDish,
    FormMeal,
    dishes,
    FormMealTicket,
    meal,
    FormAddParent,
    FormAddDiploma,
    FormChangeStatus,
    FormAssignmentClass,
    FormChildcareCenter,
    FormSchoolYear,
    FormGrade,
    FormAllergies,
    FormEditAllergen,
    NotificationDetail,
    FormAddManyAssignment,
    FormViewManyAssignment,
    FormViewDetailChild,
    FormViewManyMealTicket,
    // alert
    alert_error, alert_warning, alert_success, run_alert, alert_input_1, alert_remove,
    // image letters
    VueLetterAvatar,
    // https
    http_getAll, http_getOne, http_deleteOne, http_create, http_update,
    // format money
    formatCurrencyVND, convertToWords, convertChunk,
    // format date-time
    formatDate, formatDateReverse, formatDateTime, formatDateTime_2, format_input, getpreviousDate, excelNumberToDate,
    // eventBus
    eventBus,
    // excel
    XLSX,
    generateOTP,
    verifyToken,
    jsPDF,
}















