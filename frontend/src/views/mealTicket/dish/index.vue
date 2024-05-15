<template>
  <div class="border border-solid border-slate-300 rounded-md">
    <!-- Header -->
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
        <FSelect
          v-if="isToken"
          class="w-full text-md ml-5"
          :options="childcareCenterList"
          :modelValue="temp_childcareCenter"
          :title="const_childcareCenter"
          @update:modelValue="
            async (value) => {
              childcareCenterValue = value;
              await filtered();
            }
          "
          @refresh="
            async () => {
              childcareCenterValue = const_childcareCenter;
              await filtered();
            }
          "
          :showClose="true"
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
      :fields="['Tên món ăn', 'Chức năng', 'Lưu ý']"
      :labels="['name', 'function', '_note']"
      :wrap-list="[false, true, true]"
      :mode="mode"
      :startRow="startRow"
      @delete="(value) => remove(value)"
      @edit="
        async (value) => {
          activeEdit = true;
          item = items.filter((item) => item._id == value);
          item = item[0];
        }
      "
      :actionList="[role == 'nhân viên bếp' ? 'Dish-chef.view' : 'Dish.view']"
    />
    <Pagination
      :numberOfPages="numberOfPages"
      :totalRow="totalRow"
      :startRow="startRow"
      :endRow="endRow"
      v-model:currentPage="currentPage"
    />
    <FormDish
      v-if="activeAdd"
      :item="itemAdd"
      :title="`Thêm món ăn mới`"
      @cancel="
        (value) => {
          activeAdd = value;
          itemAdd = {
            name: '',
            note: '',
            cooking: '',
            function: '',
            ingredients: [
              {
                name_i: '',
                amount_i: '',
                function_i: '',
                note_i: '',
                making_i: '',
              },
            ],
          };
        }
      "
      @submit="create()"
      @add_i="
        () => {
          itemAdd.ingredients.push({
            name_i: '',
            amount_i: '',
            function_i: '',
            note_i: '',
            making_i: '',
          });
        }
      "
      @remove_i="
        (value) => {
          itemAdd.ingredients.splice(value, 1);
        }
      "
    />
    <FormDish
      v-if="activeEdit"
      :item="item"
      :title="`Sửa thông tin món ăn`"
      @cancel="
        (value) => {
          activeEdit = value;
        }
      "
      @submit="edit()"
      :button-name="`Edit`"
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
  verifyToken,
  ChildcareCenter
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
  reset,
  const_childcareCenter,
  childcareCenterValue,
  childcareCenterList,
} from "../../../components/common/index.js";

const itemAdd = ref({
  name: "",
  note: "",
  cooking: "",
  function: "",
  ingredients: [
    {
      name_i: "",
      amount_i: "",
      function_i: "",
      note_i: "",
      making_i: "",
    },
  ],
});

const role = ref('');
role.value = sessionStorage.getItem("role");

searchOption.value = [
  { _id: "name", name: "Tìm kiếm theo tên món ăn" },
  { _id: "function", name: "Tìm kiếm theo chức năng món ăn" },
];

const create = async () => {
  const result = await http_create(Dish, {
    ...itemAdd.value,
    childcareCenter: sessionStorage.getItem('owner_childcareCenter')
  });
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    refresh();
    run_alert(alert_success(result.message));
    activeAdd.value = false;
    itemAdd.value = {
      name: "",
      note: "",
      cooking: "",
      function: "",
      ingredients: [
        {
          name_i: "",
          amount_i: "",
          function_i: "",
          note_i: "",
          making_i: "",
        },
      ],
    };
  }
};

const edit = async () => {
  const result = await http_update(Dish, item.value._id, item.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    activeEdit.value = false;
    await refresh();
  }
};

const remove = async (item) => {
  const deleteList = items.value.filter((item) => item.checked);
  if (deleteList.length != 0) {
    const isRemove = await alert_remove(
      deleteList,
      ["Tên món ăn"],
      ["name"],
    );
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(Dish, item._id);
      }
    });
    if (isRemove) {
      run_alert(alert_success("Đã tạo thành công."));
      refresh();
    }
  }
  if (deleteList.length == 0) {
    const isRemove = await alert_remove(
      [item],
      ["Tên món ăn"],
      ["name"],
    );
    if (isRemove) {
      const result = await http_deleteOne(Dish, item._id);
      if (!result.error) {
        run_alert(alert_success(result.message));
        refresh();
      }
    }
  }
};

const refresh = async () => {
  items.value = await http_getAll(Dish);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    _note: item.note,
    childcareCenterId: item.childcareCenter._id,
  }));
  items.value = items.value.filter(
    (i) => i.childcareCenter._id == childcareCenter.value
  );
};

const refreshFilter = async () => {
  items.value = await http_getAll(Dish);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    _note: item.note,
    childcareCenterId: item.childcareCenter._id,
  }));
};

const filtered = async () => {
  await refreshFilter();
  filters();
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
  childcareCenterValue.value = childcareCenter;
  temp_childcareCenter.value = childcareCenterName.value;
  items.value = items.value.filter(
    (i) => i.childcareCenter._id == childcareCenter.value
  );
  childcareCenterList.value = await http_getAll(ChildcareCenter);
});
</script>

