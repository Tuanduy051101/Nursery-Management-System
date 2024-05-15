<template>
  <div class="border border-solid border-slate-300 rounded-md">
    <!-- Header -->
    <div class="flex items-center justify-between my-5 mx-5">
      <div class="w-6/12 flex">
        <FSelect
          style="width: 105px"
          :options="option_entry"
          :modelValue="entryValue"
          :title="`Số bàn ghi`"
          @update:modelValue="
            async (value) => {
              if (value != 'other') {
                currentPage = 1;
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
      :fields="['Tên buổi', 'Thời bắt đầu', 'Thời gian kết thúc']"
      :labels="['name', 'startTimeFormat', 'endTimeFormat']"
      :wrap-list="[false, false, false]"
      :show-action="[false, true, true]"
      :mode="mode"
      :startRow="startRow"
      @delete="(value) => remove(value)"
      @edit="
        async (value) => {
          item = await http_getOne(Session, value);
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
  <FormSession
    v-if="activeAdd"
    :itemAdd="itemAdd"
    :title="`Thêm buổi mới`"
    :placeholder="`Add a new School Year`"
    @cancel="
      (value) => {
        itemAdd.name = '';
        itemAdd.startTime = '';
        itemAdd.endTime = '';
        activeAdd = value;
      }
    "
    @submit="create()"
  />
  <FormSession
    v-if="activeEdit"
    :itemAdd="item"
    :title="`Sửa thông tin buổi`"
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
  FormSchoolYear,
  FormSession,
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
  formatDate,
  formatDateTime,
  ChildcareCenter,
  verifyToken,
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
  reset,
  const_childcareCenter,
  childcareCenterValue,
  childcareCenterList,
  filters,
} from "../../../components/common/index.js";

const itemAdd = ref({
  name: "",
  startTime: "",
  endTime: "",
  childcareCenter: sessionStorage.getItem("owner_childcareCenter"),
});

searchOption.value = [{ _id: "name", name: "Tìm kiếm theo tên buổi" }];

const create = async () => {
  const result = await http_create(Session, itemAdd.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    activeAdd.value = false;
    refresh();
    itemAdd.name = "";
    itemAdd.startTime = "";
    itemAdd.endTime = "";
  }
};

const edit = async () => {
  const result = await http_update(Session, item.value._id, item.value);
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
    const isRemove = await alert_remove(deleteList, ["Tên buổi"], ["name"]);
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(Session, item._id);
      }
    });
    if (isRemove) {
      run_alert(alert_success("Đã xoá thành công."));
      refresh();
    }
  }
  if (deleteList.length == 0) {
    const isRemove = await alert_remove([item], ["Tên buổi"], ["name"]);
    if (isRemove) {
      const result = await http_deleteOne(Session, item._id);
      if (!result.error) {
        run_alert(alert_success(result.message));
        refresh();
      }
    }
  }
};

const refresh = async () => {
  items.value = await http_getAll(Session);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    startTimeFormat: item.startTime,
    endTimeFormat: item.endTime,
    childcareCenterId: item.childcareCenter[item.childcareCenter.length - 1]._id,
  }));
  items.value = items.value.filter(
    (i) => i.childcareCenter.some(j => j._id == sessionStorage.getItem("owner_childcareCenter"))
  );
};

const refreshFilter = async () => {
  items.value = await http_getAll(Session);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    startTimeFormat: item.startTime,
    endTimeFormat: item.endTime,
    childcareCenterId:
      item.childcareCenter[item.childcareCenter.length - 1]._id,
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
  childcareCenterValue.value = childcareCenter.value;
  temp_childcareCenter.value = childcareCenterName.value;
  items.value = items.value.filter(
    (i) => i.childcareCenter.some(j => j._id == sessionStorage.getItem("owner_childcareCenter"))
  );
  childcareCenterList.value = await http_getAll(ChildcareCenter);
});
</script>
