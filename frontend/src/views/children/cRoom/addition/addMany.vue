<template>
  <!-- Header -->
  <p class="text-slate-300 text-lg mx-5 mt-5">Search Filter</p>
  <div class="flex justify-center items-center my-5 mx-5">
    <FSelect
      class="w-full mr-5 text-md"
      :options="ageList"
      :title="const_ag"
      :modelValue="ageValue"
      @update:modelValue="
        async (value) => {
          if (value != 'other') {
            ageValue = value;
            filtered();
          } else
            ageValue = await alert_input_1(
              'number',
              '',
              `Enter the child's age.`
            );
          filtered();
        }
      "
      @refresh="
        async () => {
          ageValue = const_ag;
          await filtered();
        }
      "
      :showClose="true"
    />
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
  </div>
  <div class="border border-solid border-slate-600 border-t-0"></div>
  <!--  -->
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
    </div>
    <BAdd
      @click="
        () => {
          create();
          $emit('update');
        }
      "
    />
  </div>
  <Table
    :items="setPages"
    :fields="['Children', 'Gender', 'Birthday', 'Parents']"
    :labels="['name', 'gender_format', 'birthday_format', 'parent_name']"
    :mode="mode"
    :start-row="startRow"
    :show-action="[true, false, false]"
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
} from "../../../../components/common/index.js";

const props = defineProps({
  classId: {
    type: String,
    required: true,
  },
});

searchOption.value = [
  { _id: "name", name: "Search by class name" },
  { _id: "child_name", name: "Search by child's name" },
];

const create = async () => {
  try {
    const result = await Classes.addChildMany(props.classId, {
      children: items.value,
    });
    if (result.error) run_alert(alert_error(result.message));
    if (!result.error) {
      run_alert(alert_success(result.message));
      refresh();
    }
  } catch (error) {
    console.log(error);
  }
};

const refresh = async () => {
  try {
    items.value = await Classes.getChildrenNoneClass(props.classId);
    items.value = items.value.map((item) => ({
      ...item,
      checked: false,
      birthday_format: formatDate(item.birthday),
      gender_format: item.gender == "true" ? "nam" : "nữ",
      parent_name: item.parentDetails[0].name,
    }));
  } catch (error) {
    console.log(error);
  }
};

const filtered = async () => {
  await refresh();
  filters();
};

onBeforeMount(async () => {
  await refresh();
  backup_items();
});
</script>
