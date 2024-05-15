<template>
  <!-- Header -->
  <p class="text-blue-700 text-base mx-5 mt-5">Bộ lọc tìm kiếm</p>
  <div class="flex justify-between items-center my-5 mx-5">
    <inputDate
      class="w-full text-md"
      :modelValue="temp_date"
      :title="const_da"
      @submit="
        (value) => {
          dateValue = value;
          filtered();
        }
      "
      @refresh="
        async () => {
          dateValue = const_da;
          // dateValue = format_input(new Date());
          // temp_date = dateValue;
          await filtered();
        }
      "
      :showClose="true"
    />
    <FSelect
      class="w-full ml-5 text-md"
      :options="sessionList"
      :modelValue="temp_session"
      :title="const_se"
      @update:modelValue="
        (value) => {
          sessionValue = value;
          filtered();
        }
      "
      @refresh="
        async () => {
          sessionValue = const_se;
          await filtered();
        }
      "
      :showClose="true"
    />
    <FSelect
      class="w-full ml-5 text-md"
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
  <div class="border border-solid my-5 border-slate-300 border-b-0"></div>
  <div v-if="item?.name" class="flex items-center justify-between my-5 mx-5">
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
      <FSearch
        class="flex-1 ml-5 h-full"
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
      <!-- <input
        type="date"
        v-model="date"
        class="w-40 bg-inherit flex items-center border border-solid border-slate-600 rounded-md px-2 text-slate-300 focus:border-slate-300"
      /> -->
    </div>
    <div class="flex-1 flex justify-end h-full">
      <button
        v-if="role == 'System Administration'"
        @click="activeAdd = true"
        class="h-10 border border-solid border-blue-500 bg-blue-500 px-3 text-white rounded-md hover:shadow-lg hover:shadow-yellow-500/50"
        type="button"
      >
        Thêm buổi
      </button>
      <button
        @click="_activeAdd = true"
        class="border h-10 border-solid border-blue-500 px-3 bg-blue-500 text-white rounded-md hover:shadow-lg hover:shadow-yellow-500/50 mx-5"
        type="button"
      >
        Thêm điểm danh
      </button>
      <button
        v-if="activeEdit == true"
        class="border border-solid border-orange-500 bg-orange-500 px-3 text-white rounded-md hover:shadow-lg hover:shadow-yellow-500/50"
        type="button"
        @click="edit"
      >
        Lưu điểm danh
      </button>
      <button
        v-if="activeEdit == false"
        class="border border-solid border-yellow-500 bg-yellow-500 px-3 text-white rounded-md hover:shadow-lg hover:shadow-yellow-500/50"
        type="button"
        @click="activeEdit = true"
      >
        Cập nhật điểm danh
      </button>
    </div>
  </div>
  <Table
    :items="setPages"
    :fields="['Tên trẻ', 'Giới tính', 'Trạng thái', 'Lý do']"
    :labels="
      activeEdit
        ? ['child_name', 'child_gender', 'status', 'reason']
        : ['child_name', 'child_gender', 'statusValue', 'reasonValue']
    "
    :wrap-list="[false, false, false, false, false, true]"
    :mode="mode"
    :showAction="[false, false, false]"
    :startRow="startRow"
  />
  <Pagination
    :numberOfPages="numberOfPages"
    :totalRow="totalRow"
    :startRow="startRow"
    :endRow="endRow"
    v-model:currentPage="currentPage"
  />
  <FormSession
    v-if="activeAdd"
    :itemAdd="itemAdd"
    :title="`Thêm buổi mới`"
    @cancel="(value) => (activeAdd = value)"
    @submit="create_session()"
  />
  <FormAttendance
    v-if="_activeAdd"
    :itemAdd="_itemAdd"
    :title="`Thêm điểm danh mới`"
    @cancel="(value) => (_activeAdd = value)"
    @submit="create_attendance()"
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
  FormSession,
  FormAttendance,
  inputDate,
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
  formatDateReverse,
  format_input,
  getpreviousDate,
  Session,
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
  const_da,
  const_st,
  const_se,
  dateValue,
  sessionList,
  sessionValue,
  statusList,
  statusValue,
  resetFilter,
  reset,
  getHours,
} from "../../../../components/common/index.js";

const props = defineProps({
  classId: {
    type: String,
    required: true,
  },
});
const role = ref("");
role.value = sessionStorage.getItem("role");
const _activeAdd = ref(false);
const itemAdd = ref({
  name: "",
  startTime: "",
  endTime: "",
});

const _itemAdd = ref({
  date: formatDateReverse(),
  session: "",
  children: "",
  classes: "",
});

searchOption.value = [{ _id: "_child_name", name: "Tìm kiếm theo tên trẻ" }];

const create_session = async () => {
  const result = await http_create(Session, itemAdd.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    activeAdd.value = false;
    itemAdd.value = {
      name: "",
      startTime: "",
      endTime: "",
    };
    sessionList.value = await http_getAll(Session);
    await refresh();
  }
};

const create_attendance = async () => {
  _itemAdd.value.classes = props.classId;
  const result = await http_create(Attendance, _itemAdd.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    await refresh();
    run_alert(alert_success(result.message));
    _activeAdd.value = false;
    _itemAdd.value.session = "";
  }
};

const edit = async () => {
  items.value.forEach(async (value) => {
    const result = await http_update(Attendance, value._id, {
      reason: value.reason,
      present: value.status,
    });
  });
  activeEdit.value = false;
  run_alert(alert_success(`Đã lưu thành công.`));
  await refresh();
};

const filtered = async () => {
  await refresh();
  filters();
  currentPage.value = 1;
};

const refresh = async () => {
  if (props.classId) {
    item.value = await http_getOne(Classes, props.classId);
    item.value = item.value[0];
    items.value = item.value.attendance.map((value) => ({
      ...value,
      child_name: value.child.name,
      _child_name: value.child.name,
      child_gender: value.child.gender == true ? "name" : "nữ",
      status: value.present,
      statusValue: value.present == "false" ? "vắng mặt" : "có mặt",
      reason: value.reason,
      reasonValue: value.reason,
      date_format: formatDate(value.date),
      session_format: `${value.session.startTime} - ${value.session.endTime} ( ${value.session.name} )`,
    }));
    filters();

    _itemAdd.value.children = item.value.children.map((item) => item._id);
  }
};

const temp_date = ref("");
const temp_session = ref("");
const childcareCenter = ref(sessionStorage.getItem("owner_childcareCenter"));

onBeforeMount(async () => {
  reset();
  dateValue.value = format_input(new Date());
  temp_date.value = dateValue.value;
  await refresh();
  if (props.classId) {
    const temp = await http_getOne(Classes, props.classId);
    while (items.value.length == 0 && temp[0].attendance.length != 0) {
      dateValue.value = getpreviousDate(temp_date.value);
      temp_date.value = dateValue.value;
      await refresh();
    }
  }
  sessionList.value = await http_getAll(Session);
  sessionList.value = sessionList.value.filter((i) =>
    i.childcareCenter.some(
      (j) => j._id == sessionStorage.getItem("owner_childcareCenter")
    )
  );
  let hoursCurent = parseInt(getHours());
  do {
    console.log(sessionList.value[0]);
    const temp = sessionList.value.filter(
      (i) => i.startTime.split(":")[0] == hoursCurent.toString()
    );
    if (temp.length == 1) {
      sessionValue.value = temp[0]._id;
      temp_session.value = `${temp[0].startTime} - ${temp[0].endTime} ( ${temp[0].name})`;
      filters();
    } else {
      if (hoursCurent > 21) {
        sessionValue.value =
          sessionList.value[sessionList.value.length - 1]._id;
        temp_session.value = `${
          sessionList.value[sessionList.value.length - 1].startTime
        } - ${sessionList.value[sessionList.value.length - 1].endTime} ( ${
          sessionList.value[sessionList.value.length - 1].name
        })`;
        filters();
      } else {
        hoursCurent += 1;
      }
    }
  } while (temp_session.value.length == 0);
  sessionList.value = sessionList.value.map((item) => ({
    _id: item._id,
    name: `${item.startTime} - ${item.endTime} ( ${item.name} )`,
  }));
  statusList.value = [
    {
      _id: "true",
      name: "có mặt",
    },
    {
      _id: "false",
      name: "vắng mặt",
    },
  ];
});
</script>
