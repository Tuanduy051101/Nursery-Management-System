<template>
  <div
    class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
  >
    <div class="bg-slate-800 h-screen opacity-70 flex-1 relative"></div>
    <div
      class="bg-slate-800 mx-5 w-4/12 overflow-auto absolute rounded-md shadow-xl border border-solid border-slate-300"
      style="min-height: 100px; max-height: 100vh"
    >
      <div
        class="flex flex-row justify-between items-center px-3 py-3 text-slate-300 border border-solid border-slate-300 border-l-0 border-r-0 border-t-0 text-lg"
      >
        <span>{{ title }}</span>
        <span
          @click="$emit('cancel', false)"
          class="material-symbols-outlined cursor-pointer text-slate-600 hover:text-slate-300"
        >
          close
        </span>
      </div>
      <div class="flex flex-col my-5 mx-3">
        <div>
          <!-- classes -->
          <div class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Classes<span
                class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                >*</span
              ></label
            >
            <FSelect
              @update:modelValue="(value) => (item.classes = value)"
              :options="classes"
              class="border-slate-600"
              :activeSearch="true"
            />
          </div>
          <!-- teacher -->
          <div class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Teacher<span
                class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                >*</span
              ></label
            >
            <FSelect
              @update:modelValue="(value) => (item.teacher = value)"
              :options="teacher"
              :class="!item.teacher ? 'border-red-500' : 'border-slate-600'"
            />
            <span v-if="!item.teacher" class="text-red-500 mt-1 ml-1 text-sm"
              >Please select a value !</span
            >
          </div>
          <!-- duty -->
          <div class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Duty<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                >*</span
              ></label
            >
            <FSelect
              @update:modelValue="(value) => (item.duty = value)"
              :options="duty"
              :class="!item.duty ? 'border-red-500' : 'border-slate-600'"
            />
            <span v-if="!item.duty" class="text-red-500 mt-1 ml-1 text-sm"
              >Please select a value !</span
            >
          </div>
          <!-- note -->
          <div class="flex flex-col text-slate-300">
            <label for="" class="mb-4 mt-5 ml-1 flex items-center">Note</label>
            <textarea
              v-model="item.note"
              class="bg-inherit overflow-auto border border-solid border-slate-600 rounded-md focus:border-slate-300 p-2"
              style="outline: none; max-height: 80px"
            ></textarea>
          </div>
          <button
            @click="$emit('submit')"
            class="text-slate-300 border border-solid border-green-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:bg-green-500 mt-5 hover:text-slate-100"
          >
            Add
          </button>
          <!-- </Form> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
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
  ref,
  reactive,
  watch,
  computed,
  onMounted,
  onUnmounted,
  watchEffect,
  provide,
  inject,
  onBeforeMount,
  // vue router
  useRoute,
  useRouter,
  // vee-validate
  Form,
  Field,
  ErrorMessage,
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
  FormAssignment,
  // alert
  alert_error,
  alert_warning,
  alert_success,
  run_alert,
  alert_input_1,
  alert_remove,
  // https
  http_getAll,
  http_getOne,
  http_deleteOne,
  http_create,
  http_update,
  // format money
  formatCurrencyVND,
  convertToWords,
  // format date-time
  formatDate,
  formatDateTime,
  formatDateTime_2,
} from "../../assets/js/imports";
//
import {
  items,
  items_cp,
  item,
  background,
  searchText,
  searchWith,
  searchOption,
  entryValue,
  typing_entry,
  option_entry,
  mode,
  option_mode,
  numberOfPages,
  totalRow,
  startRow,
  endRow,
  currentPage,
  activeAdd,
  activeEdit,
  deleteValue,
  setPages,
  gradeList,
  schoolYearList,
  tuitionFeesList,
  gradeValue,
  schoolYearValue,
  tuitionFeesValue,
  filter_grade,
  filter_schoolYear,
  filter_tuitionFees,
  backup_items,
  restore_items,
  restore_filter,
  modelValue_schoolYear,
  ageList,
  ageValue,
  filter_age,
  genderList,
  genderValue,
  filter_gender,
  const_sy,
  const_gr,
  const_tf,
  const_ge,
  const_ag,
  filters,
} from "../components/common/index.js";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  item: {
    type: Object,
    default: {},
  },
  placeholder: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
});

const classes = ref([]);
const duty = ref([]);

const refresh = async () => {};

onBeforeMount(async () => {
  await refresh();
  classes.value = await http_getAll(Classes);
  duty.value = await http_getAll(Duty);
});
</script>
