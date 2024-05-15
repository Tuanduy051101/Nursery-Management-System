<template>
  <!-- Header -->
  <p class="text-blue-700 text-base mx-5 mt-5">Bộ lọc tìm kiếm</p>
  <div class="flex justify-between items-center my-5 mx-5">
    <FSelect
      class="w-full mr-5 text-md"
      :options="classList"
      :modelValue="temp_class"
      :title="const_cl"
      @update:modelValue="
        (value) => {
          classValue = value;
          filtered();
        }
      "
      @refresh="
        async () => {
          classValue = const_cl;
          await filtered();
        }
      "
    />
    <inputDate
      class="w-full text-md"
      :modelValue="temp_date"
      :title="const_da"
      @submit="
        (value) => {
          dateValue = value;
          filtered();
        }
      "
      @refresh="
        async () => {
          dateValue = const_da;
          //   dateValue = format_input(new Date());
          //   temp_date = dateValue;
          await filtered();
        }
      "
      :showClose="true"
    />
    <FSelect
      class="w-full ml-5 text-md"
      :options="sessionList"
      :modelValue="const_se"
      :title="const_se"
      @update:modelValue="
        (value) => {
          sessionValue = value;
          filtered();
        }
      "
      @refresh="
        async () => {
          sessionValue = const_se;
          await filtered();
        }
      "
      :showClose="true"
      :optionLarge="true"
    />
    <FSelect
      class="w-full ml-5 text-md"
      :options="statusList"
      :modelValue="const_st"
      :title="const_st"
      @update:modelValue="
        (value) => {
          statusValue = value;
          filtered();
        }
      "
      @refresh="
        async () => {
          statusValue = const_st;
          await filtered();
        }
      "
      :showClose="true"
    />
  </div>
  <div class="border border-solid my-5 border-slate-300 border-b-0"></div>
  <div v-if="item?.name" class="flex items-center justify-between my-5 mx-5">
    <div class="w-6/12 flex">
      <FSelect
        style="width: 105px"
        :options="option_entry"
        :modelValue="entryValue"
        :title="`Số bản ghi`"
        @update:modelValue="
          async (value) => {
            currentPage = 1;
            if (value != 'other') {
              entryValue = value;
            } else {
              entryValue = await alert_input_1(
                'number',
                '',
                'Enter the number of records per page.'
              );
            }
          }
        "
      />
      <!-- <FSelect
        class="w-28 mx-5"
        :options="option_mode"
        :modelValue="`auto`"
        :title="`Display`"
        v-model="mode"
      /> -->
    </div>
    <div class="flex-1 flex justify-end">
      <FSearch
        class="flex-1"
        @search="
          (value) => {
            searchText = value;
            currentPage = 1;
          }
        "
        :title="searchWith.name"
        @searchWith="(value) => (searchWith = value)"
        :optionSearch="searchOption"
      />
    </div>
  </div>
  <Table
    :items="setPages"
    :fields="['Ngày', 'Buổi', 'Trạng thái', 'Lý do']"
    :labels="[
      'date_format',
      'session_format',
      'statusAttendance',
      'reasonAttendance',
    ]"
    :wrap-list="[false, false, false, true]"
    :mode="mode"
    :showAction="[false, false, false]"
    :startRow="startRow"
    :show-checkbox="false"
  />
  <Pagination
    :numberOfPages="numberOfPages"
    :totalRow="totalRow"
    :startRow="startRow"
    :endRow="endRow"
    v-model:currentPage="currentPage"
  />
</template>

<script setup>
import { date } from "yup";
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
  defineProps,
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
  ChildrenList,
  CDIList,
  MealTicketList,
  AttendanceList,
  ReceiptList,
  FormSession,
  FormAttendance,
  inputDate,
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
  format_input,
  getpreviousDate,
  Session,
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
  const_da,
  const_st,
  const_se,
  dateValue,
  sessionList,
  sessionValue,
  statusList,
  statusValue,
  classValue,
  classList,
  const_cl,
  reset,
} from "../../components/common/index.js";

const props = defineProps({
  attendanceList: {
    type: Array,
    required: true,
  },
  classList: {
    type: Array,
    required: true,
  },
});

searchOption.value = [{ _id: "reason", name: "Tìm kiếm theo lý do vắng mặt" }];

const filtered = async () => {
  await refresh();
  filters();
};

const refresh = async () => {
  if (props.attendanceList && props.classList) {
    items.value = props.attendanceList;
    items.value = items.value.map((item) => ({
      ...item,
      class_name: item.classes.name,
      statusAttendance: item.present == "true" ? "có mặt" : "vắng mặt",
      date_format: formatDate(item.date),
      session_format: `${item.session.startTime} - ${item.session.endTime} ( ${item.session.name} )`,
      class_id: item.classes._id,
      reasonAttendance: item.reason,
      status: item.present,
    }));
    classList.value = props.classList;
    filters();
  }
};

const temp_date = ref("");
const temp_class = ref("");

const childcareCenter = ref(sessionStorage.getItem("owner_childcareCenter"));

onBeforeMount(async () => {
  reset();
  statusList.value = [
    {
      _id: "true",
      name: "có mặt",
    },
    {
      _id: "false",
      name: "vắng mặt",
    },
  ];
  if (props.classList && props.attendanceList) {
    classValue.value = props.classList[props.classList.length - 1];
    temp_class.value = classValue.value.name;
    classValue.value = classValue.value._id;
    dateValue.value = format_input(new Date());
    temp_date.value = dateValue.value;
    await refresh();
    // while (items.value.length == 0 && props.attendanceList.length != 0) {
    //   dateValue.value = getpreviousDate(temp_date.value);
    //   temp_date.value = dateValue.value;
    //   filters();
    // }

    sessionList.value = await http_getAll(Session);
    sessionList.value = sessionList.value.filter((i) =>
      i.childcareCenter.some(
        (j) => j._id == sessionStorage.getItem("owner_childcareCenter")
      )
    );
    sessionList.value = sessionList.value.map((item) => ({
      _id: item._id,
      name: `${item.startTime} - ${item.endTime} ( ${item.name} )`,
    }));
  }
});
</script>
