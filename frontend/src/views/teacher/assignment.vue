<template>
  <div class="border-t border-solid border-slate-300">
    <!-- Header -->
    <div class="flex items-center justify-between my-5 mx-5">
      <div class="w-6/12 flex">
        <FSelect
          style="width: 110px"
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
      <div class="flex-1 flex justify-end">
        <!-- <FSearch
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
        /> -->
        <FSelect
          class="w-40 ml-5 text-md"
          :options="schoolYearList"
          :modelValue="const_sy"
          :title="const_sy"
          @update:modelValue="
            (value) => {
              schoolYearValue = value;
              filtered();
            }
          "
          @refresh="
            async () => {
              schoolYearValue = const_sy;
              await filtered();
            }
          "
          :showClose="true"
        />
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="['Tên lớp', 'Khối học', 'Năm học', 'Nhiệm vụ', 'Ghi chú']"
      :labels="['class_name','grade_name', 'school_name', 'duty_name', 'noteValue']"
      :wrap-list="[false, false, false, true, false]"
      :mode="mode"
      :startRow="startRow"
      :show-action="[true, false, false]"
      :action-list="['ClassRoom.view']"
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
  FormAddDiploma,
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
  const_sy,
  const_gr,
  const_tf,
  const_ge,
  const_ag,
  filters,
  reset,
} from "../../components/common/index";

const props = defineProps({
  assignmentList: {
    type: Array,
    required: true,
    default: [],
  },
  teacher_id: {
    type: String,
    required: true,
  },
});

searchOption.value = [{ _id: "name", name: "Search by name" }];

const refresh = async () => {
  if (props.assignmentList || props.teacher_id) {
    items.value = props.assignmentList;
    items.value = items.value.map((item) => ({
      ...item,
      checked: false,
      _id: item.classes._id,
      class_name: item.classes.name,
      grade_name: item.classes.grade.name,
      school_name: item.classes.schoolYear.name,
      duty_name: item.duty.name,
      schoolYear_id: item.classes.schoolYear._id,
      noteValue: item.note,
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
  schoolYearList.value = await http_getAll(SchoolYear);
});
</script>
