<template>
  <div
    v-if="items[0]?.class_name"
    class="border border-solid border-slate-600 rounded-md"
  >
    <!-- Header -->
    <div class="flex items-center justify-between my-5 mx-5">
      <div class="w-6/12 flex">
        <FSelect
          style="width: 105px"
          :options="option_entry"
          :modelValue="entryValue"
          :title="`Record`"
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
        <FSelect
          class="w-28 mx-5"
          :options="option_mode"
          :modelValue="`auto`"
          :title="`Display`"
          v-model="mode"
        />
      </div>
      <div class="flex-1 flex justify-end">
        <FSelect
          class="w-52 text-md"
          :options="statusList"
          :modelValue="const_st"
          :title="const_st"
          @update:modelValue="
            (value) => {
              statusValue = value;
              filtered();
            }
          "
          @refresh="
            async () => {
              statusValue = const_st;
              await filtered();
            }
          "
          :showClose="true"
        />
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="[
        'Class',
        'Total',
        'Start Day',
        'End Day',
        'Make Date',
        'Status',
      ]"
      :labels="[
        'class_name',
        'total_format',
        'startDate_format',
        'endDate_format',
        'datePerForm_format',
        'status',
      ]"
      :mode="mode"
      :startRow="startRow"
      :show-action="[true, false, false]"
      :action-list="['Receipt.view']"
      :show-checkbox="false"
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
  const_st,
  statusList,
  statusValue,
  classValue,
  classList,
  const_cl,
} from "../../../components/common/index";

searchOption.value = [{ _id: "_child_name", name: "Search by child's name" }];

const props = defineProps({
  receiptList: {
    type: Array,
    required: true,
  },
  classList: {
    type: Array,
    required: true,
  },
});

const _id = ref("");
_id.value = sessionStorage.getItem("owner_id");

const refresh = async () => {
  const children = await http_getOne(Children, _id.value);
  items.value = children.receipt;
  items.value = items.value.map((item) => ({
    ...item,
    class_name: item.classes.name,
    total_format: formatCurrencyVND(item.total),
    startDate_format: formatDate(item.dateStart),
    endDate_format: formatDate(item.dateEnd),
    datePerForm_format:
      item.datePerForm != "chưa thanh toán"
        ? formatDate(item.datePerForm)
        : "chưa thanh toán",
    status_format: item.status == "true" ? "đã thanh toán" : "chưa thanh toán",
  }));

  classList.value = children.classes;
};

const filtered = async () => {
  await refresh();
  filters();
};

onBeforeMount(async () => {
  if (_id.value.length > 0) {
    await refresh();
  }
  statusList.value = [
    {
      _id: "true",
      name: "đã thanh toán",
    },
    {
      _id: "false",
      name: "chưa thanh toán",
    },
  ];
});
</script>
