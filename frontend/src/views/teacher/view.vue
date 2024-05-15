<template>
  <div
    v-if="item?.name"
    class="border border-solid border-slate-300 rounded-md mb-5"
  >
    <div class="flex justify-between items-start">
      <p
        class="text-lg border border-solid border-t-0 border-l-0 border-slate-300 px-4 py-1.5"
        style="border-radius: 0% 0% 5px 0%"
      >
        Chi tiết thông tin giáo viên
      </p>
      <div class="flex justify-end mx-5 my-5 text-slate-900">
        <div
          class="border border-solid px-4 py-1 cursor-pointer flex items-center"
          :class="
            actionPage == 1
              ? 'border-2 border-green-500 bg-green-500 text-white'
              : 'text-slate-900 border-slate-300 hover:bg-gray-200 hover:border-gray-200'
          "
          @click="actionPage = 1"
        >
          Bằng cấp
        </div>
        <div
          class="border border-solid border-l-0 px-4 py-1 cursor-pointer flex items-center"
          :class="
            actionPage == 2
              ? 'border-2 border-green-500 bg-green-500 text-white'
              : 'text-slate-900 border-slate-300 hover:bg-gray-200 hover:border-gray-200'
          "
          @click="actionPage = 2"
        >
          Phân công
        </div>
      </div>
    </div>
    <div class="border-t border-solid border-slate-300"></div>
    <div class="flex my-5">
      <div
        class="flex w-full justify-between mx-5 border border-slate-300 text-slate-600"
      >
        <div class="flex w-1/2 flex-col space-y-2">
          <span
            >Tên giáo viên:
            <span class="text-slate-900 ml-2 whitespace-nowrap">{{
              item.name
                .split(" ")
                .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
                .join(" ")
            }}</span></span
          >
          <span
            >Giới tính:<span class="text-slate-900 ml-2 whitespace-nowrap">{{
              item.gender ? "Nam" : "Nữ"
            }}</span></span
          >
          <span
            >Địa chỉ thường trú:<span
              class="text-slate-900 ml-2 whitespace-normal"
              >{{
                item.address
                  .split(" ")
                  .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
                  .join(" ")
              }}</span
            ></span
          >
        </div>
        <div class="flex w-1/2 flex-col ml-5 space-y-2">
          <span
            >Số điện thoại:<span
              class="text-slate-900 ml-2 whitespace-nowrap"
              >{{ item.phone }}</span
            ></span
          >
          <span
            >Email:<span class="text-slate-900 whitespace-nowrap ml-2">{{
              item.email
            }}</span></span
          >
          <span
            >Chức vụ:
            <span class="text-slate-900 whitespace-nowrap ml-2">{{
              item.position.name
                .split(" ")
                .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
                .join(" ")
            }}</span></span
          >
          <span
            >Ngày bắt đầu công tác:
            <span class="text-slate-900 whitespace-nowrap ml-2">{{
              formatDate(item.startWorking)
            }}</span></span
          >
          <span
            >Nơi công tác:
            <span class="text-slate-900 whitespace-nowrap ml-2">{{
              item.childcareCenter[item.childcareCenter.length-1].name.charAt(0).toUpperCase() +
              item.childcareCenter[item.childcareCenter.length-1].name.slice(1)
            }}</span></span
          >
        </div>
      </div>
    </div>
    <DiplomaTeacher
      v-if="actionPage == 1"
      :teacher_id="id"
      :diploma-list="item.diploma"
    />
    <AssignmentTeacher
      v-if="actionPage == 2"
      :teacher_id="id"
      :assignment-list="item.assignment"
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
  // eventBus
  eventBus,
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
  reset,
} from "../../components/common/index.js";

import DiplomaTeacher from "./diploma.vue";
import AssignmentTeacher from "./assignment.vue";

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

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const actionPage = ref(1);

searchOption.value = [{ _id: "name", name: "Search by name" }];

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
  if (props.id) {
    item.value = await http_getOne(Teacher, props.id);
  }
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
const socket = inject("socket");
const sendData = () => {
  console.log("send data");
  socket.emit("message", "Hello, WebSocket!");
};

onBeforeMount(async () => {
  reset();
  await refresh();
  backup_items();
  positionList.value = await http_getAll(Position);
  diplomaList.value = await http_getAll(Diploma);
});
</script>
