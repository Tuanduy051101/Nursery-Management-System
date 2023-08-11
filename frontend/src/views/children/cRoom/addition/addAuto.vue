<template>
  <div class="flex-col my-5 mx-5">
    <div class="flex">
      <label for="" class="text-slate-300 flex items-center mr-5"
        >Number of children:</label
      >
      <input
        type="number"
        name=""
        id=""
        placeholder=""
        v-model="itemAdd.amountChildren"
        class="w-50 bg-inherit border border-solid text-slate-300 border-slate-600 focus:border-slate-300 rounded-md py-1.5 px-2"
      />
    </div>
    <div class="flex mt-5">
      <label for="" class="text-slate-300 flex items-center mr-5">Age:</label>
      <div class="flex space-x-10">
        <label
          v-for="(item, index) in checkboxes"
          :key="index"
          class="flex items-center space-x-2"
        >
          <input
            type="checkbox"
            v-model="item.checked"
            class="form-checkbox -mt-2 mx-2"
          />
          <span class="text-slate-300">{{ item.label }}</span>
        </label>
      </div>
    </div>
    <div class="flex mt-5 justify-start">
      <span
        @click="create"
        class="border border-solid px-5 py-2 rounded-md border-green-900 hover:border-green-500 cursor-pointer text-slate-600 hover:text-slate-300"
        >Add</span
      >
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
  AddMany,
  AddAuto,
} from "../../../../assets/js/imports";
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
} from "../../../../components/common/index.js";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const checkboxes = ref([
  { label: "0 tuổi", checked: false, _id: 0 },
  { label: "1 tuổi", checked: false, _id: 1 },
  { label: "2 tuổi", checked: false, _id: 2 },
  { label: "3 tuổi", checked: false, _id: 3 },
  { label: "4 tuổi", checked: false, _id: 4 },
  { label: "5 tuổi", checked: false, _id: 5 },
  { label: "6 tuổi", checked: false, _id: 6 },
]);

const conpact_age = computed(() => {
  return checkboxes.value
    .filter((value) => value.checked)
    .map((value1) => value1._id).length != 0
    ? checkboxes.value
        .filter((value) => value.checked)
        .map((value1) => value1._id)
    : null;
});

const itemAdd = ref({
  amountChildren: 0,
  age: conpact_age.value,
});
const router = useRouter();
const create = async () => {
  itemAdd.value.age = conpact_age.value;
  console.log(itemAdd.value);
  try {
    const result = await Classes.addChildAuto(props.id, itemAdd.value);
    if (result.error) {
      run_alert(alert_error(result.message));
    }
    if (!result.error) {
      run_alert(alert_success(result.message));
      router.push({ name: "ClassRoom.view", params: { id: props.id } });
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
