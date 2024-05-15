<template>
  <div
    class="fixed top-0 right-0 w-screen h-screen z-50 flex overflow-auto items-center justify-center"
  >
    <div class="bg-slate-900 h-screen opacity-70 flex-1 relative"></div>
    <div
      class="bg-white mx-5 w-4/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
    >
      <div
        class="flex flex-row justify-between items-center px-3 py-3 text-slate-900 border border-solid border-slate-300 border-l-0 border-r-0 border-t-0 text-lg"
      >
        <span>{{ title }}</span>
        <span
          @click="$emit('cancel', false)"
          class="material-symbols-outlined cursor-pointer text-slate-900 hover:text-red-500"
          title="Đóng"
        >
          close
        </span>
      </div>
      <div class="flex flex-col my-5 mx-3">
        <div>
          <div class="flex flex-col text-slate-900">
            <label for="name" class="-mt-2.5 flex items-center"
                >Tên bằng cấp<span class="text-red-500 text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
            <FSelect
              class="w-full text-md"
              :options="diplomaList"
              :title="const_dl"
              :modelValue="const_dl"
              @update:modelValue="
                (value) => {
                  itemAdd.diploma = value;
                }
              "
              :active-search="true"
            />
          </div>
          <button
            @click="$emit('submit')"
            class="text-white border border-solid border-green-500 bg-green-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:shadow-lg hover:shadow-yellow-500 mt-5"
          >
            Thêm
          </button>
        </div>
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
} from "../common/index";

const props = defineProps({
  itemAdd: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: true,
  }
})
onBeforeMount(async () => {
  diplomaList.value = await http_getAll(Diploma);
});
</script>
