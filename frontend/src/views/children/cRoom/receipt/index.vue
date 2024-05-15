<template>
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
        class="flex-1 ml-5"
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
      <FSelect
        class="w-52 text-md ml-5"
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
      'Mã trẻ',
      'Tên trẻ',
      'Tổng tiền',
      'Ngày bắt đầu thu',
      'Ngày kết thúc thu',
      'Ngày đóng',
      'Trạng thái',
    ]"
    :labels="[
      'children_id',
      'child_name',
      'total_format',
      'startDate_format',
      'endDate_format',
      'datePerForm_format',
      'status_format',
    ]"
    :mode="mode"
    :startRow="startRow"
    :show-action="[true, false, false]"
    @delete="(value) => remove(value)"
    @edit="
      async (value) => {
        item = items.filter((item) => item._id == value);
        item = item[0];
        edit();
      }
    "
  />
  <Pagination
    :numberOfPages="numberOfPages"
    :totalRow="totalRow"
    :startRow="startRow"
    :endRow="endRow"
    v-model:currentPage="currentPage"
  />
  <FormReceipt
    v-if="activeAdd"
    :item="itemAdd"
    :title="`Add new receipts`"
    @cancel="
      (value) => {
        activeAdd = value;
        itemAdd = {
          schoolYear: '',
          dateStart: '',
          dateEnd: '',
        };
      }
    "
    @submit="create()"
  />
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
  const_st,
  statusList,
  statusValue,
  resetFilter,
  reset,
} from "../../../../components/common/index";

const itemAdd = ref({
  schoolYear: "",
  dateStart: "",
  dateEnd: "",
});

searchOption.value = [{ _id: "_child_name", name: "Tìm kiếm theo tên trẻ" }];

const props = defineProps({
  classId: {
    type: String,
    required: true,
  },
});

const create = async () => {
  const result = await http_create(Receipt, itemAdd.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    refresh();
    run_alert(alert_success(result.message));
    activeAdd.value = false;
    itemAdd.value = {
      schoolYear: "",
      dateStart: "",
      dateEnd: "",
    };
  }
};

const edit = async () => {
  const result = await http_update(Receipt, item.value._id, item.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    refresh();
  }
};

const remove = async (item) => {
  const deleteList = items.value.filter((item) => item.checked);
  if (deleteList.length != 0) {
    const isRemove = await alert_remove(
      deleteList,
      ["Children", "Class", "Total", "Status"],
      ["child_name", "class_name", "total_format", "status_format"],
      "50%"
    );
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(Receipt, item._id);
      }
    });
    if (isRemove) {
      run_alert(alert_success("Successfully deleted."));
      refresh();
    }
  }
  if (deleteList.length == 0) {
    const isRemove = await alert_remove(
      [item],
      ["Children", "Class", "Total", "Status"],
      ["child_name", "class_name", "total_format", "status_format"],
      "50%"
    );
    if (isRemove) {
      const result = await http_deleteOne(Receipt, item._id);
      if (!result.error) {
        run_alert(alert_success(result.message));
        refresh();
      }
    }
  }
};

const refresh = async () => {
  item.value = await http_getOne(Classes, props.classId);
  item.value = item.value[0];
  items.value = item.value.receipt;
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    child_name: item.child.name,
    children_id: item.child._id,
    _child_name: item.child.name,
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
};

const filtered = async () => {
  await refresh();
  filters();
  currentPage.value = 1;
};

onBeforeMount(async () => {
  reset();
  await refresh();
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
