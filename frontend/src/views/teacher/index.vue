<template>
  <div class="border border-solid border-slate-300 rounded-md">
    <!-- Header -->
    <p class="text-blue-700 text-base mx-5 mt-5">Bộ lọc tìm kiếm</p>
    <div class="flex justify-center items-center my-5 mx-5">
      <FSelect
        v-if="isToken"
        class="w-full text-md mr-5"
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
        :optionLarge="true"
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
        <!-- <FSelect
          class="w-28 mx-5"
          :options="option_mode"
          :modelValue="`auto`"
          :title="`Display`"
          v-model="mode"
        /> -->
      </div>
      <div class="flex-1 flex justify-end">
        <BAdd @click="(activeAdd = true), sendData()" />
        <div
          @click="activeTransferWork = !activeTransferWork"
          class="border-2 border-solid bg-yellow-500 border-yellow-500 cursor-pointer rounded-md ml-5 flex items-center px-5 text-lg text-slate-300 hover:shadow-lg hover:shadow-yellow-500/50"
        >
          <label for="" class="cursor-pointer text-white">
            Chuyển công tác
          </label>
        </div>
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="[
        'Mã giáo viên',
        'Họ tên',
        'Giới tính',
        'Số điện thoại',
        'Email',
        'Chức vụ',
      ]"
      :labels="[
        '_id',
        'name',
        'gender_format',
        'phone',
        'email',
        'position_name',
      ]"
      :wrap-list="[false, false, false, false, false, false]"
      :mode="mode"
      :actionList="['Teacher.view']"
      :startRow="startRow"
      @delete="(value) => remove(value)"
      @edit="
        async (value) => {
          item = await http_getOne(Teacher, value);
          item.gender_format = item.gender == 'true' ? 'nam' : 'nữ';
          item.position_name = item.position.name;
          item.position = item.position._id;
          item.diploma = item.diploma[0]._id;
          const temp = item.address.split(', ');
          item.province = temp[3];
          item.district = temp[2];
          item.ward = temp[1];
          item.address = temp[0];
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
    :title="`Thêm giáo viên mới`"
    @cancel="
      (value) => {
        activeAdd = value;
        itemAdd.position = '';
        itemAdd.diploma = '';
        itemAdd.role = '';
        itemAdd.province = '';
        itemAdd.district = '';
        itemAdd.ward = '';
        itemAdd.user_name = '';
        itemAdd.password = '';
        itemAdd.address = '';
      }
    "
    @submit="create()"
  />
  <FormTeacher
    v-if="activeEdit"
    :item="item"
    :title="`Sửa thông tin giáo viên`"
    :buttonName="`Edit`"
    @cancel="
      (value) => {
        activeEdit = value;
      }
    "
    @submit="edit()"
  />
  <FormChangeStatus
    v-if="activeTransferWork"
    :itemAdd="itemTransferWork"
    :title="`Cập nhật thông tin chuyển công tác`"
    @cancel="
      (value) => {
        activeTransferWork = value;
      }
    "
    :type="`transferWork`"
    @submit="transfer_work()"
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
  ChildcareCenter,
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
  FormChangeStatus,
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
  formatDateReverse,
  // eventBus
  eventBus,
  verifyToken,
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
  const_childcareCenter,
  childcareCenterValue,
  childcareCenterList,
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
  province: "",
  district: "",
  ward: "",
  startWorking: formatDateReverse(),
  childcareCenter: sessionStorage.getItem("owner_childcareCenter"),
});

searchOption.value = [
  { _id: "_id", name: "Tìm theo mã giáo viên" },
  { _id: "name", name: "Tìm theo tên giáo viên" },
  { _id: "phone", name: "Tìm theo số điện thoại" },
  { _id: "email", name: "Tìm kiếm theo địa chỉ e-mail" },
  { _id: "address", name: "Tìm kiếm theo địa chỉ thường trú" },
];

const activeTransferWork = ref(false);

const itemTransferWork = ref({
  childcareCenter: "",
  date: formatDateReverse(),
});

const create = async () => {
  const temp = `${itemAdd.value.address}, ${itemAdd.value.ward}, ${itemAdd.value.district}, ${itemAdd.value.province}`;
  itemAdd.value.address = temp;
  const result = await http_create(Teacher, itemAdd.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    activeAdd.value = false;
    itemAdd.value.position = "";
    itemAdd.value.diploma = "";
    itemAdd.value.role = "";
    itemAdd.value.province = "";
    itemAdd.value.district = "";
    itemAdd.value.ward = "";
    itemAdd.value.user_name = "";
    itemAdd.value.password = "";
    itemAdd.value.address = "";
    refresh();
  }
  backup_items();
};

const edit = async () => {
  const temp = `${item.value.address}, ${item.value.ward}, ${item.value.district}, ${item.value.province}`;
  item.value.address = temp;
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
      ["Tên giáo viên", "Giới tính", "E-mail", "Số điện thoại"],
      ["name", "email", "phone"],
      "50%"
    );
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(Teacher, item._id);
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
      ["Tên giáo viên", "Giới tính", "E-mail", "Số điện thoại"],
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

const transfer_work = async () => {
  try {
    const check = await Teacher.transfer_work({
      teacher: items.value.filter((item) => item.checked),
      ...itemTransferWork.value,
    });
    if (check.error) {
      run_alert(alert_error(check.message));
    } else {
      run_alert(alert_success(check.message));
      activeTransferWork.value = false;
      refresh();
    }
  } catch (error) {
    console.log(error);
  }
};

const refresh = async () => {
  items.value = await http_getAll(Teacher);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    gender_format: item.gender == "true" ? "nam" : "nữ",
    position_name: item.position.name,
    childcareCenterId:
      item.childcareCenter[item.childcareCenter.length - 1]._id,
  }));
  items.value = items.value.filter(
    (i) =>
      i.childcareCenter[i.childcareCenter.length - 1]._id ==
      childcareCenter.value
  );
};

const refreshFilter = async () => {
  items.value = await http_getAll(Teacher);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    gender_format: item.gender == "true" ? "nam" : "nữ",
    position_name: item.position.name,
    childcareCenterId:
      item.childcareCenter[item.childcareCenter.length - 1]._id,
  }));
};

const filtered = async () => {
  await refreshFilter();
  filters();
  currentPage.value = 1;
};
const socket = inject("socket");
const sendData = () => {
  console.log("send data");
  socket.emit("message", "Hello, WebSocket!");
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
    (i) =>
      i.childcareCenter[i.childcareCenter.length - 1]._id ==
      childcareCenter.value
  );
  backup_items();
  positionList.value = await http_getAll(Position);
  diplomaList.value = await http_getAll(Diploma);
  childcareCenterList.value = await http_getAll(ChildcareCenter);
});
</script>
