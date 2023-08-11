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

// vue composition
import { ref, reactive, watch, computed, onMounted, onUnmounted, watchEffect, provide, inject, onBeforeMount, defineProps} from 'vue';

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

// alert
import { alert_error, alert_warning, alert_success, run_alert, alert_input_1, alert_remove } from './alert';

// image letters
import VueLetterAvatar from "vue-letter-avatar";

// http 
import { http_getAll, http_getOne, http_deleteOne, http_create, http_update } from '../../assets/js/http';

// format money
import { formatCurrencyVND, convertToWords } from '../../assets/js/money';

// format date-time
import { formatDate, formatDateTime, formatDateTime_2 } from '../../assets/js/date-time';
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
    // alert
    alert_error, alert_warning, alert_success, run_alert, alert_input_1, alert_remove,
    // image letters
    VueLetterAvatar,
    // https
    http_getAll, http_getOne, http_deleteOne, http_create, http_update,
    // format money
    formatCurrencyVND, convertToWords,
    // format date-time
    formatDate, formatDateTime, formatDateTime_2
}















