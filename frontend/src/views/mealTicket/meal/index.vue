<template>
  <div class="border border-solid border-slate-300 rounded-md">
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
        :optionLarge="true"
      />
      <FSelect
        v-if="isToken"
        class="w-full text-md ml-5"
        :options="childcareCenterList"
        :modelValue="temp_childcareCenter"
        :title="const_childcareCenter"
        @update:modelValue="
          async (value) => {
            childcareCenterValue = value;
            await filtered1();
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
        class="w-full ml-5 text-md"
        :options="gradeList"
        :modelValue="const_gr"
        :title="const_gr"
        @update:modelValue="
          (value) => {
            gradeValue = value;
            filtered1();
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
      </div>
      <div class="flex-1 flex">
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
        <BAdd @click="activeAdd = true" />
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="[
        'Mã khẩu phần ăn',
        'Khẩu phần ăn',
        'Lượt đăng ký',
        'Lượt thích',
        'Lượt không thích',
        'Lượt bị dị ứng',
      ]"
      :labels="[
        '_id',
        'dish_format',
        'total_mealTicket',
        'like',
        'hate',
        'allergies',
      ]"
      :wrap-list="[true, true, false, false, false, false]"
      :mode="mode"
      :startRow="startRow"
      @delete="(value) => remove(value)"
      @edit="
        async (value) => {
          item = items.filter((item) => item._id == value);
          item = item[0];
          edit();
        }
      "
      :actionList="[role == 'nhân viên bếp' ? 'Meal-chef.view' : 'Meal.view']"
      :show-action="[true, false, true]"
    />
    <Pagination
      :numberOfPages="numberOfPages"
      :totalRow="totalRow"
      :startRow="startRow"
      :endRow="endRow"
      v-model:currentPage="currentPage"
    />
    <FormMeal
      v-if="activeAdd"
      :itemAdd="itemAdd"
      :title="`Thêm khẩu phần ăn`"
      :placeholder="`Add a new meal`"
      @cancel="
        async (value) => {
          activeAdd = value;
          itemAdd.session = '';
          itemAdd.date = '';
          itemAdd.note = '';
          await refresh();
        }
      "
      @submit="create()"
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
  FormMeal,
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
  getpreviousDate,
  format_input,
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
  const_da,
  const_se,
  dateValue,
  sessionList,
  sessionValue,
  resetFilter,
  reset,
  getHours,
  const_childcareCenter,
  childcareCenterValue,
  childcareCenterList,
} from "../../../components/common/index.js";

const itemAdd = ref({
  session: "",
  date: "",
  dishes: [],
  note: "",
});

const role = ref("");

role.value = sessionStorage.getItem("role");

searchOption.value = [{ _id: "dish_name", name: "Tìm kiếm theo tên món ăn" }];

const create = async () => {
  const result = await http_create(Meal, itemAdd.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    await refresh();
    currentPage.value = 1;
    run_alert(alert_success(result.message));
    activeAdd.value = false;
    itemAdd.value.session = "";
    itemAdd.value.date = "";
    itemAdd.value.note = "";
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
      ["Buổi", "Ngày", "Khối", "Khẩu phần ăn"],
      ["session_name", "date_format", "grade_name", "dish_name"],
      "80%"
    );
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(Meal, item._id);
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
      ["Buổi", "Ngày", "Khối", "Khẩu phần ăn"],
      ["session_name", "date_format", "grade_name", "dish_name"],
      "80%"
    );
    if (isRemove) {
      const result = await http_deleteOne(Meal, item._id);
      if (!result.error) {
        run_alert(alert_success(result.message));
        refresh();
      }
    }
  }
};

const refresh = async () => {
  items.value = await http_getAll(Meal);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    session_name:
      item.session.name +
      "_" +
      item.session.startTime +
      "_" +
      item.session.endTime,
    childcareCenterId: item.dish[0].childcareCenter._id,
    grade_name: item.grade.map((item) => item.name).join(", "),
    grade_id: item.grade.map((item) => item._id).join(", "),
    dish_name: item.dish.map((item) => item.name).join(", "),
    dish_format: item.dish
      .map((item1, index) =>
        item.dish.length == 1
          ? `<p>${item1.name}</p>`
          : `<p>${index + 1}. ${item1.name}</p>`
      )
      .join(""),
    date_format: formatDate(item.date),
    like: item.mealTicket.reduce(
      (acc, a) => (a.evaluate == "yêu thích" ? acc + 1 : acc + 0),
      0
    ),
    hate: item.mealTicket.reduce(
      (acc, a) => (a.evaluate == "không thích" ? acc + 1 : acc + 0),
      0
    ),
    allergies: item.mealTicket.reduce(
      (acc, a) => (a.evaluate == "bị dị ứng" ? acc + 1 : acc + 0),
      0
    ),
    total_mealTicket: item.mealTicket.length,
  }));
  items.value = items.value.filter(
    (i) => i.dish[0].childcareCenter._id == childcareCenter.value
  );
  filters();
};

const refreshFilter = async () => {
  items.value = await http_getAll(Meal);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    session_name:
      item.session.name +
      "_" +
      item.session.startTime +
      "_" +
      item.session.endTime,
    childcareCenterId: item.dish[0].childcareCenter._id,
    grade_name: item.grade.map((item) => item.name).join(", "),
    grade_id: item.grade.map((item) => item._id).join(", "),
    dish_name: item.dish.map((item) => item.name).join(", "),
    dish_format: item.dish
      .map((item1, index) =>
        item.dish.length == 1
          ? `<p>${item1.name}</p>`
          : `<p>${index + 1}. ${item1.name}</p>`
      )
      .join(""),
    date_format: formatDate(item.date),
    like: item.mealTicket.reduce(
      (acc, a) => (a.evaluate == "yêu thích" ? acc + 1 : acc + 0),
      0
    ),
    hate: item.mealTicket.reduce(
      (acc, a) => (a.evaluate == "không thích" ? acc + 1 : acc + 0),
      0
    ),
    allergies: item.mealTicket.reduce(
      (acc, a) => (a.evaluate == "bị dị ứng" ? acc + 1 : acc + 0),
      0
    ),
    total_mealTicket: item.mealTicket.length,
  }));
  filters();
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

const grades = ref([]);
const temp_date = ref("");
const temp_session = ref("");

const temp_childcareCenter = ref("");
const isToken = ref("");
const childcareCenter = ref(sessionStorage.getItem("owner_childcareCenter"));
const childcareCenterName = ref(
  sessionStorage.getItem("owner_childcareCenterName")
);

onBeforeMount(async () => {
  isToken.value = await verifyToken();
  reset();
  dateValue.value = format_input(new Date());
  temp_date.value = dateValue.value;
  await refresh();
  const temp = await http_getAll(Meal);
  while (items.value.length == 0 && temp.length != 0) {
    dateValue.value = getpreviousDate(temp_date.value);
    temp_date.value = dateValue.value;
    await refreshFilter();
  }
  const childcareCenterx = sessionStorage.getItem("owner_childcareCenter");
  childcareCenterValue.value = childcareCenterx;
  temp_childcareCenter.value = childcareCenterName.value;
  items.value = items.value.filter(
    (i) => i.dish[0].childcareCenter._id == childcareCenterx
  );
  childcareCenterList.value = await http_getAll(ChildcareCenter);
  gradeList.value = await http_getAll(Grade);
  sessionList.value = await http_getAll(Session);
  console.log("cc1", sessionList.value);
  sessionList.value = sessionList.value.filter((i) =>
    i.childcareCenter.some(
      (j) => j._id == sessionStorage.getItem("owner_childcareCenter")
    )
  );
  console.log(sessionStorage.getItem("owner_childcareCenter"));
  console.log("cc1", sessionList.value);
  let hoursCurent = parseInt(getHours());
  // do {
  //   const temp = sessionList.value.filter(
  //     (i) => i.startTime.split(":")[0] == hoursCurent.toString()
  //   );
  //   if (temp.length == 1) {
  //     sessionValue.value = temp[0]._id;
  //     temp_session.value = `${temp[0].startTime} - ${temp[0].endTime} ( ${temp[0].name})`;
  //     filters();
  //   } else {
  //     if (hoursCurent > 21) {
  //       sessionValue.value =
  //         sessionList.value[sessionList.value.length - 1]._id;
  //       temp_session.value = `${
  //         sessionList.value[sessionList.value.length - 1].startTime
  //       } - ${sessionList.value[sessionList.value.length - 1].endTime} ( ${
  //         sessionList.value[sessionList.value.length - 1].name
  //       })`;
  //       filters();
  //     } else {
  //       hoursCurent += 1;
  //     }
  //   }
  // } while (temp_session.value.length == 0);
  sessionList.value = sessionList.value.map((item) => ({
    _id: item._id,
    name: `${item.startTime} - ${item.endTime} ( ${item.name} )`,
  }));
  grades.value = await http_getAll(Grade);
  const childcareCenter = sessionStorage.getItem("owner_childcareCenter");
  grades.value = grades.value.map((item) => ({
    _id: item._id,
    name: item.name,
    checked: false,
  }));
  itemAdd.value.grade = grades.value;
});
</script>
