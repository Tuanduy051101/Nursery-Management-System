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
              (i) => i.childcareCenter._id == value
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
        :options="tuitionFeesList"
        :modelValue="const_tf"
        :title="const_tf"
        @update:modelValue="
          async (value) => {
            tuitionFeesValue = value;
            await filtered1();
          }
        "
        @refresh="
          async () => {
            tuitionFeesValue = const_tf;
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
      :fields="['Tên khoản thu', 'Khối học', 'Năm học', 'Mức thu']"
      :labels="['tuitionFees', 'gradeName', 'schoolYear_name', 'money']"
      :mode="mode"
      :startRow="startRow"
      :show-action="[false, true, true]"
      :wrap-list="[true, false, false, false]"
      @delete="(value) => remove(value)"
      @edit="
        async (value) => {
          item = await http_getOne(CollectionRates, value);
          item.money_d = formatCurrencyVND(item.money);
          item.grade = item.grade._id;
          item.schoolYear = item.schoolYear._id;
          item.tuitionFees = item.tuitionFees._id;
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
    :item="itemAdd"
    :title="`Thêm mức thu mới`"
    :name="`CollectionRates`"
    :placeholder="`Add a new collection rates`"
    @cancel="(value) => (activeAdd = value)"
    @money="
      (value) => {
        itemAdd.money_d = formatCurrencyVND(value);
        itemAdd.money = value;
      }
    "
    @submit="create()"
  />
  <FormOne
    v-if="activeEdit"
    :item="item"
    :name="`CollectionRates`"
    :title="`Sửa thông tin mức thu`"
    :buttonName="`Edit`"
    :disabled="true"
    @cancel="(value) => (activeEdit = value)"
    @submit="edit()"
    @money="
      (value) => {
        item.money_d = formatCurrencyVND(value);
        item.money = value;
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
  ChildcareCenter,
  verifyToken,
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
  const_sy,
  const_gr,
  const_tf,
  const_ge,
  const_ag,
  filters,
  resetFilter,
  reset,
  const_childcareCenter,
  childcareCenterValue,
  childcareCenterList,
} from "../../../../components/common/index.js";

const itemAdd = ref({
  money: "",
  money_d: "",
  grade: "",
  tuitionFees: "",
  schoolYear: "",
});

searchOption.value = [{ _id: "money", name: "Tìm kiếm theo mức thu" }];

const create = async () => {
  const result = await http_create(CollectionRates, itemAdd.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    activeAdd.value = false;
    await refresh();
  }
  backup_items();
};

const edit = async () => {
  const result = await http_update(CollectionRates, item.value._id, item.value);
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
      ["Tên khoản thu", "Khối học", "Năm học", "Mức thu"],
      ["tuitionFees", "grade", "schoolYear", "money"]
    );
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(CollectionRates, item._id);
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
      ["Tên khoản thu", "Khối học", "Năm học", "Mức thu"],
      ["tuitionFees", "grade", "schoolYear", "money"]
    );
    if (isRemove) {
      const result = await http_deleteOne(CollectionRates, item._id);
      if (!result.error) {
        run_alert(alert_success(result.message));
        refresh();
      }
    }
  }
  backup_items();
};

const refresh = async () => {
  items.value = await http_getAll(CollectionRates);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    money: formatCurrencyVND(item.money),
    gradeName: item.grade.name,
    schoolYear_name: item.schoolYear.name,
    tuitionFees: item.tuitionFees.name,
    grade_id: item.grade._id,
    schoolYear_id: item.schoolYear._id,
    tuitionFees_id: item.tuitionFees._id,
    childcareCenterId: item.schoolYear.childcareCenter,
  }));
  console.log('x', items.value);
  console.log(childcareCenterValue.value);
  items.value = items.value.filter(
    (i) => i.schoolYear.childcareCenter == childcareCenterValue.value
  );
  console.log('y', items.value);
};

const refreshFilter = async () => {
  items.value = await http_getAll(CollectionRates);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    money: formatCurrencyVND(item.money),
    gradeName: item.grade.name,
    schoolYear_name: item.schoolYear.name,
    tuitionFees: item.tuitionFees.name,
    grade_id: item.grade._id,
    schoolYear_id: item.schoolYear._id,
    tuitionFees_id: item.tuitionFees._id,
    childcareCenterId: item.schoolYear.childcareCenter,
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
  childcareCenterValue.value = childcareCenter.value;
  temp_childcareCenter.value = childcareCenterName.value;
  await refresh();
  items.value = items.value.filter(
    (i) => i.schoolYear.childcareCenter == childcareCenterValue.value
  );
  childcareCenterList.value = await http_getAll(ChildcareCenter);
  schoolYearList.value = await http_getAll(SchoolYear);
  gradeList.value = await http_getAll(Grade);
  schoolYearList.value = schoolYearList.value.filter(
    (i) => i.childcareCenter._id == childcareCenter.value
  );
  tuitionFeesList.value = await http_getAll(TuitionFees);
});
</script>
