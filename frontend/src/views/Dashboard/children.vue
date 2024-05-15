<template>
  <div
    class="bg-inherit border border-solid border-slate-300 py-5 rounded-lg mb-5"
  >
    <div class="flex justify-between px-6">
      <h3 class="text-lg text-slate-900 font-semibold mb-4">Danh sách trẻ</h3>
      <span
        class="material-symbols-outlined text-slate-900 font-bold cursor-pointer"
      >
        more_vert
      </span>
    </div>
    <div class="flex px-6 mb-5">
      <FSelect
        class="w-full text-md"
        :options="schoolYearList"
        :modelValue="const_sy"
        :title="const_sy"
        @update:modelValue="
          async (value) => {
            schoolYearValue = value;
            await refresh();
          }
        "
        @refresh="
          async () => {
            schoolYearValue = const_sy;
            gradeValue = const_gr;
            classValue = const_cl;
            typeValue = const_type;
            await refresh();
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
            await refresh();
          }
        "
        @refresh="
          async () => {
            gradeValue = const_gr;
            classValue = const_cl;
            typeValue = const_type;
            await refresh();
          }
        "
        :showClose="true"
        :disabled="schoolYearValue == const_sy && true"
      />
      <FSelect
        class="w-full text-md"
        :options="classList"
        :modelValue="const_cl"
        :title="const_cl"
        @update:modelValue="
          async (value) => {
            classValue = value;
            await refresh();
          }
        "
        @refresh="
          async () => {
            classValue = const_cl;
            typeValue = const_type;
            await refresh();
          }
        "
        :showClose="true"
        :disabled="
          schoolYearValue == const_sy || (gradeValue == const_gr && true)
        "
      />
      <FSelect
        class="w-full text-md ml-5"
        :options="typeList"
        :modelValue="const_type"
        :title="const_type"
        :optionLarge="true"
        @update:modelValue="
          async (value) => {
            typeValue = value;
            await refresh();
          }
        "
        @refresh="
          async () => {
            typeValue = const_type;
            await refresh();
          }
        "
        :showClose="true"
        :disabled="schoolYearValue == const_sy && true"
      />
    </div>
    <Table
      :items="setPages"
      :fields="[
        'Mã trẻ',
        'Họ tên',
        'Giới tính',
        'Ngày sinh',
        'Tên phụ huynh',
        'Số điện thoại',
      ]"
      :labels="[
        '_id',
        'name',
        'gender_format',
        'birthday_format',
        'parent_name',
        'parent_phone',
      ]"
      :wrap-list="[false, false, false, false, false, false]"
      :mode="mode"
      :startRow="startRow"
      :show-action="[true, false, false]"
      :showCheckbox="false"
      @view="
        (value) => {
          idChild = value;
          activeViewDetailChild = true;
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
  <FormViewDetailChild
    v-if="activeViewDetailChild"
    :title="`Chi tiết thông tin trẻ`"
    :id="idChild"
    @cancel="
      async (value) => {
        activeViewDetailChild = value;
        await refresh();
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
  FormChildren,
  FormAssignment,
  FormChangeStatus,
  FormViewDetailChild,
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
  excelNumberToDate,
  formatDateReverse,
  // exel
  XLSX,
  generateOTP,
  jsPDF,
} from "../../assets/js/imports";
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
  reset,
  classList,
  classValue,
  const_cl,
  const_statusChild,
  statusChildValue,
  statusChildList,
} from "../../components/common";
const const_type = ref("Loại danh sách");
const typeValue = ref("");
const role = ref(sessionStorage.getItem("role"));
const typeList = ref([]);
const activeViewDetailChild = ref(false);
const idChild = ref("");

if (role.value == "ban giám hiệu" || role.value == "quản trị hệ thống") {
  typeList.value.push({
    _id: "1",
    name: "danh sách trẻ chưa xếp lớp",
  });
}
if (role.value == "ban giám hiệu" || role.value == "quản trị hệ thống") {
  typeList.value.push({
    _id: "7",
    name: "danh sách trẻ nhập học",
  });
}

if (role.value == "ban giám hiệu" || role.value == "quản trị hệ thống") {
  typeList.value.push({
    _id: "4",
    name: "danh sách trẻ đang học",
  });
}

if (role.value == "ban giám hiệu" || role.value == "quản trị hệ thống") {
  typeList.value.push({
    _id: "5",
    name: "danh sách trẻ tạm ngưng học",
  });
}

if (role.value == "ban giám hiệu" || role.value == "quản trị hệ thống") {
  typeList.value.push({
    _id: "6",
    name: "danh sách trẻ hoàn thành học tại trường",
  });
}

typeList.value.push(
  {
    _id: "2",
    name: "danh sách trẻ chưa đóng học phí",
  },
  {
    _id: "3",
    name: "danh sách trẻ đã đóng học phí",
  }
);

const handleFilter = async () => {
  if (
    gradeValue.value != const_gr.value &&
    gradeValue.value &&
    schoolYearValue.value != const_sy.value &&
    schoolYearValue.value
  ) {
    classList.value = await http_getAll(Classes);
    classList.value = classList.value.filter(
      (item) =>
        item.grade._id == gradeValue.value &&
        item.schoolYear._id == schoolYearValue.value
    );
  }
  if (
    gradeValue.value == const_gr.value &&
    schoolYearValue.value == const_sy.value
  ) {
    classList.value = [];
    classValue.value = const_cl.value;
  }
};

const refresh = async () => {
  const childcareCenter = sessionStorage.getItem("owner_childcareCenter");
  items.value = (await http_getAll(Children)).filter(
    (i) =>
      i.childcareCenter[i.childcareCenter.length - 1]._id == childcareCenter
  );
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    birthday_format: formatDate(item.birthday),
    parent_name: item.parentDetails[0].name,
    parent_phone: item.parentDetails[0].phone,
    parent_email: item.parentDetails[0].email,
    gender_format: item.gender == "true" ? "nam" : "nữ",
    schoolYear: item.classes.map((item1) => item1.schoolYear._id),
    grade: item.classes.map((item1) => item1.grade._id),
    age_format:
      new Date().getFullYear() - new Date(item.birthday).getFullYear(),
  }));
  if (typeValue.value == 1) {
    items.value = items.value.filter((i) =>
      i.classes.every((j) => {
        return j.schoolYear._id != schoolYearValue.value;
      })
    );
  } else if (typeValue.value == 2) {
    items.value = items.value.filter((i) =>
      i.receipt.some(
        (j) =>
          j.status == "false" &&
          j.classes.schoolYear._id == schoolYearValue.value
      )
    );
    if (gradeValue.value != const_gr.value) {
      items.value = items.value.filter((i) =>
        i.receipt.some(
          (j) => j.status == "false" && j.classes.grade._id == gradeValue.value
        )
      );
    }
    if (classValue.value != const_cl.value) {
      items.value = items.value.filter((i) =>
        i.receipt.some(
          (j) => j.status == "false" && j.classes._id == classValue.value
        )
      );
    }
  } else if (typeValue.value == 3) {
    items.value = items.value.filter((i) =>
      i.receipt.some((j) => {
        console.log(j.classes.schoolYear._id);
        console.log(schoolYearValue.value);
        return (
          j.status == "true" &&
          j.classes.schoolYear._id == schoolYearValue.value
        );
      })
    );
    if (gradeValue.value != const_gr.value) {
      console.log("chay1");
      items.value = items.value.filter((i) =>
        i.receipt.some(
          (j) => j.status == "true" && j.classes.grade._id == gradeValue.value
        )
      );
    }
    if (classValue.value != const_cl.value) {
      console.log("chay2");
      items.value = items.value.filter((i) =>
        i.receipt.some(
          (j) => j.status == "true" && j.classes._id == classValue.value
        )
      );
    }
  } else if (typeValue.value == 4) {
    items.value = items.value.filter((i) => i.statusChild == "đang học");
  } else if (typeValue.value == 5) {
    items.value = items.value.filter((i) => i.statusChild == "tạm ngưng học");
  } else if (typeValue.value == 6) {
    items.value = items.value.filter((i) => i.statusChild == "hoàn thành");
  } else if (typeValue.value == 7) {
    items.value = items.value.filter((i) => i.statusChild == "nhập học");
  }
};
watch(gradeValue, async (n, o) => {
  await handleFilter();
});

watch(schoolYearValue, async (n, o) => {
  await handleFilter();
});
onBeforeMount(async () => {
  const childcareCenter = sessionStorage.getItem("owner_childcareCenter");
  schoolYearList.value = (await http_getAll(SchoolYear)).filter(
    (i) => i.childcareCenter._id == childcareCenter
  );
  gradeList.value = await http_getAll(Grade);
  await refresh();
});
</script>
