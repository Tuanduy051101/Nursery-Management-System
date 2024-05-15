<template>
  <div v-if="item?.name" class="">
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
        :options="evaluateList"
        :modelValue="const_evaluate"
        :title="const_evaluate"
        @update:modelValue="
          (value) => {
            evaluateValue = value;
            filtered();
          }
        "
        @refresh="
          async () => {
            evaluateValue = const_evaluate;
            await filtered();
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
        <button
          v-if="activeEvaluate == true"
          class="border border-solid border-orange-500 bg-orange-500 px-3 text-white rounded-md hover:shadow-lg hover:shadow-yellow-500/50"
          type="button"
          @click="save"
        >
          Lưu
        </button>
        <button
          v-if="activeEvaluate == false"
          class="border border-solid border-yellow-500 bg-yellow-500 px-3 text-white rounded-md hover:shadow-lg hover:shadow-yellow-500/50"
          type="button"
          @click="activeEvaluate = true"
        >
          Cập nhật
        </button>
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="['Mã trẻ', 'Tên trẻ', 'Khẩu phần ăn', 'Đánh giá', 'Nhận xét']"
      :labels="
        activeEvaluate
          ? ['children_id', 'child_name', 'dish_format', 'evaluate', 'note']
          : [
              'children_id',
              'child_name',
              'dish_format',
              'statusValue',
              'noteValue',
            ]
      "
      :wrap-list="[false, false, false, true, false, true]"
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
      :show-action="
        activeEvaluate ? [false, false, false] : [true, true, false]
      "
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
    :meal="editValue.meal._id"
    :child="editValue.child._id"
    v-if="activeEdit"
    @submit="
      async (value) => {
        edit(value);
        activeEdit = false;
      }
    "
    @cancel="
      () => {
        activeEdit = false;
        refresh();
      }
    "
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
  const_da,
  const_se,
  dateValue,
  sessionList,
  sessionValue,
  resetFilter,
  reset,
  const_evaluate,
  evaluateList,
  evaluateValue,
  getHours,
} from "../../../../components/common/index.js";

const props = defineProps({
  classId: {
    type: String,
    required: true,
  },
});

const editValue = ref({});
const activeEvaluate = ref(false);

searchOption.value = [
  { _id: "_child_name", name: "Tìm kiếm theo tên trẻ" },
  { _id: "note", name: "Tìm kiếm theo nhận xét" },
];

const save = async () => {
  if (dateValue.value != "Date" && dateValue.value) {
    items.value.forEach(async (item) => {
      const result = await http_update(MealTicket, item._id, {
        evaluate: item.evaluate,
        remark: item.note,
        task: "save",
      });
    });
    activeEvaluate.value = false;
    run_alert(alert_success(`Đã cập nhật thông tin thành công.`));
    await refresh();
  } else {
    run_alert(alert_warning(`Vui lòng chọn ngày.`));
  }
  await refresh();
};

const edit = async (items) => {
  for (let item of items) {
    if (item?._id) {
      if (item.checked) {
        const result = await http_update(MealTicket, editValue.value._id, {
          meal: item._id,
          task: "edit",
        });
        if (result.error) {
          run_alert(alert_error(result.message));
        } else {
          run_alert(alert_success(`Đã thay đổi khẩu phần ăn thành công.`));
        }
      }
    }
  }
  await refresh();
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
      "60%"
    );
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(MealTicket, item._id);
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
      ["Children", "Date", "Session", "Meal", "Favourite", "Remark"],
      [
        "child_name",
        "date_format",
        "session_format",
        "dish_format",
        "status",
        "note",
      ],
      "60%"
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
  if (props.classId) {
    item.value = await http_getOne(Classes, props.classId);
    item.value = item.value[0];
    items.value = item.value.mealTicket.map((value) => ({
      ...value,
      child_name: value.child.name,
      children_id: value.child._id,
      _child_name: value.child.name,
      child_gender: value.child.gender == true ? "name" : "nữ",
      date_format: formatDate(value.meal.date),
      session_format: `${value.meal.session.startTime} - ${value.meal.session.endTime} ( ${value.meal.session.name} )`,
      dish_format: value.meal.dish
        .map((item1, index) =>
          value.meal.dish.length == 1
            ? `<p>${item1.name}</p>`
            : `<p>${index + 1}. ${item1.name}</p>`
        )
        .join(""),
      status: value.evaluate,
      statusValue: value.evaluate,
      note: value.remark,
      noteValue: value.remark,

      date: value.meal.date,
      session: {
        _id: value.meal.session._id,
      },
    }));
    console.log(items.value.map((i) => i.meal.date));
    filters();
  }
};

const filtered = async () => {
  await refresh();
  filters();
  currentPage.value = 1;
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
    while (items.value.length == 0 && temp[0].mealTicket.length != 0) {
      dateValue.value = getpreviousDate(temp_date.value);
      temp_date.value = dateValue.value;
      await refresh();
    }
  }
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
      name: "yêu thích",
    },
    {
      _id: "false",
      name: "không yêu thích",
    },
  ];
});
</script>
