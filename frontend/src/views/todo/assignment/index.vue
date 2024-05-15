<template>
  <div class="border border-solid border-slate-300 rounded-md">
    <!-- Header -->
    <p class="text-slate-900 text-lg mx-5 mt-5">Bộ lọc tìm kiếm</p>
    <div class="flex justify-between items-center my-5 ml-5">
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
          (value) => {
            schoolYearValue = value;
            schoolYearId = value;
            filtered1();
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
          (value) => {
            gradeValue = value;
            gradeId = value;
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
      <div class="flex-1 flex justify-end">
        <BAdd @click="activeAdd = true" />
        <div
          @click="checkFormAddMany()"
          class="border-2 border-solid bg-purple-500 border-purple-500 cursor-pointer rounded-md ml-5 flex items-center px-5 text-lg text-slate-300 hover:shadow-lg hover:shadow-yellow-500/50"
        >
          <label for="" class="cursor-pointer text-white">
            Thêm nhiều phân công
          </label>
        </div>
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="['Mã giáo viên', 'Tên giáo viên', 'nhiệm vụ', 'lớp học', 'ghi chú']"
      :labels="[
        'teacher_id',
        'teacher_name',
        'duty_name',
        'class_name',
        'noteValue',
      ]"
      :mode="mode"
      :startRow="startRow"
      :wrap-list="[false, false, true, false, true]"
      :show-action="[false, false, true]"
      @delete="(value) => remove(value)"
      @edit="
        async (value) => {
          item = await http_getOne(Assignment, value);
          item.duty_name = item.duty.name;
          item.teacher_name = item.teacher.name;
          item.class_name = item.classes.name;
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
  </div>
  <FormAssignment
    v-if="activeAdd"
    :itemAdd="itemAdd"
    :title="`Thêm phân công mới`"
    @cancel="
      (value) => {
        activeAdd = value;
        itemAdd = {
          duty: '',
          classes: '',
          teachers: [],
          note: '',
          grade: '',
          schoolYear: '',
        };
        refresh();
      }
    "
    @submit="
      (value) => {
        itemAdd = value;
        create();
        refresh();
      }
    "
  />
  <FormAddManyAssignment
    v-if="activeAddMany"
    :title="`Thêm nhiều phân công mới`"
    :gradeId="gradeId"
    :schoolYearId="schoolYearId"
    @cancel="
      async (value) => {
        activeAddMany = false;
        reset();
        await refresh();
        gradeValue = gradeId;
        schoolYearValue = schoolYearId;
        filters();
      }
    "
    @updateActiveAddMany="
      async () => {
        activeAddMany = false;
        await refresh();
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
  FormAssignment,
  FormAddManyAssignment,
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
  reset,
  const_childcareCenter,
  childcareCenterValue,
  childcareCenterList,
} from "../../../components/common/index.js";

const itemAdd = ref({
  duty: "",
  classes: "",
  teachers: [],
  note: "",
  grade: "",
  schoolYear: "",
});

const activeAddMany = ref(false);
const gradeId = ref(null);
const schoolYearId = ref(null);

searchOption.value = [
  { _id: "class_name", name: "Tìm kiếm theo tên lớp" },
  { _id: "teacher_name", name: "Tìm kiếm theo tên giáo viên" },
  { _id: "duty_name", name: "Tìm kiếm theo nhiệm vụ" },
];

const create = async () => {
  const result = await http_create(Assignment, itemAdd.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    refresh();
    itemAdd.value = {
      duty: "",
      classes: "",
      teachers: [],
      note: "",
      grade: "",
      schoolYear: "",
    };
    activeAdd.value = false;
  }
};

const edit = async () => {
  const result = await http_update(Children, item.value._id, item.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    activeEdit.value = false;
    refresh();
  }
  backup_items();
};

const remove = async (item) => {
  const deleteList = items.value.filter((item) => item.checked);
  if (deleteList.length != 0) {
    const isRemove = await alert_remove(
      deleteList,
      ["Tên nhiệm vụ", "Tên giáo viên", "Lớp"],
      ["duty_name", "teacher_name", "class_name"]
    );
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(Assignment, item._id);
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
      ["Tên nhiệm vụ", "Tên giáo viên", "Lớp"],
      ["duty_name", "teacher_name", "class_name"]
    );
    if (isRemove) {
      const result = await http_deleteOne(Assignment, item._id);
      if (!result.error) {
        run_alert(alert_success(result.message));
        refresh();
      }
    }
  }
  backup_items();
};

const refresh = async () => {
  items.value = await http_getAll(Assignment);
  console.log(items.value);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    duty_name: item.duty.name,
    teacher_name: item.teacher.name,
    teacher_id: item.teacher._id,
    teacher_email: item.teacher.email,
    class_name: item.classes.name,
    schoolYear_id: item.classes.schoolYear._id,
    grade_id: item.classes.grade._id,
    childcareCenterId: item.classes.schoolYear.childcareCenter,
    noteValue: item.note,
  }));
  items.value = items.value.filter(
    (i) => i.classes.schoolYear.childcareCenter == childcareCenter.value
  );
};

const refreshFilter = async () => {
  items.value = await http_getAll(Assignment);
  console.log(items.value);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    duty_name: item.duty.name,
    teacher_name: item.teacher.name,
    teacher_id: item.teacher._id,
    teacher_email: item.teacher.email,
    class_name: item.classes.name,
    schoolYear_id: item.classes.schoolYear._id,
    grade_id: item.classes.grade._id,
    childcareCenterId: item.classes.schoolYear.childcareCenter,
    noteValue: item.note,
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

const checkSchoolYearOfFormAddMany = () => {
  if (schoolYearValue.value != const_sy) {
    activeAddMany.value = true;
    console.log("cccc", schoolYearValue.value);
    return schoolYearValue.value;
  }
  run_alert(alert_warning(`Vui lòng chọn năm học.`));
  activeAddMany.value = false;
};

const checkGradeOfFormAddMany = () => {
  if (gradeValue.value != const_gr && schoolYearValue.value != const_sy) {
    activeAddMany.value = true;
    return gradeValue.value;
  }
  run_alert(alert_warning(`Vui lòng chọn khối và năm học.`));
  activeAddMany.value = false;
};

const checkFormAddMany = () => {
  if (schoolYearValue.value.toLowerCase() != const_sy.value.toLowerCase()) {
    activeAddMany.value = true;
  } else {
    run_alert(alert_warning(`Vui lòng chọn năm học.`));
  }
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
});
</script>
