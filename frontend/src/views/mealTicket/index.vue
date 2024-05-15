<template>
  <div class="border border-solid border-slate-300 rounded-md">
    <!-- Header -->
    <p class="text-blue-500 text-base mx-5 mt-5">Bộ lọc tìm kiếm</p>
    <div class="flex justify-center items-center ml-5 my-5" v-if="isToken">
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
    </div>
    <div class="flex justify-center items-center mx-5 my-5">
      <FSelect
        class="w-full text-md"
        :options="schoolYearList"
        :modelValue="const_sy"
        :title="const_sy"
        @update:modelValue="
          async (value) => {
            schoolYearValue = value;
            schoolYear_id = value;
            await filtered1();
          }
        "
        @refresh="
          async () => {
            schoolYearValue = const_sy;
            schoolYear_id = const_sy;
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
        :disabled="schoolYearValue == const_sy ? true : false"
      />
      <FSelect
        class="w-full text-md"
        :options="classList"
        :modelValue="const_cl"
        :title="const_cl"
        @update:modelValue="
          async (value) => {
            classValue = value;
            await filtered1();
          }
        "
        @refresh="
          async () => {
            classValue = const_cl;
            await filtered1();
          }
        "
        :showClose="true"
        :disabled="
          schoolYearValue == const_sy || gradeValue == const_gr ? true : false
        "
      />
    </div>
    <div class="flex justify-between items-center my-5 mx-5">
      <inputDate
        class="w-full text-md"
        :modelValue="temp_date"
        :title="const_da"
        @submit="
          (value) => {
            dateValue = value;
            filtered1();
          }
        "
        @refresh="
          async () => {
            dateValue = const_da;
            await filtered1();
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
            filtered1();
          }
        "
        @refresh="
          async () => {
            sessionValue = const_se;
            await filtered1();
          }
        "
        :showClose="true"
      />
      <FSelect
        class="w-full ml-5 text-md"
        :options="evaluateList"
        :modelValue="const_evaluate"
        :title="const_evaluate"
        @update:modelValue="
          (value) => {
            evaluateValue = value;
            filtered1();
          }
        "
        @refresh="
          async () => {
            evaluateValue = const_evaluate;
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
        <!-- <FSelect
          class="w-28 mx-5"
          :options="option_mode"
          :modelValue="`auto`"
          :title="`Display`"
          v-model="mode"
        /> -->
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
      </div>
      <div class="flex-1 flex justify-end">
        <div
          @click="checkViewMany()"
          class="border-2 h-10 border-solid bg-gray-500 border-gray-500 cursor-pointer rounded-md ml-5 flex items-center px-5 text-lg text-slate-300 hover:shadow-lg hover:shadow-yellow-500/50"
        >
          <label for="" class="cursor-pointer text-white">
            Xem tất cả phiếu ăn
          </label>
        </div>
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="['Mã trẻ ', 'Tên trẻ ', 'Khẩu phần ăn', 'Nhận xét']"
      :labels="['children_id', 'child_name', 'dish_format', 'noteValue']"
      :mode="mode"
      :startRow="startRow"
      @delete="(value) => remove(value)"
      @edit="
        async (value) => {
          activeEdit = true;
          editValue = items.filter((item) => item._id == value);
          editValue = editValue[0];
        }
      "
      :show-action="[true, false, true]"
      :show-checkbox="true"
      @view="
        (value) => {
          idChild = value;
          activeViewDetailChild = true;
        }
      "
      :viewOption="`children`"
    />
    <Pagination
      :numberOfPages="numberOfPages"
      :totalRow="totalRow"
      :startRow="startRow"
      :endRow="endRow"
      v-model:currentPage="currentPage"
    />
  </div>
  <FormMealTicket
    :session="editValue.session._id"
    :date="editValue.date"
    v-if="activeEdit"
    @submit="
      (value) => {
        edit(value);
        activeEdit = false;
      }
    "
  />
  <FormViewDetailChild
    v-if="activeViewDetailChild"
    :title="`Chi tiết thông tin trẻ`"
    :id="idChild"
    @cancel="
      async (value) => {
        activeViewDetailChild = value;
        await refresh();
      }
    "
  />
  <FormViewManyMealTicket
    v-if="activeViewManyMealTicket"
    :title="`Chi tiết phiếu ăn trong ngày ${formatDate(
      temp_date
    )} từ ${temp_session}`"
    @cancel="
      async (value) => {
        activeViewManyMealTicket = value;
        await refresh();
      }
    "
    :session_id="sessionValue"
    :date_id="dateValue"
    :schoolYear_id="schoolYear_id"
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
  Session,
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
  FormDish,
  FormMealTicket,
  FormMeal,
  inputDate,
  FormViewDetailChild,
  FormViewManyMealTicket,
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
  format_input,
  getpreviousDate,
  AddMany,
  AddAuto,
  ChildcareCenter,
  verifyToken,
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
  const_st,
  statusList,
  statusValue,
  const_da,
  const_se,
  dateValue,
  sessionList,
  sessionValue,
  reset,
  getHours,
  const_evaluate,
  evaluateList,
  evaluateValue,
  classList,
  classValue,
  const_cl,
  const_childcareCenter,
  childcareCenterValue,
  childcareCenterList,
} from "../../components/common/index";

const editValue = ref({});

const role = ref("");
role.value = sessionStorage.getItem("role");
const activeViewDetailChild = ref(false);
const idChild = ref("");
const activeViewManyMealTicket = ref(false);
const schoolYear_id = ref(null);

searchOption.value = [
  { _id: "meal_id", name: "Tìm kiếm theo mã khẩu phần ăn" },
  { _id: "children_id", name: "Tìm kiếm theo mã trẻ" },
  { _id: "_child_name", name: "Tìm kiếm theo tên trẻ" },
  { _id: "note", name: "Tìm kiếm theo nhận xét" },
];

const save = async () => {
  if (dateValue.value != "Date" && dateValue.value) {
    items.value.forEach(async (item) => {
      const result = await http_update(MealTicket, item._id, {
        evaluate: item.status,
        remark: item.note,
      });
    });
    run_alert(alert_success(`Successfully updated.`));
    refresh();
  } else {
    run_alert(alert_warning(`Please choose date.`));
  }
};

const edit = async (items) => {
  for (let item of items) {
    if (item?._id) {
      if (item.checked) {
        const result = await http_update(MealTicket, editValue.value._id, {
          meal: item._id,
        });
        run_alert(alert_success(`Successfully updated.`));
      }
    }
  }
  refresh();
};

const remove = async (item) => {
  const deleteList = items.value.filter((item) => item.checked);
  if (deleteList.length != 0) {
    const isRemove = await alert_remove(
      deleteList,
      ["Children", "Date", "Session", "Meal", "Favourite", "Remark"],
      [
        "child_name",
        "date_format",
        "session_format",
        "dish_format",
        "status",
        "note",
      ],
      "80%"
    );
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(MealTicket, item._id);
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
      ["Children", "Date", "Session", "Meal", "Favourite", "Remark"],
      [
        "child_name",
        "date_format",
        "session_format",
        "dish_format",
        "status",
        "note",
      ],
      "80%"
    );
    if (isRemove) {
      const result = await http_deleteOne(MealTicket, item._id);
      if (!result.error) {
        run_alert(alert_success(result.message));
        refresh();
      }
    }
  }
};

const refresh = async () => {
  items.value = await http_getAll(MealTicket);
  items.value = items.value.map((value) => ({
    ...value,
    child_name: value.child.name,
    children_id: value.child._id,
    meal_id: value.meal._id,
    parent_name: value.child.parentDetails[0].name,
    parent_phone: value.child.parentDetails[0].phone,
    _child_name: value.child.name,
    child_gender: value.child.gender == true ? "name" : "nữ",
    date_format: formatDate(value.meal.date),
    session_format: `${value.meal.session.name} - ${value.meal.session.startTime} - ${value.meal.session.endTime}`,
    dish_format: value.meal.dish.map((item) => item.name).join(", "),
    status: value.evaluate,
    statusValue: value.evaluate,
    noteValue: value.remark,
    note: value.remark,
    date: value.meal.date,
    class_name: value.classes.name,
    session: {
      _id: value.meal.session._id,
    },
    grade_id: value.classes.grade._id,
    childcareCenterId: value.classes.schoolYear.childcareCenter,
    schoolYear_id: value.classes.schoolYear._id,
  }));
  items.value = items.value.filter(
    (i) => i.classes.schoolYear.childcareCenter == childcareCenter.value
  );
  filters();
};

const refreshFilter = async () => {
  items.value = await http_getAll(MealTicket);
  items.value = items.value.map((value) => ({
    ...value,
    child_name: value.child.name,
    children_id: value.child._id,
    meal_id: value.meal._id,
    parent_name: value.child.parentDetails[0].name,
    parent_phone: value.child.parentDetails[0].phone,
    _child_name: value.child.name,
    child_gender: value.child.gender == true ? "name" : "nữ",
    date_format: formatDate(value.meal.date),
    session_format: `${value.meal.session.name} - ${value.meal.session.startTime} - ${value.meal.session.endTime}`,
    dish_format: value.meal.dish.map((item) => item.name).join(", "),
    status: value.evaluate,
    statusValue: value.evaluate,
    noteValue: value.remark,
    note: value.remark,
    date: value.meal.date,
    class_name: value.classes.name,
    session: {
      _id: value.meal.session._id,
    },
    grade_id: value.classes.grade._id,
    childcareCenterId: value.classes.schoolYear.childcareCenter,
    schoolYear_id: value.classes.schoolYear._id,
  }));
  filters();
};

watch(schoolYearValue, async (n, o) => {
  if (
    schoolYearValue.value != const_sy.value &&
    gradeValue.value != const_gr.value
  ) {
    classList.value = await http_getAll(Classes);
    classList.value = classList.value.filter(
      (value) =>
        value.schoolYear._id == schoolYearValue.value &&
        gradeValue.value == value.grade._id
    );
  }
});

watch(gradeValue, async (n, o) => {
  if (
    schoolYearValue.value != const_sy.value &&
    gradeValue.value != const_gr.value
  ) {
    classList.value = await http_getAll(Classes);
    classList.value = classList.value.filter(
      (value) =>
        value.schoolYear._id == schoolYearValue.value &&
        gradeValue.value == value.grade._id
    );
  }
});

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

const grades = ref([]);
const temp_date = ref("");
const temp_session = ref("");

const temp_childcareCenter = ref("");
const isToken = ref("");
const childcareCenter = ref(sessionStorage.getItem("owner_childcareCenter"));
const childcareCenterName = ref(
  sessionStorage.getItem("owner_childcareCenterName")
);
const activeViewMany = ref(false);
const checkViewMany = () => {
  if (
    sessionValue.value.toLowerCase() != const_se.value.toLowerCase() &&
    schoolYearValue.value.toLowerCase() != const_sy.value.toLowerCase() &&
    dateValue.value.toLowerCase() != const_da.value.toLowerCase()
  ) {
    activeViewManyMealTicket.value = true;
  } else {
    run_alert(alert_warning(`Vui lòng chọn ngày và buổi và năm học.`));
  }
};

onBeforeMount(async () => {
  isToken.value = await verifyToken();
  reset();
  dateValue.value = format_input(new Date());
  temp_date.value = dateValue.value;
  await refresh();
  const temp = await http_getAll(MealTicket);
  while (items.value.length == 0 && temp.length != 0) {
    dateValue.value = getpreviousDate(temp_date.value);
    temp_date.value = dateValue.value;
    await refreshFilter();
  }
  // gradeList.value = await http_getAll(Grade);
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
  console.log(temp_session.value, getHours());
  sessionList.value = sessionList.value.map((item) => ({
    _id: item._id,
    name: `${item.startTime} - ${item.endTime} ( ${item.name} )`,
  }));
  grades.value = await http_getAll(Grade);
  grades.value = grades.value.map((item) => ({
    _id: item._id,
    name: item.name,
    checked: false,
  }));
  statusList.value = [
    {
      _id: "true",
      name: "yêu thích",
    },
    {
      _id: "false",
      name: "không yêu thích",
    },
  ];
  evaluateList.value = [
    {
      _id: "yêu thích",
      name: "yêu thích",
    },
    {
      _id: "không thích",
      name: "không thích",
    },
    {
      _id: "bị dị ứng",
      name: "bị dị ứng",
    },
  ];
  // schoolYearList.value = await http_getAll(SchoolYear);
});
</script>
