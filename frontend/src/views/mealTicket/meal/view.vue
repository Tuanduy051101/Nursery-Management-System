<template>
  <div
    v-if="mealInfo[0]?.session_name"
    class="border border-solid border-slate-300 rounded-md mb-5"
  >
    <div class="flex justify-start">
      <p
        class="text-lg border border-solid border-t-0 border-l-0 border-slate-300 px-4 py-1.5"
        style="border-radius: 0% 0% 5px 0%"
      >
        Chi tiết thông tin khẩu phần ăn
      </p>
    </div>
    <!-- class detail -->
    <div class="flex flex-col justify-start py-5 px-5 text-slate-600">
      <span class="px-2"
        >Ngày:
        <span class="text-slate-900 ml-2">{{
          mealInfo[0].date_format
        }}</span></span
      >
      <span class="px-2 py-2"
        >Buổi:
        <span class="text-slate-900 ml-2 capitalize">{{
          mealInfo[0].session_name
        }}</span></span
      >
      <span class="px-2 pb-2 capitalize"
        >Khối học:
        <span class="text-slate-900 ml-2">{{
          mealInfo[0].grade_name
        }}</span></span
      >
    </div>
    <div class="border border-solid border-slate-300 border-t-0"></div>
    <div class="flex items-center justify-between my-5 mx-5">
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
      <div class="flex-1 flex">
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
      :fields="['Tên món ăn', 'Chức năng']"
      :labels="['name', 'function']"
      :wrap-list="[false, true]"
      :showAction="[true, false, false]"
      :actionList="[role == 'Chef' ? 'Dish-chef.view' : 'Dish.view']"
    />
    <Pagination
      :numberOfPages="numberOfPages"
      :totalRow="totalRow"
      :startRow="startRow"
      :endRow="endRow"
      v-model:currentPage="currentPage"
    />
    <FormDish
      v-if="activeAdd"
      :item="itemAdd"
      :title="`Add a new ingredient`"
      @cancel="
        (value) => {
          activeAdd = value;
        }
      "
      @submit="create()"
      :button-name="`Add I`"
    />
    <FormDish
      v-if="activeEdit"
      :item="item"
      :title="`Edit a ingredient`"
      @cancel="
        (value) => {
          activeEdit = value;
        }
      "
      @submit="edit()"
      :button-name="`Edit I`"
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
  FormTeacher,
  FormReceipt,
  FormDish,
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
  AddMany,
  AddAuto,
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
  const_ps,
  const_dl,
  positionList,
  positionValue,
  diplomaList,
  diplomaValue,
  const_st,
  statusList,
  statusValue,
  reset,
} from "../../../components/common/index.js";

const itemAdd = ref({
  name: "",
  amount: "",
  function: "",
  note: "",
  making: "",
  dish: props.id,
});

searchOption.value = [
  { _id: "name", name: "Tìm kiếm theo tên món ăn" },
  { _id: "function", name: "Tìm kiếm theo chức năng món ăn" },
];
const role = ref("");
role.value = sessionStorage.getItem("role");
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const mealInfo = ref({});

const refresh = async () => {
  if (props.id) {
    mealInfo.value = await http_getOne(Meal, props.id);
    mealInfo.value = [mealInfo.value].map((item) => ({
      ...item,
      session_name:
        item.session.name +
        "_" +
        item.session.startTime +
        "_" +
        item.session.endTime,
      grade_name: item.grade.map((item) => item.name).join(", "),
      date_format: formatDate(item.date),
    }));
    items.value = mealInfo.value[0].dish;
    items.value = items.value.map((item) => ({
      ...item,
      ingredient_name: item.ingredient
        .map((item) => item.foodstuff.name)
        .join(", "),
    }));
  }
};

const filtered = async () => {
  await refresh();
  filters();
};

onBeforeMount(async () => {
  reset();
  await refresh();
});
</script>
