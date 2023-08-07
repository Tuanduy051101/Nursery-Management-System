<template>
  <div class="border border-solid border-slate-600 rounded-md">
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
      :fields="['Grade', 'Description', 'Amount classes', 'Collection Rates']"
      :labels="['name', 'description', 'totalClass', 'totalCollectionRates']"
      :mode="mode"
      :startRow="startRow"
      @delete="(value) => remove(value)"
      @edit="
        async (value) => {
          item = await http_getOne(TuitionFees, value);
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
    :name="`grade`"
    :title="`Add a new grade`"
    :placeholder="`Add a new grade`"
    @cancel="(value) => (activeAdd = value)"
    @submit="create()"
  />
  <FormOne
    v-if="activeEdit"
    :item="item"
    :name="`grade`"
    :title="`Edit a grade`"
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
} from "../../../assets/js/imports";
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
} from "../../../components/common/index.js";

const itemAdd = ref({
  name: "",
  description: "",
});

searchOption.value = [
  { _id: "name", name: "Search by name" },
];

const create = async () => {
  const result = await http_create(Grade, itemAdd.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    activeAdd.value = false;
    refresh();
  }
};

const edit = async () => {
  const result = await http_update(Grade, item.value._id, item.value);
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
    const isRemove = await alert_remove(deleteList, ["Grade"], ["name"]);
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(Grade, item._id);
      }
    });
    if (isRemove) {
      run_alert(alert_success("Successfully deleted."));
      refresh();
    }
  }
  if (deleteList.length == 0) {
    const isRemove = await alert_remove([item], ["Grade"], ["name"]);
    if (isRemove) {
      const result = await http_deleteOne(Grade, item._id);
      if (!result.error) {
        run_alert(alert_success(result.message));
        refresh();
      }
    }
  }
};

const refresh = async () => {
  items.value = await http_getAll(Grade);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    totalClass: item.classes.length,
    totalCollectionRates: formatCurrencyVND(
      item.collectionRates.reduce((acc, r) => acc + r.money, 0)
    ),
  }));
};

onBeforeMount(async () => {
  refresh();
});
</script>