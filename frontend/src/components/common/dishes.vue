<template>
  <div class="border border-solid border-slate-300 rounded-md">
    <div class="flex flex-row justify-between items-center text-slate-900 border border-solid border-slate-300 border-l-0 border-r-0 border-t-0 text-lg">
      <span
        class="mx-5 my-4 cursor-pointer text-slate-900 hover:text-red-500"
      >
        Chọn món ăn
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
          class="border border-solid border-blue-500 bg-blue-500 rounded-md text-white px-5 hover:shadow-lg hover:shadow-yellow-500/50"
          type="button"
          @click.prevent="
            $emit(
              'submit',
              items
                .filter((item) => item.checked)
                .map((items) => ({
                  _id: items._id,
                  name: items.name,
                }))
            )
          "
        >
          Thêm khẩu phần ăn
        </button>
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="['Tên món ăn', 'Chức năng', 'ghi chú']"
      :labels="['name', 'function', '_note']"
      :wrap-list="[false, true, true]"
      :mode="mode"
      :startRow="startRow"
      :show-action="[false, false, false]"
      @delete="(value) => remove(value)"
      @edit="
        async (value) => {
          item = items.filter((item) => item._id == value);
          item = item[0];
          edit();
        }
      "
      :actionList="['Dish.view']"
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
  verifyToken,
  ChildcareCenter,
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
  const_st,
  statusList,
  statusValue,
  const_childcareCenter,
  childcareCenterValue,
  childcareCenterList,
  resetFilter,
} from "../../components/common/index";

searchOption.value = [
  { _id: "name", name: "Tìm kiếm theo tên món ăn" },
  { _id: "function", name: "Tìm kiếm theo chức năng món ăn" },
];

const temp_childcareCenter = ref("");
const isToken = ref("");
const childcareCenter = ref(sessionStorage.getItem("owner_childcareCenter"));
const childcareCenterName = ref(
  sessionStorage.getItem("owner_childcareCenterName")
);

const refresh = async () => {
  items.value = await http_getAll(Dish);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    _note: item.note,
    childcareCenterId: item.childcareCenter._id,
  }));
  items.value = items.value.filter(
    (i) => i.childcareCenter._id == childcareCenter.value
  );
};

const filtered = async () => {
  await refresh();
  filters();
  currentPage.value = 1;
};

onBeforeMount(async () => {
  resetFilter();
  await refresh();
  items.value = items.value.filter(
    (i) => i.childcareCenter._id == childcareCenter.value
  );
});
</script>
