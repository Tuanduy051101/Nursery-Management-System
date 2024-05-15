<template>
  <!-- Header -->
  <p class="text-blue-700 text-base mx-5 mt-5">Bộ lọc tìm kiếm</p>
  <div class="flex justify-center items-center my-5">
    <FSelect
      class="w-full ml-5 text-md"
      :options="monthList"
      :modelValue="temp_month"
      :title="const_mo"
      @update:modelValue="
        (value) => {
          monthValue = value;
          filtered();
        }
      "
      @refresh="
        async () => {
          monthValue = const_mo;
          await filtered();
        }
      "
      :showClose="true"
    />
    <inputDate
      class="w-full text-md mx-5"
      :modelValue="const_height"
      :title="const_height"
      @submit="
        (value) => {
          heightValue = value;
          filtered();
        }
      "
      @refresh="
        async () => {
          heightValue = const_height;
          await filtered();
        }
      "
      :showClose="true"
      :type="`number`"
      :placeholder="`Chiều cao`"
    />
    <inputDate
      class="w-full text-md"
      :modelValue="const_weight"
      :title="const_weight"
      @submit="
        (value) => {
          weightValue = value;
          filtered();
        }
      "
      @refresh="
        async () => {
          weightValue = const_weight;
          await filtered();
        }
      "
      :showClose="true"
      :type="`number`"
      :placeholder="`Cân nặng`"
    />
    <inputDate
      class="w-full text-md mx-5"
      :modelValue="const_rose"
      :title="const_rose"
      @submit="
        (value) => {
          roseValue = value;
          filtered();
        }
      "
      @refresh="
        async () => {
          roseValue = const_rose;
          await filtered();
        }
      "
      :showClose="true"
      :type="`number`"
      :placeholder="`Bông hồng`"
    />
  </div>
  <div class="border border-solid border-slate-300 border-t-0"></div>
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
      <FSearch
        class="flex-1 h-full ml-5"
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
    <div class="flex-1 flex justify-end">
      <button
        @click="activeAdd = true"
        class="h-10 border border-solid border-blue-500 bg-blue-500 px-3 mr-5 text-white rounded-md hover:border-2 hover:shadow-lg hover:shadow-yellow-500/50"
        type="button"
      >
        Thêm
      </button>
      <button
        v-if="activeEdit == true"
        class="border border-solid border-orange-500 bg-orange-500 px-3 text-white rounded-md hover:shadow-lg hover:shadow-yellow-500/50"
        type="button"
        @click="edit"
      >
        Lưu
      </button>
      <button
        v-if="activeEdit == false"
        class="border border-solid border-yellow-500 bg-yellow-500 px-3 text-white rounded-md hover:shadow-lg hover:shadow-yellow-500/50"
        type="button"
        @click="activeEdit = true"
      >
        Cập nhật
      </button>
    </div>
  </div>
  <Table
    :items="setPages"
    :fields="[
      'Mã trẻ',
      'Tên trẻ',
      'Chiều cao (cm)',
      'Cân nặng (kg)',
      'Sức khoẻ',
      'Bông hồng',
      'Ghi chú',
    ]"
    :labels="
      activeEdit
        ? [
            'children_id',
            'child_name',
            'height',
            'weight',
            'health',
            'roses',
            'note',
          ]
        : [
            'children_id',
            'child_name',
            'heightValue',
            'weightValue',
            'healthValue',
            'roseValue',
            'noteValue',
          ]
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
  <FormCDI
    v-if="activeAdd"
    :itemAdd="itemAdd"
    :title="`Thêm chỉ số phát triển mới`"
    @cancel="(value) => (activeAdd = value)"
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
  FormCDI,
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
  monthList,
  monthValue,
  const_mo,
  const_height,
  const_weight,
  const_rose,
  const_health,
  heightValue,
  weightValue,
  roseValue,
  healthValue,
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

const itemAdd = ref({
  month: "",
  children: "",
  classes: "",
});

searchOption.value = [
  { _id: "_child_name", name: "Tìm kiếm theo tên trẻ" },
  { _id: "health", name: "Tìm kiếm theo chí số sức khoẻ" },
];

const create = async () => {
  itemAdd.value.classes = props.classId;
  const result = await http_create(CDI, itemAdd.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    activeAdd.value = false;
    itemAdd.value.month = "";
    refresh();
  }
};

const edit = async () => {
  items.value.forEach(async (value) => {
    const result = await http_update(CDI, value._id, {
      height: value.height.toString(),
      weight: value.weight.toString(),
      roses: value.roses.toString(),
      health: value.health.toString(),
      note: value.note.toString(),
    });
  });
  activeEdit.value = false;
  run_alert(alert_success(`Đã lưu thành công.`));
  refresh();
};

const filtered = async () => {
  await refresh();
  filters();
  currentPage.value = 1;
};

const temp_month = ref(null);
const temp_session = ref("");

const refresh = async () => {
  if (props.classId) {
    item.value = await http_getOne(Classes, props.classId);
    item.value = item.value[0];
    items.value = item.value.cdi.map((value) => ({
      ...value,
      child_name: value.child.name,
      children_id: value.child._id,
      parent_name: value.child.parentDetails[0].name,
      _child_name: value.child.name,
      child_gender: value.child.gender == true ? "name" : "nữ",
      month_name: value.month.name,
      heightValue: value.height,
      weightValue: value.weight,
      roseValue: value.roses,
      healthValue: value.health,
      noteValue: value.note,
    }));
    itemAdd.value.children = item.value.children.map((item) => item._id);
    filters();
  }
};

onBeforeMount(async () => {
  reset();
  monthList.value = await http_getAll(Month);
  await refresh();
  if (items.value.length != 0) {
    monthValue.value = items.value[items.value.length - 1].month._id;
    temp_month.value =
      items.value[items.value.length - 1].month.name.toString();
    filters();
  }
});
</script>
