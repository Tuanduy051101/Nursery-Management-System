<template>
  <div class="">
    <!-- Header -->
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
        <FSearch
          class="flex-1 mx-5"
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
        <!-- <FSelect
            class="w-28 mx-5"
            :options="option_mode"
            :modelValue="`auto`"
            :title="`Display`"
            v-model="mode"
          /> -->
      </div>
      <div class="flex">
        <FSelect
          class="w-96 ml-5 text-md"
          :options="gradeList"
          :modelValue="const_gr"
          :title="const_gr"
          @update:modelValue="
            async (value) => {
              gradeValue = value;
              await refresh();
            }
          "
          @refresh="
            async () => {
              gradeValue = const_gr;
              await refresh();
            }
          "
          :showClose="true"
          :optionLarge="true"
        />
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="[
        'Tên lớp',
        'Số lượng trẻ',
        'Số trẻ có mặt',
        'Tổng số phiếu ăn',
        ...meals.map((i) => `${i.name}`),
      ]"
      :labels="[
        'name',
        'totalChildren',
        'totalPresent',
        'totalMealTicket',
        ...meals.map((i) => `${i.name}`),
      ]"
      :mode="mode"
      :startRow="startRow"
      :show-checkbox="false"
      :show-action="[false, false, false]"
    />
    <Pagination
      :numberOfPages="numberOfPages"
      :totalRow="totalRow"
      :startRow="startRow"
      :endRow="endRow"
      v-model:currentPage="currentPage"
    />
    <div class="border border-solid mb-5 border-slate-300 border-b-0"></div>
    <div class="mt-5 mb-2 mx-5 border border-solid border-slate-300 border-b-0">
      <div class="flex justify-between items-start">
        <p
          class="text-lg border border-solid border-t-0 border-l-0 border-b-0 border-slate-300 px-4 py-1.5"
          style="border-radius: 0% 0% 5px 0%"
        >
          Danh sách khẩu phần ăn
        </p>
      </div>
      <Table
        :items="meals"
        :fields="['Khẩu phần ăn', 'Món ăn']"
        :labels="['name', 'dish_format']"
        :mode="mode"
        :startRow="startRow"
        :show-checkbox="false"
        :show-action="[false, false, false]"
        :activeSTT="true"
      />
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
  defineProps,
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
  FormViewManyAssignment,
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
  ChildcareCenter,
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
  const_ps,
  const_dl,
  positionList,
  positionValue,
  diplomaList,
  diplomaValue,
  resetFilter,
  reset,
  const_childcareCenter,
  childcareCenterValue,
  childcareCenterList,
} from "../../../components/common/index.js";

const itemAdd = ref({
  amountClasses: 0,
  schoolYear: "",
  grade: "",
  amountChildren: 0,
});

const props = defineProps({
  session_id: {
    type: String,
    required: true,
  },
  date_id: {
    type: String,
    required: true,
  },
  schoolYear_id: {
    type: String,
    required: true,
  },
});

const activeAddMany = ref(false);
const gradeId = ref(null);
const schoolYearId = ref(null);

searchOption.value = [
  { _id: "name", name: "Tìm kiếm theo tên lớp" },
  { _id: "child_name", name: "Tìm kiếm theo mã trẻ" },
  { _id: "child_name", name: "Tìm kiếm theo tên trẻ" },
];

const meals = ref([]);

const refresh = async () => {
  if (props.session_id && props.schoolYear_id && props.date_id) {
    meals.value = await http_getAll(Meal);
    meals.value = meals.value.filter(
      (i) => i.date == props.date_id && i.session._id == props.session_id
    );
    meals.value = meals.value.map((i, index) => ({
      _id: i._id,
      dish_format: i.dish
        .map((item1, index) =>
          i.dish.length == 1
            ? `<p>${item1.name}</p>`
            : `<p>${index + 1}. ${item1.name}</p>`
        )
        .join(""),
      name: `Kpa ${index + 1}`,
    }));
    items.value = await http_getAll(Classes);
    items.value = items.value.filter(
      (i) => i.schoolYear._id == props.schoolYear_id
    );
    if (gradeValue.value != const_gr.value) {
      items.value = items.value.filter((i) => i.grade._id == gradeValue.value);
    }
    items.value = items.value.map((item) => ({
      ...item,
      checked: false,
      grade_name: item.grade.name,
      schoolYear_name: item.schoolYear.name,
      totalPresent: item.attendance.reduce((acc, i) => {
        return i.session._id == props.session_id && i.date == props.date_id
          ? (acc = acc + 1)
          : acc;
      }, 0),
      totalMealTicket: item.mealTicket.filter(
        (i) =>
          i.meal.session._id == props.session_id && i.meal.date == props.date_id
      ).length,
      totalChildren: item.children.length,
      schoolYear_id: item.schoolYear._id,
      grade_id: item.grade._id,
      childcareCenterId: item.schoolYear.childcareCenter,
    }));
    for (let y = 0; y < items.value.length; y++) {
      for (let z = 0; z < meals.value.length; z++) {
        let h = `Kpa ${z + 1}`;
        items.value[y][h] = items.value[y].mealTicket.reduce(
          (acc, l) =>
            l.meal._id == meals.value[z]._id ? (acc = acc + 1) : acc,
          0
        );
      }
    }
    console.log("cc", items.value);
    items.value = items.value.filter(
      (i) => i.schoolYear.childcareCenter == childcareCenter.value
    );
  }
};

const refreshFilter = async () => {
  items.value = await http_getAll(Classes);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    grade_name: item.grade.name,
    schoolYear_name: item.schoolYear.name,
    totalChildren: item.children.length,
    schoolYear_id: item.schoolYear._id,
    grade_id: item.grade._id,
    childcareCenterId: item.schoolYear.childcareCenter,
  }));
  items.value = items.value.filter(
    (i) => i.schoolYear.childcareCenter == childcareCenter.value
  );
};

const filtered = async () => {
  await refresh();
  filters();
};

const filtered1 = async () => {
  await refreshFilter();
  filters();
};

const temp_childcareCenter = ref("");
const isToken = ref("");
const childcareCenter = ref(sessionStorage.getItem("owner_childcareCenter"));
const childcareCenterName = ref(
  sessionStorage.getItem("owner_childcareCenterName")
);

onBeforeMount(async () => {
  isToken.value = await verifyToken();
  await refresh();
  backup_items();
  childcareCenterValue.value = childcareCenter.value;
  temp_childcareCenter.value = childcareCenterName.value;
  items.value = items.value.filter(
    (i) => i.schoolYear.childcareCenter == childcareCenter.value
  );
  gradeList.value = await http_getAll(Grade);
  childcareCenterList.value = await http_getAll(ChildcareCenter);
  schoolYearList.value = await http_getAll(SchoolYear);
  schoolYearList.value = schoolYearList.value.filter(
    (i) => i.childcareCenter._id == childcareCenter.value
  );
});
</script>
