<template>
  <div
    v-if="items[0]?.class_name && temp_class.length > 0"
    class="border border-solid border-slate-600 rounded-md"
  >
    <!-- Header -->
    <p class="text-slate-300 text-lg mx-5 mt-5">Search Filter</p>
    <div class="flex justify-center items-center my-5">
      <FSelect
        class="w-full ml-5 text-md"
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
        :showClose="true"
      />
      <FSelect
        class="w-full ml-5 text-md"
        :options="monthList"
        :modelValue="const_mo"
        :title="const_mo"
        @update:modelValue="
          (value) => {
            monthValue = value;
            filtered();
          }
        "
        @refresh="
          async () => {
            monthValue = const_mo;
            await filtered();
          }
        "
        :showClose="true"
      />
      <inputDate
        class="w-full text-md mx-5"
        :modelValue="const_height"
        :title="const_height"
        @submit="
          (value) => {
            heightValue = value;
            filtered();
          }
        "
        @refresh="
          async () => {
            heightValue = const_height;
            await filtered();
          }
        "
        :showClose="true"
        :type="`number`"
        :placeholder="`Height`"
      />
      <inputDate
        class="w-full text-md"
        :modelValue="const_weight"
        :title="const_weight"
        @submit="
          (value) => {
            weightValue = value;
            filtered();
          }
        "
        @refresh="
          async () => {
            weightValue = const_weight;
            await filtered();
          }
        "
        :showClose="true"
        :type="`number`"
        :placeholder="`Weight`"
      />
      <inputDate
        class="w-full text-md mx-5"
        :modelValue="const_rose"
        :title="const_rose"
        @submit="
          (value) => {
            roseValue = value;
            filtered();
          }
        "
        @refresh="
          async () => {
            roseValue = const_rose;
            await filtered();
          }
        "
        :showClose="true"
        :type="`number`"
        :placeholder="`Rose`"
      />
    </div>
    <div class="border border-solid border-slate-600 border-t-0"></div>
    <!-- Header -->
    <div class="flex items-center justify-between my-5 mx-5">
      <div class="w-6/12 flex">
        <FSelect
          style="width: 105px"
          :options="option_entry"
          :modelValue="entryValue"
          :title="`Record`"
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
        <FSelect
          class="w-28 mx-5"
          :options="option_mode"
          :modelValue="`auto`"
          :title="`Display`"
          v-model="mode"
        />
      </div>
      <div class="flex-1 flex justify-end">
        <FSearch
          class="flex-1 h-10"
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
      :fields="[
        'Class name',
        'Month',
        'height (cm)',
        'weight (kg)',
        'health',
        'roses',
        'note',
      ]"
      :labels="[
        'class_name',
        'month_name',
        'height',
        'weight',
        'health',
        'roses',
        'note',
      ]"
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
    <FormCDI
      v-if="activeAdd"
      :itemAdd="itemAdd"
      :title="`Add a new child development index`"
      @cancel="(value) => (activeAdd = value)"
      @submit="create()"
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
  FormCDI,
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
  Session,
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
  const_da,
  const_st,
  const_se,
  dateValue,
  sessionList,
  sessionValue,
  statusList,
  statusValue,
  monthList,
  monthValue,
  const_mo,
  const_height,
  const_weight,
  const_rose,
  const_health,
  heightValue,
  weightValue,
  roseValue,
  healthValue,
  classValue,
  classList,
  const_cl,
} from "../../../components/common/index.js";

const itemAdd = ref({
  month: "",
  children: "",
  classes: "",
});

searchOption.value = [{ _id: "health", name: "Search by child's health" }];

const filtered = async () => {
  await refresh();
  filters();
};

const _id = ref("");
_id.value = sessionStorage.getItem("owner_id");

const refresh = async () => {
  const children = await http_getOne(Children, _id.value);
  items.value = children.cDI;
  items.value = items.value.map((item) => ({
    ...item,
    month_name: item.month.name,
    class_name: item.classes.name,
    class_id: item.classes._id,
  }));

  classList.value = children.classes;
};

const temp_class = ref("");

onBeforeMount(async () => {
  if (_id.value.length > 0) {
    const children = await http_getOne(Children, _id.value);
    classValue.value = children.classes[children.classes.length - 1];
    temp_class.value = classValue.value.name;
    classValue.value = classValue.value._id;
    await refresh();
    monthList.value = await http_getAll(Month);
  }
});
</script>
