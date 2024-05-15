<template>
  <div
    class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
  >
    <div class="bg-slate-900 h-screen opacity-70 flex-1 relative"></div>
    <div
      class="bg-white mx-5 w-4/12 overflow-auto absolute rounded-md shadow-xl border border-solid border-slate-300"
      style="min-height: 100px; max-height: 100vh"
    >
      <div
        class="flex flex-row justify-between items-center px-3 py-3 text-slate-900 border border-solid border-slate-300 border-l-0 border-r-0 border-t-0 text-lg"
      >
        <span>{{ title }}</span>
        <span
          @click="$emit('cancel', false)"
          class="material-symbols-outlined cursor-pointer text-slate-900 hover:text-red-500"
        >
          close
        </span>
      </div>
      <div class="flex flex-col my-5 mx-3">
        <div>
          <!-- classes -->
          <div v-if="type == 'changeStatus'" class="flex flex-col text-slate-900">
            <label for="" class="flex mb-2 items-center"
              >Trạng thái<span class="text-red-500 text-3xl relative ml-0.5"
                >*</span
              ></label
            >
            <div class="flex items-center">
              <input
                type="radio"
                id="x"
                name="gender"
                value="đang học"
                v-model="itemAdd.status"
                class="mr-2"
                :checked="itemAdd.status == 'đang học'"
              />
              <label for="x" class="mr-4 mt-1">đang học</label>
              <input
                type="radio"
                id="y"
                name="gender"
                value="tạm ngưng học"
                v-model="itemAdd.status"
                class="mr-2"
                :checked="itemAdd.status == 'tạm ngưng học'"
              />
              <label for="y" class="mt-1 mr-4">tạm ngưng học</label>
              <input
                type="radio"
                id="z"
                name="gender"
                value="hoàn thành"
                v-model="itemAdd.status"
                class="mr-2 ml-2"
                :checked="itemAdd.status == 'hoàn thành'"
              />
              <label for="z" class="mt-1">hoàn thành</label>
            </div>
          </div>
          <div
            v-if="type != 'changeStatus'"
            class="flex flex-col text-slate-900"
          >
            <label for="" class="-mt-2.5 flex items-center"
              >Chuyến đến nhà trẻ<span class="text-red-500 text-3xl relative ml-0.5"
                >*</span
              ></label
            >
            <FSelect
              class=""
              :options="childcareCenter"
              @update:modelValue="(value) => (itemAdd.childcareCenter = value)"
            />
            <p
              v-if="!itemAdd.childcareCenter"
              class="text-red-500 mt-2 ml-0.5 text-sm"
            >
              Đây là trường bắt buộc.
            </p>
          </div>
          <button
            @click="$emit('submit')"
            class="text-white border border-solid border-yellow-500 bg-yellow-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:shadow-lg mt-5 hover:shadow-yellow-500"
          >
            Cập nhật
          </button>
          <!-- </Form> -->
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
  ChildcareCenter,
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
} from "../common/index.js";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  itemAdd: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    default: "changeStatus",
  },
});
const childcareCenter = ref([]);

onBeforeMount(async () => {
  const temp = sessionStorage.getItem("owner_childcareCenter");
  childcareCenter.value = await ChildcareCenter.getAll();
  childcareCenter.value = childcareCenter.value.filter(i => i._id != temp)
});
</script>
