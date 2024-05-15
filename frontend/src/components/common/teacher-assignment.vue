<template>
  <div
    v-if="schoolYear_id"
    class="border border-solid border-slate-300 rounded-md"
  >
    <div
      class="flex flex-row justify-between items-center text-slate-900 border border-solid border-slate-300 border-l-0 border-r-0 border-t-0 text-lg"
    >
      <span class="mx-5 my-4 cursor-pointer text-slate-900 hover:text-red-500">
        Chọn giáo viên
      </span>
      <span
        @click="$emit('cancel')"
        class="material-symbols-outlined mx-5 my-4 cursor-pointer text-slate-900 hover:text-red-500"
        title="Đóng"
      >
        close
      </span>
    </div>
    <!-- Header -->
    <p class="text-blue-900 text-base mx-5 mt-5">Bộ lọc tìm kiếm</p>
    <div class="flex justify-center items-center my-5 mx-5">
      <FSelect
        class="w-full text-md"
        :options="genderList"
        :title="const_ge"
        :modelValue="const_ge"
        @update:modelValue="
          (value) => {
            genderValue = value;
            filtered1();
          }
        "
        @refresh="
          () => {
            genderValue = const_ge;
            filtered1();
          }
        "
        :showClose="true"
      />
      <FSelect
        class="w-full text-md ml-5"
        :options="positionList"
        :title="const_ps"
        :modelValue="const_ps"
        @update:modelValue="
          (value) => {
            positionValue = value;
            filtered1();
          }
        "
        @refresh="
          () => {
            positionValue = const_ps;
            filtered1();
          }
        "
        :showClose="true"
      />
      <!-- <FSelect
        class="w-full text-md"
        :options="diplomaList"
        :title="const_dl"
        :modelValue="const_dl"
        @update:modelValue="
          (value) => {
            diplomaValue = value;
            filtered1();
          }
        "
        @refresh="
          () => {
            diplomaValue = const_dl;
            filtered1();
          }
        "
        :showClose="true"
        :active-search="true"
      /> -->
    </div>
    <div class="border border-solid my-5 border-slate-300 border-b-0"></div>
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
              } else
                entryValue = await alert_input_1(
                  'number',
                  '',
                  'Enter the number of records per page.'
                );
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
        <button
          class="border border-solid border-orange-500 bg-orange-500 rounded-md text-white px-5 hover:shadow-lg hover:shadow-yellow-500"
          type="button"
          @click="
            $emit(
              'submit',
              items.filter((item) => item.checked).map((item1) => item1._id)
            )
          "
        >
          Phân công
        </button>
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="['Mã giáo viên', 'Tên giáo viên', 'Số điện thoại', 'Phân công']"
      :labels="['_id', 'name', 'phone', 'assignment']"
      :wrap-list="[false, false, false]"
      :mode="mode"
      :actionList="actionList"
      :show-action="[false, false, false]"
      :startRow="startRow"
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
  // eventBus
  eventBus,
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
  const_ps,
  const_dl,
  positionList,
  positionValue,
  diplomaList,
  diplomaValue,
  resetFilter,
  reset,
} from "./index.js";

const props = defineProps({
  schoolYear_id: {
    type: String,
    required: true,
  },
  class_id: {
    type: String,
    required: true,
  },
});

console.log("chay ne met qua ");
console.log(props.schoolYear_id);

searchOption.value = [
  { _id: "name", name: "Tìm kiếm theo tên" },
  { _id: "phone", name: "Tìm kiếm theo số điện thoại" },
  { _id: "email", name: "Tìm kiếm theo e-mail" },
];

const refresh = async () => {
  if (props.schoolYear_id && props.class_id) {
    items.value = await http_getAll(Teacher);
    items.value = items.value.filter((i) =>
      i.assignment.every((j) => j.classes._id != props.class_id)
    );
    items.value = items.value.map((item) => ({
      ...item,
      checked: false,
      gender_format: item.gender == "true" ? "nam" : "nữ",
      position_name: item.position.name,
      childcareCenterId:
        item.childcareCenter[item.childcareCenter.length - 1]._id,
      assignment:
        item.assignment.length != 0
          ? item.assignment
              .filter(
                (item1) => item1.classes.schoolYear._id == props.schoolYear_id
              )
              .map((item2) => item2.classes.name)
              .join(",")
          : "không có",
    }));
    items.value = items.value.filter(
      (i) =>
        i.childcareCenter[i.childcareCenter.length - 1]._id ==
        childcareCenter.value
    );
  }
};

const refreshFilter = async () => {
  if (props.schoolYear_id && props.class_id) {
    items.value = await http_getAll(Teacher);
    items.value = items.value.filter((i) =>
      i.assignment.every((j) => j.classes._id != props.class_id)
    );
    items.value = items.value.map((item) => ({
      ...item,
      checked: false,
      gender_format: item.gender == "true" ? "nam" : "nữ",
      position_name: item.position.name,
      childcareCenterId:
        item.childcareCenter[item.childcareCenter.length - 1]._id,
      assignment:
        item.assignment.length != 0
          ? item.assignment
              .filter(
                (item1) => item1.classes.schoolYear._id == props.schoolYear_id
              )
              .map((item2) => item2.classes.name)
              .join(",")
          : "không có",
    }));
  }
};

const filtered = async () => {
  await refresh();
  filters();
  currentPage.value = 1;
};

const filtered1 = async () => {
  await refresh();
  filters();
  currentPage.value = 1;
};

const temp_childcareCenter = ref("");
const isToken = ref("");
const childcareCenter = ref(sessionStorage.getItem("owner_childcareCenter"));
const childcareCenterName = ref(
  sessionStorage.getItem("owner_childcareCenterName")
);

onBeforeMount(async () => {
  resetFilter();
  await refresh();
  items.value = items.value.filter(
    (i) =>
      i.childcareCenter[i.childcareCenter.length - 1]._id ==
      childcareCenter.value
  );
  positionList.value = await http_getAll(Position);
  diplomaList.value = await http_getAll(Diploma);
});
</script>
