<template>
  <div class="border border-solid border-slate-300 rounded-md">
    <p class="text-blue-700 text-base mx-5 mt-5">Bộ lọc tìm kiếm</p>
    <div class="flex justify-center items-center mx-5 my-5">
      <FSelect
        class="w-full text-md mr-5"
        :options="childcareCenterList"
        :modelValue="temp_childcareCenter"
        :title="const_childcareCenter"
        @update:modelValue="
          async (value) => {
            childcareCenterValue = value;
            await filtered();
          }
        "
        @refresh="
          async () => {
            childcareCenterValue = const_childcareCenter;
            await filtered();
          }
        "
        :showClose="true"
      />
      <FSelect
        class="w-full text-md"
        :options="gradeList"
        :modelValue="const_gr"
        :title="const_gr"
        @update:modelValue="
          async (value) => {
            gradeValue = value;
            await filtered();
          }
        "
        @refresh="
          async () => {
            gradeValue = const_gr;
            await filtered();
          }
        "
        :showClose="true"
      />
    </div>
    <div class="border border-solid my-5 border-slate-300 border-b-0"></div>
    <div class="flex items-center justify-between my-5 mx-5">
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
            } else
              entryValue = await alert_input_1(
                'number',
                '',
                'Enter the number of records per page.'
              );
          }
        "
      />
      <FSearch
        class="ml-5"
        style="width: 550px"
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
    <Table
      :items="setPages"
      :fields="['Chất gây dị ứng', 'Số lượng trẻ bị dị ứng']"
      :labels="['name', 'amountAllergies']"
      :wrap-list="[false, false, false, true, false]"
      :actionList="['Children.view']"
      :mode="mode"
      :startRow="startRow"
      :show-action="[true, false, false]"
      :activeSTT="true"
    />
    <Pagination
      :numberOfPages="numberOfPages"
      :totalRow="totalRow"
      :startRow="startRow"
      :endRow="endRow"
      v-model:currentPage="currentPage"
    />
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
  ChildcareCenter,
  Allergies,
  Allergen,
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
  FormChangeStatus,
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
  excelNumberToDate,
  formatDateReverse,
  // exel
  XLSX,
  generateOTP,
  jsPDF,
  verifyToken,
} from "../../../assets/js/imports";
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
  reset,
  classList,
  classValue,
  const_cl,
  const_statusChild,
  statusChildValue,
  statusChildList,
  const_childcareCenter,
  childcareCenterValue,
  childcareCenterList,
} from "../../../components/common/index.js";

import "jspdf-autotable";

searchOption.value = [
  { _id: "name", name: "Tìm kiếm theo tên chất gây dị ứng" },
];

const activeExport = ref(false);
const selectRef = ref(null);
const showAdvanced = ref(false);
const activeChangeStatus = ref(false);
const activeTransferSchool = ref(false);
const activeTransferClass = ref(false);
const itemChangeStatus = ref({
  status: "đang học",
});

watch(schoolYearValue, async (n, o) => {
  if (
    schoolYearValue.value != const_sy.value &&
    gradeValue.value != const_gr.value
  ) {
    classList.value = await http_getAll(Classes);
    classList.value = classList.value.filter(
      (value) =>
        value.schoolYear._id == schoolYearValue.value &&
        gradeValue.value == value.grade._id
    );
  }
});

watch(gradeValue, async (n, o) => {
  if (
    schoolYearValue.value != const_sy.value &&
    gradeValue.value != const_gr.value
  ) {
    classList.value = await http_getAll(Classes);
    classList.value = classList.value.filter(
      (value) =>
        value.schoolYear._id == schoolYearValue.value &&
        gradeValue.value == value.grade._id
    );
  }
});

const temp_childcareCenter = ref("");

const refresh = async () => {
  items.value = await http_getAll(Allergen);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    amountAllergies: item.allergies.reduce((acc, i) => {
      const lastChildcareCenter =
        i.child.childcareCenter[i.child.childcareCenter.length - 1];
      const lastClass = i.child.classes[i.child.classes.length - 1];
      if (
        lastChildcareCenter == childcareCenterValue.value &&
        i.child.classes.length != 0 &&
        lastClass.schoolYear == schoolYearValue.value
      ) {
        acc++;
      }
      return acc;
    }, 0),
  }));

  if (childcareCenterValue.value == const_childcareCenter.value) {
    console.log("chay1");
    items.value = items.value.map((item) => ({
      ...item,
      checked: false,
      amountAllergies: item.allergies.reduce((acc, i) => {
        const lastClass = i.child.classes[i.child.classes.length - 1];
        console.log(i.child.classes.length);
        if (
          i.child.classes.length != 0 &&
          lastClass.schoolYear == schoolYearValue.value
        ) {
          acc++;
        }
        return acc;
      }, 0),
    }));
  }
  if (gradeValue.value != const_gr.value) {
    console.log("chay2");
    items.value = items.value.map((item) => ({
      ...item,
      checked: false,
      amountAllergies: item.allergies.reduce((acc, i) => {
        const lastChildcareCenter =
          i.child.childcareCenter[i.child.childcareCenter.length - 1];
        const lastClass = i.child.classes[i.child.classes.length - 1];

        if (
          lastChildcareCenter == childcareCenterValue.value &&
          i.child.classes.length != 0 &&
          lastClass.schoolYear == schoolYearValue.value &&
          lastClass.grade == gradeValue.value
        ) {
          acc++;
        }
        return acc;
      }, 0),
    }));
  }
  if (
    gradeValue.value != const_gr.value &&
    childcareCenterValue.value == const_childcareCenter.value
  ) {
    console.log("chay3");
    items.value = items.value.map((item) => ({
      ...item,
      checked: false,
      amountAllergies: item.allergies.reduce((acc, i) => {
        const lastClass = i.child.classes[i.child.classes.length - 1];

        if (
          i.child.classes.length != 0 &&
          lastClass.schoolYear == schoolYearValue.value &&
          lastClass.grade == gradeValue.value
        ) {
          acc++;
        }
        return acc;
      }, 0),
    }));
  }
  items.value = items.value.filter((i) => i.amountAllergies != 0);
};

const filtered = async () => {
  await refresh();
  currentPage.value = 1;
};

const isToken = ref("");

const childcareCenter = ref(sessionStorage.getItem("owner_childcareCenter"));
const childcareCenterName = ref(
  sessionStorage.getItem("owner_childcareCenterName")
);

onBeforeMount(async () => {
  isToken.value = await verifyToken();
  reset();
  schoolYearList.value = await http_getAll(SchoolYear);
  schoolYearList.value = schoolYearList.value.filter(
    (i) => i.childcareCenter._id == childcareCenter.value
  );
  schoolYearValue.value =
    schoolYearList.value[schoolYearList.value.length - 1]._id;
  childcareCenterValue.value = childcareCenter.value;
  temp_childcareCenter.value = childcareCenterName.value;
  childcareCenterList.value = await http_getAll(ChildcareCenter);
  gradeList.value = await http_getAll(Grade);
  await refresh();
});
</script>
