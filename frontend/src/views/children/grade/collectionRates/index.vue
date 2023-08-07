<template>
  <div class="border border-solid border-slate-600 rounded-md">
    <!-- Header -->
    <p class="text-slate-300 text-lg mx-5 mt-5">Search Filter</p>
    <div class="flex justify-center items-center my-5">
      <FSelect
        class="w-full ml-5 text-md"
        :options="position"
        :modelValue="` Select school year`"
        v-model="positionValue"
      />
      <FSelect
        class="w-full mx-5 text-md"
        :options="diploma"
        :modelValue="` Select grade`"
        v-model="diplomaValue"
      />
    </div>
    <div class="border border-solid my-5 border-slate-600 border-b-0"></div>
    <div class="flex items-center justify-between my-5 mx-5">
      <div class="w-6/12 flex">
        <FSelect
          class="w-20"
          :options="option_entry"
          :modelValue="entryValue"
          :title="`Record`"
          @update:modelValue="
            async (value) => {
              if (value != 'other') {
                entryValue = value;
                currentPage = 1;
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
      :fields="['Tuition fees', 'Grade', 'School year', 'money']"
      :labels="['tuitionFees', 'grade', 'schoolYear', 'money']"
      :mode="mode"
      :startRow="startRow"
      @delete="(value) => remove(value)"
      @edit="
        async (value) => {
          item = await http_getOne(CollectionRates, value);
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
    :title="`Add a new collection rates`"
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
    :title="`Edit a collection rates`"
    :buttonName="`Edit`"
    @cancel="(value) => (activeEdit = value)"
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
} from "../../../../assets/js/imports";
//
import {
  items,
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
} from "../../../../components/common/index.js";

const itemAdd = ref({
  money: "",
  money_d: "",
  grade: "",
  tuitionFees: "",
  schoolYear: "",
});

searchOption.value = [{ _id: "money", name: "Search by money" }];

const create = async () => {
  const result = await http_create(CollectionRates, itemAdd.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    activeAdd.value = false;
    refresh();
  }
};

const edit = async () => {
  const result = await http_update(CollectionRates, item.value._id, item.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    activeEdit.value = false;
    refresh();
  }
};

const remove = async (item) => {
  const deleteList = items.value.filter((item) => item.checked);
  if (deleteList.length != 0) {
    const isRemove = await alert_remove(
      deleteList,
      ["Tuition fees", "Grade", "School year", "Money"],
      ["tuitionFees", "grade", "schoolYear", "money"]
    );
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(CollectionRates, item._id);
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
      ["Tuition fees", "Grade", "School year", "Money"],
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
};

const refresh = async () => {
  items.value = await http_getAll(CollectionRates);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    money: formatCurrencyVND(item.money),
    grade: item.grade.name,
    schoolYear: item.schoolYear.name,
    tuitionFees: item.tuitionFees.name,
  }));
};

onBeforeMount(async () => {
  refresh();
});
</script>
