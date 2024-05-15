<template>
  <div class="border border-solid border-slate-300 rounded-md">
    <!-- Header -->
    <p class="text-blue-700 text-base mx-5 mt-5">Bộ lọc tìm kiếm</p>
    <div class="flex justify-between items-center my-5 mx-5">
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
            gradeId = value;
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
            filtered1(gradeValue);
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
          class="border-2 border-solid bg-gray-500 border-gray-500 cursor-pointer rounded-md ml-5 flex items-center px-5 text-lg text-slate-300 hover:shadow-lg hover:shadow-yellow-500/50"
        >
          <label for="" class="cursor-pointer text-white">
            Xem tất cả phân công
          </label>
        </div>
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="['Tên lớp', 'Khối học', 'Năm học', 'Số lượng trẻ']"
      :labels="['name', 'grade_name', 'schoolYear_name', 'totalChildren']"
      :actionList="['ClassRoom.view']"
      :mode="mode"
      :startRow="startRow"
      @delete="(value) => remove(value)"
      @edit="
        async (value) => {
          item = await http_getOne(Classes, value);
          item = item[0];
          activeEdit = true;
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
  <FormOne
    v-if="activeAdd"
    :name="`Classes`"
    :item="itemAdd"
    :title="`Thêm lớp mới`"
    :placeholder="`Add a new classes`"
    @cancel="
      (value) => {
        activeAdd = value;
        itemAdd = {
          name: '',
          amountClasses: 0,
          schoolYear: '',
          grade: '',
          amountChildren: 0,
        };
      }
    "
    @submit="create()"
  />
  <FormOne
    v-if="activeEdit"
    :name="`Classes`"
    :item="item"
    :title="`Sửa thông tin lớp học`"
    @cancel="
      (value) => {
        activeEdit = value;
      }
    "
    :button-name="`Edit`"
    @submit="edit()"
  />
  <FormViewManyAssignment
    v-if="activeAddMany"
    :title="`Xem tất cả phân công`"
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
  FormTeacher,
  FormViewManyAssignment,
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
  resetFilter,
  reset,
  const_childcareCenter,
  childcareCenterValue,
  childcareCenterList,
} from "../../../components/common/index.js";

const itemAdd = ref({
  amountClasses: 0,
  schoolYear: "",
  grade: "",
  amountChildren: 0,
});

const activeAddMany = ref(false);
const gradeId = ref(null);
const schoolYearId = ref(null);

searchOption.value = [
  { _id: "name", name: "Tìm kiếm theo tên lớp" },
  { _id: "child_name", name: "Tìm kiếm theo mã trẻ" },
  { _id: "child_name", name: "Tìm kiếm theo tên trẻ" },
];

const create = async () => {
  try {
    const result = await Classes.createAuto(itemAdd.value);
    if (result.error) run_alert(alert_error(result.message));
    if (!result.error) {
      if (itemAdd.amountChildren != 0) {
        for (let value of result.result) {
          await Classes.addChildAuto(value._id, {
            amountChildren: itemAdd.value.amountChildren,
          });
        }
      }
      run_alert(alert_success(result.message));
      activeAdd.value = false;
      itemAdd.value = {
        amountClasses: 0,
        schoolYear: "",
        grade: "",
        amountChildren: 0,
      };
      refresh();
    }
  } catch (error) {
    console.log(error);
  }
};

const edit = async () => {
  console.log(item.value);
  const result = await http_update(Classes, item.value._id, item.value);
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
      ["Tên lớp", "Số lượng trẻ"],
      ["name", "totalChildren"],
      "40%"
    );
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(Classes, item._id);
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
      ["Tên lớp", "Số lượng trẻ"],
      ["name", "totalChildren"],
      "40%"
    );
    if (isRemove) {
      const result = await http_deleteOne(Classes, item._id);
      if (!result.error) {
        run_alert(alert_success(result.message));
        refresh();
      }
    }
  }
  backup_items();
};

const refresh = async () => {
  items.value = await http_getAll(Classes);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    grade_name: item.grade.name,
    schoolYear_name: item.schoolYear.name,
    totalChildren: item.children.length,
    schoolYear_id: item.schoolYear._id,
    grade_id: item.grade._id,
    childcareCenterId: item.schoolYear.childcareCenter,
  }));
  items.value = items.value.filter(
    (i) => i.schoolYear.childcareCenter == childcareCenter.value
  );
};

const refreshFilter = async () => {
  items.value = await http_getAll(Classes);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    grade_name: item.grade.name,
    schoolYear_name: item.schoolYear.name,
    totalChildren: item.children.length,
    schoolYear_id: item.schoolYear._id,
    grade_id: item.grade._id,
    childcareCenterId: item.schoolYear.childcareCenter,
  }));
  items.value = items.value.filter(
    (i) => i.schoolYear.childcareCenter == childcareCenter.value
  );
};

const filtered = async () => {
  await refresh();
  filters();
};

const filtered1 = async () => {
  await refreshFilter();
  filters();
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
  backup_items();
  childcareCenterValue.value = childcareCenter.value;
  temp_childcareCenter.value = childcareCenterName.value;
  items.value = items.value.filter(
    (i) => i.schoolYear.childcareCenter == childcareCenter.value
  );
  gradeList.value = await http_getAll(Grade);
  childcareCenterList.value = await http_getAll(ChildcareCenter);
  schoolYearList.value = await http_getAll(SchoolYear);
  schoolYearList.value = schoolYearList.value.filter(
    (i) => i.childcareCenter._id == childcareCenter.value
  );
});
</script>
