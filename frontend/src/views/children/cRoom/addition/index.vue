<template>
  <div
    v-if="item?.name"
    class="border border-solid border-slate-600 rounded-md mb-5"
  >
    <!-- list of children or cdi or receipt -->
    <div class="flex justify-between mx-5 my-5 text-slate-600">
      <div class="flex items-center text-lg text-slate-300">
        <div class="flex items-center">
          <label for="">Class name:</label>
          <span class="px-2 py-1 ml-2 text-blue-500">{{ item.name }}</span>
        </div>
        <div class="flex items-center ml-5">
          <label for="">Number of classes:</label>
          <span class="px-2 py-1 ml-2 text-blue-500">{{
            item.children.length
          }}</span>
        </div>
      </div>
      <div class="flex">
        <div
          class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
          :class="
            actionMenu == 1 ? 'border-2 border-slate-300 text-slate-300' : ''
          "
          @click="actionMenu = 1"
        >
          Add many
        </div>
        <div
          class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
          :class="
            actionMenu == 2 ? 'border-2 border-slate-300 text-slate-300' : ''
          "
          @click="actionMenu = 2"
        >
          Add auto
        </div>
      </div>
    </div>
    <div class="border border-solid my-5 border-slate-600 border-b-0"></div>

    <div class="flex">
      <!-- table -->
      <div
        class="flex-1 -mt-5 border border-solid border-t-0 border-b-0 border-l-0 border-slate-600"
      >
        <AddMany v-if="actionMenu == 1" :classId="id" @update="refresh" />
        <AddAuto v-if="actionMenu == 2" :id="id" />
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
const actionMenu = ref(1);

const refresh = async () => {
  item.value = await http_getOne(Classes, props.id);
  item.value = item.value[0];
};

onBeforeMount(async () => {
  await refresh();
});
</script>
