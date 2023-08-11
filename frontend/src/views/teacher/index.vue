<template>
  <div class="border border-solid border-slate-600 rounded-md">
    <!-- Header -->
    <p class="text-slate-300 text-lg mx-5 mt-5">Search Filter</p>
    <div class="flex justify-center items-center my-5 mx-5">
      <FSelect
        class="w-full text-md"
        :options="genderList"
        :title="const_ge"
        :modelValue="const_ge"
        @update:modelValue="
          (value) => {
            genderValue = value;
            filtered();
          }
        "
        @refresh="
          () => {
            genderValue = const_ge;
            filtered();
          }
        "
        :showClose="true"
      />
      <FSelect
        class="w-full text-md mx-5"
        :options="positionList"
        :title="const_ps"
        :modelValue="const_ps"
        @update:modelValue="
          (value) => {
            positionValue = value;
            filtered();
          }
        "
        @refresh="
          () => {
            positionValue = const_ps;
            filtered();
          }
        "
        :showClose="true"
        :active-search="true"
      />
      <FSelect
        class="w-full text-md"
        :options="diplomaList"
        :title="const_dl"
        :modelValue="const_dl"
        @update:modelValue="
          (value) => {
            diplomaValue = value;
            filtered();
          }
        "
        @refresh="
          () => {
            diplomaValue = const_dl;
            filtered();
          }
        "
        :showClose="true"
        :active-search="true"
      />
    </div>
    <div class="border border-solid my-5 border-slate-600 border-b-0"></div>
    <div class="flex items-center justify-between my-5 mx-5">
      <div class="w-6/12 flex">
        <FSelect
          style="width: 105px"
          :options="option_entry"
          :modelValue="entryValue"
          :title="`Record`"
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
        <FSelect
          class="w-28 mx-5"
          :options="option_mode"
          :modelValue="`auto`"
          :title="`Display`"
          v-model="mode"
        />
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
      :fields="['Name', 'Gender', 'Phone', 'Email', 'Address', 'Position']"
      :labels="[
        'name',
        'gender_format',
        'phone',
        'email',
        'address',
        'position_name',
      ]"
      :mode="mode"
      :actionList="actionList"
      :startRow="startRow"
      @delete="(value) => remove(value)"
      @edit="
        async (value) => {
          item = await http_getOne(Teacher, value);
          item.gender_format = item.gender == 'true' ? 'nam' : 'nữ';
          item.position_name = item.position.name;
          item.position = item.position._id;
          item.diploma = item.diploma[0]._id;
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

  <FormTeacher
    v-if="activeAdd"
    :item="itemAdd"
    :title="`Add a new teacher`"
    @cancel="
      (value) => {
        activeAdd = value;
        itemAdd.position = '';
        itemAdd.diploma = '';
      }
    "
    @submit="create()"
  />
  <FormTeacher
    v-if="activeEdit"
    :item="item"
    :title="`Edit a child`"
    :buttonName="`Edit`"
    @cancel="
      (value) => {
        activeEdit = value;
      }
    "
    @submit="edit()"
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
} from "../../components/common/index.js";

const itemAdd = ref({
  name: "",
  gender: "true",
  gender_format: "nam",
  phone: "",
  email: "",
  address: "",
  position: "",
  diploma: "",
  user_name: "",
  password: "",
  role: "",
});

searchOption.value = [
  { _id: "name", name: "Search by name" },
  { _id: "phone", name: "Search by phone" },
  { _id: "email", name: "Search by e-mail" },
  { _id: "address", name: "Search by address" },
];

const create = async () => {
  const result = await http_create(Teacher, itemAdd.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    activeAdd.value = false;
    itemAdd.value.position = "";
    itemAdd.value.diploma = "";
    refresh();
  }
  backup_items();
};

const edit = async () => {
  console.log(item.value);
  const result = await http_update(Teacher, item.value._id, item.value);
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
      ["Teacher", "E-mail", "Phone"],
      ["name", "email", "phone"],
      "50%"
    );
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(Teacher, item._id);
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
      ["Teacher", "Gender", "E-mail", "Phone"],
      ["name", "gender_format", "email", "phone"],
      "50%"
    );
    if (isRemove) {
      const result = await http_deleteOne(Teacher, item._id);
      if (!result.error) {
        run_alert(alert_success(result.message));
        refresh();
      }
    }
  }
  backup_items();
};

const refresh = async () => {
  items.value = await http_getAll(Teacher);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    gender_format: item.gender == "true" ? "nam" : "nữ",
    position_name: item.position.name,
  }));
};

const filtered = async () => {
  await refresh();
  filters();
};

onBeforeMount(async () => {
  await refresh();
  backup_items();
  positionList.value = await http_getAll(Position);
  diplomaList.value = await http_getAll(Diploma);
});
</script>
