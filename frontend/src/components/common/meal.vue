<template>
  <div class="border border-solid border-slate-300 rounded-md">
    <div class="flex flex-row-reverse">
      <span
      @click="$emit('cancel')"
      class="material-symbols-outlined m-5 cursor-pointer text-slate-900 hover:text-red-500"
      title="Đóng"
    >
      close
    </span>
    </div>
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
          class="border border-solid border-blue-500 bg-blue-500 px-3 text-white rounded-md hover:shadow-lg hover:shadow-yellow-500/50"
          type="button"
          @click="$emit('submit', items)"
        >
          Đăng ký
        </button>
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="['Ngày', 'Buổi', 'Khẩu phần ăn']"
      :labels="['date_format', 'session_name', 'dish_format']"
      :wrap-list="[false, false, true]"
      :mode="mode"
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
  meal,
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
  sessionValue,
  dateValue,
  reset,
} from "./index.js";

const props = defineProps({
  session: {
    type: String,
    required: true,
    default: "",
  },
  date: {
    type: String,
    required: true,
    default: "",
  },
  meal: {
    type: String,
    required: true,
    default: "",
  },
  child: {
    type: String,
    required: true,
    default: "",
  },
});

const refresh = async () => {
  if (
    props.session.length != 0 &&
    props.date.length != 0 &&
    props.meal.length != 0 &&
    props.child.length
  ) {
    sessionValue.value = props.session;
    dateValue.value = props.date;
    items.value = await http_getAll(Meal);
    items.value = items.value.filter((i) => {
      return i.mealTicket.every((j) => j.child._id != props.child);
    });
    items.value = items.value.map((item) => ({
      ...item,
      checked: false,
      dish_format: item.dish
        .map((item1, index) => `<p>${index + 1}. ${item1.name}</p>`)
        .join(""),
      session_name: `${item.session.startTime} - ${item.session.endTime} ( ${item.session.name} )`,
      date_format: formatDate(item.date),
      session: {
        _id: item.session._id,
      },
    }));
    filters();
  }
};

const filtered = async () => {
  await refresh();
  filters();
};

onBeforeMount(async () => {
  items.value = [];
  await refresh();
});
</script>
