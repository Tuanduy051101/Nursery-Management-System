<template>
  <!-- Header -->
  <p class="text-blue-700 text-base mx-5 mt-5">Bộ lọc tìm kiếm</p>
  <div class="flex justify-center items-center my-5 mx-5">
    <FSelect
      v-if="isToken"
      class="w-full text-md mr-5"
      :options="childcareCenterList"
      :modelValue="temp_childcareCenter"
      :title="const_childcareCenter"
      @update:modelValue="
        async (value) => {
          childcareCenterValue = value;
          await filtered1();
          schoolYearList = await http_getAll(SchoolYear);
          schoolYearList = schoolYearList.filter(
            (i) => i.childcareCenter._id == childcareCenter
          );
        }
      "
      @refresh="
        async () => {
          childcareCenterValue = const_childcareCenter;
          await filtered1();
        }
      "
      :showClose="true"
    />
    <FSelect
      class="w-full text-md"
      :options="schoolYearList"
      :modelValue="const_sy"
      :title="const_sy"
      @update:modelValue="
        async (value) => {
          schoolYearValue = value;
          await filtered1();
        }
      "
      @refresh="
        async () => {
          schoolYearValue = const_sy;
          await filtered1();
        }
      "
      :showClose="true"
    />
    <FSelect
      class="w-full mx-5 text-md"
      :options="gradeList"
      :modelValue="const_gr"
      :title="const_gr"
      @update:modelValue="
        async (value) => {
          gradeValue = value;
          await filtered1();
        }
      "
      @refresh="
        async () => {
          gradeValue = const_gr;
          await filtered1();
        }
      "
      :showClose="true"
    />
    <FSelect
      class="w-full text-md"
      :options="statusList"
      :modelValue="const_st"
      :title="const_st"
      @update:modelValue="
        (value) => {
          statusValue = value;
          filtered1();
        }
      "
      @refresh="
        async () => {
          statusValue = const_st;
          await filtered1();
        }
      "
      :showClose="true"
    />
  </div>
  <div class="border border-solid my-5 border-slate-300 border-b-0"></div>
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
    </div>
    <div class="flex-1 flex flex-row-reverse">
      <button
        @click="activeEdit = !activeEdit"
        class="border border-solid ml-5 border-yellow-500 bg-yellow-500 px-5 text-white rounded-md hover:shadow-lg hover:shadow-yellow-500/50"
        type="button"
      >
        Cập nhật
      </button>
      <button
        @click="activeAdd = true"
        class="border border-solid h-10 ml-5 border-blue-500 bg-blue-500 px-5 text-white rounded-md hover:shadow-lg hover:shadow-yellow-500/50"
        type="button"
      >
        Thêm
      </button>
    </div>
  </div>
  <Table
    :items="setPages"
    :fields="[
      'Mã trẻ',
      'Tên trẻ',
      'Lớp học',
      'Tổng tiền',
      'Ngày bắt đầu thu',
      'Ngày kết thúc thu',
      'Trạng thái',
    ]"
    :labels="
      activeEdit
        ? [
            'children_id',
            'child_name',
            'class_name',
            'total_format',
            'startDate_format',
            'endDate_format',
            'status',
          ]
        : [
            'children_id',
            'child_name',
            'class_name',
            'total_format',
            'startDate_format',
            'endDate_format',
            'statusValue',
          ]
    "
    :mode="mode"
    :startRow="startRow"
    :show-action="[true, activeEdit ? true : false, true]"
    @delete="(value) => remove(value)"
    @edit="
      async (value) => {
        item = items.filter((item) => item._id == value);
        item = item[0];
        edit();
      }
    "
    :action-list="[
      role == 'kế toán' ? 'Receipt-accounting.view' : 'Receipt.view',
    ]"
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
    :title="`Thêm phiếu thu học phí`"
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
  ChildcareCenter,
  verifyToken,
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
  resetFilter,
  reset,
  const_childcareCenter,
  childcareCenterValue,
  childcareCenterList,
} from "../../../components/common/index.js";

const itemAdd = ref({
  schoolYear: "",
  dateStart: "",
  dateEnd: "",
});

const role = ref("");
role.value = sessionStorage.getItem("role");

searchOption.value = [
  { _id: "children_id", name: "Tìm kiếm theo mã trẻ" },
  { _id: "_child_name", name: "Tìm kiếm theo tên trẻ" },
];

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
    activeEdit.value = false;
  }
};

const remove = async (item) => {
  const deleteList = items.value.filter((item) => item.checked);
  if (deleteList.length != 0) {
    const isRemove = await alert_remove(
      deleteList,
      ["Tên trẻ", "Lớp học", "Tổng số tiền", "Trạng thái"],
      ["child_name", "class_name", "total_format", "status_format"],
      "50%"
    );
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(Receipt, item._id);
      }
    });
    if (isRemove) {
      run_alert(alert_success("Đã xoá thành công."));
      refresh();
    }
  }
  if (deleteList.length == 0) {
    const isRemove = await alert_remove(
      [item],
      ["Tên trẻ", "Lớp học", "Tổng số tiền", "Trạng thái"],
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
  items.value = await http_getAll(Receipt);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    child_name: item.child.name,
    children_id: item.child._id,
    _child_name: item.child.name,
    class_name: item.classes.name,
    grade_id: item.classes.grade._id,
    schoolYear_id: item.classes.schoolYear._id,
    childcareCenterId: item.classes.schoolYear.childcareCenter,
    total_format: formatCurrencyVND(item.total),
    startDate_format: formatDate(item.dateStart),
    endDate_format: formatDate(item.dateEnd),
    datePerForm_format:
      item.datePerForm != "chưa thanh toán"
        ? formatDate(item.datePerForm)
        : "chưa thanh toán",
    status_format: item.status == "true" ? "đã thanh toán" : "chưa thanh toán",
    statusValue: item.status == "true" ? "đã thanh toán" : "chưa thanh toán",
  }));
  items.value = items.value.filter(
    (i) => i.classes.schoolYear.childcareCenter == childcareCenter.value
  );
};

const refreshFilter = async () => {
  items.value = await http_getAll(Receipt);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    child_name: item.child.name,
    children_id: item.child._id,
    _child_name: item.child.name,
    class_name: item.classes.name,
    grade_id: item.classes.grade._id,
    schoolYear_id: item.classes.schoolYear._id,
    childcareCenterId: item.classes.schoolYear.childcareCenter,
    total_format: formatCurrencyVND(item.total),
    startDate_format: formatDate(item.dateStart),
    endDate_format: formatDate(item.dateEnd),
    datePerForm_format:
      item.datePerForm != "chưa thanh toán"
        ? formatDate(item.datePerForm)
        : "chưa thanh toán",
    status_format: item.status == "true" ? "đã thanh toán" : "chưa thanh toán",
    statusValue: item.status == "true" ? "đã thanh toán" : "chưa thanh toán",
  }));
};

const filtered = async () => {
  await refresh();
  filters();
  currentPage.value = 1;
};

const filtered1 = async () => {
  await refreshFilter();
  filters();
  currentPage.value = 1;
};

const temp_childcareCenter = ref("");
const isToken = ref("");
const childcareCenter = ref(sessionStorage.getItem("owner_childcareCenter"));
const childcareCenterName = ref(
  sessionStorage.getItem("owner_childcareCenterName")
);

onBeforeMount(async () => {
  isToken.value = await verifyToken();
  reset();
  await refresh();
  childcareCenterValue.value = childcareCenter.value;
  temp_childcareCenter.value = childcareCenterName.value;
  items.value = items.value.filter(
    (i) => i.classes.schoolYear.childcareCenter == childcareCenter.value
  );
  childcareCenterList.value = await http_getAll(ChildcareCenter);
  backup_items();
  gradeList.value = await http_getAll(Grade);
  schoolYearList.value = await http_getAll(SchoolYear);
  schoolYearList.value = schoolYearList.value.filter(
    (i) => i.childcareCenter._id == childcareCenter.value
  );
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
