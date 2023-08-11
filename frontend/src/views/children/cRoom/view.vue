<template>
  <div
    v-if="item?.name"
    class="border border-solid border-slate-600 rounded-md mb-5"
  >
    <div class="flex justify-end mx-5 my-5 text-slate-600">
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 6 ? 'border-2 border-slate-300 text-slate-300' : ''
        "
        @click="actionPage = 6"
      >
        Information
      </div>
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 1 ? 'border-2 border-slate-300 text-slate-300' : ''
        "
        @click="actionPage = 1"
      >
        Children
      </div>
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 2
            ? 'border-2 border-slate-300 text-slate-300'
            : 'border-l-0 border-r-0'
        "
        @click="actionPage = 2"
      >
        CDI
      </div>
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 3 ? 'border-2 border-slate-300 text-slate-300' : ''
        "
        @click="actionPage = 3"
      >
        Receipt
      </div>
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 4 ? 'border-2 border-slate-300 text-slate-300' : ''
        "
        @click="actionPage = 4"
      >
        Meal Ticket
      </div>
      <div
        class="border border-solid border-slate-600 px-4 py-1 hover:text-slate-300 cursor-pointer flex items-center"
        :class="
          actionPage == 5 ? 'border-2 border-slate-300 text-slate-300' : ''
        "
        @click="actionPage = 5"
      >
        Attendance
      </div>
    </div>
    <div class="border border-solid border-slate-600 border-b-0"></div>
    <div v-if="actionPage == 6 && item?.name" class="flex justify-start mb-5">
      <div class="px-5">
        <div class="flex text-slate-300 mt-5">
          <!-- class info -->
          <div class="flex mx-5">
            <div class="flex-col">
              <p class="">
                ClassName: <span class="text-blue-500">{{ item.name }}</span>
              </p>
              <p class="">
                Grade: <span class="text-blue-500">{{ item.grade.name }}</span>
              </p>
            </div>
            <div class="flex-col ml-10">
              <p class="">
                School Year:
                <span class="text-blue-500">{{ item.schoolYear.name }}</span>
              </p>
              <p class="">
                Total Children:
                <span class="text-blue-500">{{ item.children.length }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Table
      :items="item.assignment.teacher"
      :fields="['Teacher', 'phone', 'email', 'address']"
      :labels="['name', 'phone', 'email', 'address']"
      :showAction="[true, false, false]"
      v-if="actionPage == 6 && item?.name"
      :showCheckbox="false"
    />
    <div v-if="actionPage == 6" class="mb-5"></div>
    <!-- children -->
    <ChildrenList
      v-if="actionPage == 1"
      :classId="item._id"
      :children="item.children"
    />
    <CDIList v-if="actionPage == 2" :cdiL="item.cdiL" :classId="item._id" />
    <MealTicketList v-if="actionPage == 4" :classId="item._id" />
    <AttendanceList v-if="actionPage == 5" :classId="item._id" />
    <ReceiptList v-if="actionPage == 3" :classId="item._id" />
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
} from "../../../components/common/index.js";

const actionPage = ref(6);
const actionList = ref([1, 2, 3, 4, 5, 6]);
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const refresh = async () => {
  if (props.id) {
    item.value = await http_getOne(Classes, props.id);
    item.value = item.value[0];
  }
};

onBeforeMount(async () => {
  await refresh();
});
</script>
