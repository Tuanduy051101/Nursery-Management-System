<template>
  <!-- Header -->
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
      <router-link :to="{ name: 'ClassRoom.add', params: { id: classId } }">
        <BAdd @click="activeAdd = true" />
      </router-link>
      <input
        @click="print = true"
        class="text-slate-300 border border-solid py-2 px-6 rounded-md border-slate-600 hover:border-slate-300 cursor-pointer ml-5"
        type="submit"
        value="Print"
      />
    </div>
  </div>
  <Table
    :items="setPages"
    :fields="['Children', 'Gender', 'Birthday', 'Address', 'Parents']"
    :labels="[
      'name',
      'gender_format',
      'birthday_format',
      'address',
      'parent_name',
    ]"
    :mode="mode"
    :startRow="startRow"
    @delete="(value) => remove(value)"
    :show-action="[true, false, true]"
  />
  <Pagination
    :numberOfPages="numberOfPages"
    :totalRow="totalRow"
    :startRow="startRow"
    :endRow="endRow"
    v-model:currentPage="currentPage"
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
} from "../../../../components/common/index.js";
const props = defineProps({
  classId: {
    type: String,
    required: true,
  },
  children: {
    type: Array,
    required: true,
    default: [],
  },
});

searchOption.value = [
  { _id: "name", name: "Search by name" },
  { _id: "address", name: "Search by address" },
];

const remove = async (item) => {
  const deleteList = items.value.filter((item) => item.checked);
  if (deleteList.length != 0) {
    const isRemove = await alert_remove(
      deleteList,
      ["Children"],
      ["name"],
      "40%"
    );
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await Classes.removeChildMany(props.classId, {
          children: items.value,
        });
      }
    });
    if (isRemove) {
      run_alert(alert_success("Successfully deleted."));
      refresh();
    }
  }
  if (deleteList.length == 0) {
    const isRemove = await alert_remove([item], ["Children"], ["name"], "40%");
    if (isRemove) {
      const result = await Classes.removeChild(props.classId, {
        child: item._id,
      });
      if (!result.error) {
        run_alert(alert_success(result.message));
        refresh();
      }
    }
  }
  backup_items();
};

const refresh = async () => {
  items.value = await http_getOne(Classes, props.classId);
  items.value = items.value[0].children;
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    birthday_format: formatDate(item.birthday),
    gender_format: item.gender == "true" ? "nam" : "nữ",
    parent_name: item.parentDetails[0].name,
  }));
};

onBeforeMount(async () => {
  await refresh();
});
</script>
