<template>
  <div
    v-if="item?.name"
    class="border border-solid border-slate-300 rounded-md mb-5"
  >
    <!-- <div class="flex justify-between items-start">
      <p
        class="text-lg border border-solid border-t-0 border-l-0 border-slate-300 px-4 py-1.5"
        style="border-radius: 0% 0% 5px 0%"
      >
        Chi tiết thông tin trẻ
      </p>
    </div> -->
    <!-- <div
      v-if="actionPage != 1"
      class="border border-solid border-slate-300 border-b-0"
    ></div> -->
    <div
      v-if="actionPage == 1"
      class="border-0 border-solid border-slate-300 border-b-0 border-t-0"
    ></div>
    <div v-if="actionPage == 6 && item?.name" class="flex justify-start mb-5">
      <div class="px-5">
        <div class="flex text-slate-800 mt-5">
          <!-- class info -->
          <div class="flex mr-5 text-slate-600">
            <div class="flex-col space-y-2">
              <p class="whitespace-nowrap">
                Tên trẻ:
                <span class="text-slate-900 ml-2 whitespace-nowrap">{{
                  item.name
                    .split(" ")
                    .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
                    .join(" ")
                }}</span>
              </p>
              <p class="whitespace-nowrap">
                Giới tính:
                <span
                  class="text-slate-900 ml-2 whitespace-nowrap capitalize"
                  >{{ item.gender == "true" ? "nam" : "nữ" }}</span
                >
              </p>
              <p class="whitespace-nowrap">
                Trạng thái:
                <span class="text-slate-900 ml-2 whitespace-nowrap">{{
                  item.statusChild.charAt(0).toLowerCase() +
                  item.statusChild.slice(1)
                }}</span>
              </p>
              <p class="whitespace-nowrap">
                Học tại:
                <span
                  class="text-slate-900 ml-2 whitespace-nowrap capitalize"
                  >{{
                    item.childcareCenter[item.childcareCenter.length - 1].name
                      .charAt(0)
                      .toUpperCase() +
                    item.childcareCenter[
                      item.childcareCenter.length - 1
                    ].name.slice(1)
                  }}</span
                >
              </p>
            </div>
            <div class="flex-col ml-10 space-y-2">
              <p class="whitespace-nowrap">
                Ngày sinh:
                <span class="text-slate-900 ml-2 whitespace-nowrap">{{
                  formatDate(item.birthday)
                }}</span>
              </p>
              <p class="whitespace-nowrap">
                Địa chỉ thường trú:
                <span class="text-slate-900 ml-2 whitespace-normal">{{
                  item.address
                    .split(" ")
                    .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
                    .join(" ")
                }}</span>
              </p>
              <p class="whitespace-nowrap">
                Ngày nhập học:
                <span class="text-slate-900 ml-2 whitespace-nowrap">{{
                  formatDate(item.startSchooling)
                }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="border border-solid border-slate-300 border-b-0 rounded-md mb-5"
    v-if="actionPage == 6"
  >
    <div class="flex justify-between items-start">
      <p
        class="text-lg border border-solid border-t-0 border-b-0 border-l-0 border-slate-300 px-4 py-1.5"
        style="border-radius: 0% 0% 5px 0%"
      >
        Thông tin phụ huynh
      </p>
    </div>
    <Table
      :items="parentList"
      :fields="[
        'Tên phụ huynh',
        'Giới tính',
        'Số điện thoại',
        'e-mail',
        'Địa chỉ thường trú',
        'Mối quan hệ',
      ]"
      :labels="[
        'name',
        'gender_format',
        'phone',
        'email',
        'address',
        'relationship',
      ]"
      :wrap-list="[false, false, false, false, true, false]"
      :showAction="[false, false, false]"
      :activeSTT="true"
      v-if="actionPage == 6"
    />
  </div>
  <div
    class="border border-solid border-slate-300 rounded-md mb-5"
    v-if="actionPage == 6"
  >
    <div class="flex justify-between items-start">
      <p
        class="text-lg border border-solid border-t-0 border-b-0 border-l-0 border-slate-300 px-4 py-1.5"
        style="border-radius: 0% 0% 5px 0%"
      >
        Thông tin dị ứng
      </p>
    </div>
    <Table
      :items="allergiesList"
      :fields="[
        'Tên chất gây dị ứng',
        'Mô tả',
        'Mức độ',
        'Phản ứng',
        'Giải pháp',
        'Ghi chú',
      ]"
      :labels="[
        'allergenName',
        'allergenDescription',
        'severity',
        'reactionType',
        'treatment',
        'noteValue',
      ]"
      :activeSTT="true"
      :wrap-list="[false, true, false, true, true, true]"
      :showAction="[false, true, true]"
      :borderB="false"
      v-if="actionPage == 6"
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
  Allergies,
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
  FormAddParent,
  FormAllergies,
  FormEditAllergen,
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
  reset,
} from "../../components/common/index.js";

import jsPDF from "jspdf";
import CDIChildren from "./cdi.vue";
import AttendanceChildren from "./attendance.vue";
import MealTicketChildren from "./mealTicket.vue";
import ReceiptChildren from "./receipt.vue";

const actionPage = ref(6);
const actionList = ref([1, 2, 3, 4, 5, 6]);
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const role = ref("");
role.value = sessionStorage.getItem("role");

const parentList = ref([]);
const classList = ref([]);
const receiptList = ref([]);
const activeAddParent = ref(false);
const activeEditParent = ref(false);
const activeAddAllergies = ref(false);
const activeEditAllergies = ref(false);
const parentAdd = ref({
  name: "",
  gender: "true",
  phone: "",
  email: "",
  address: "",
  relationship: "bố",
  province: "",
  district: "",
  ward: "",
});
const parentEdit = ref({});
const allergenEdit = ref({});
const addParent = async () => {
  parentAdd.value.child = props.id;
  parentAdd.value.parents = item.value.parentDetails[0].parents;
  const temp = `${parentAdd.value.address}, ${parentAdd.value.ward}, ${parentAdd.value.district}, ${parentAdd.value.province}`;
  parentAdd.value.address = temp;
  const result = await http_create(ParentDetails, parentAdd.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    activeAddParent.value = false;
    parentAdd.value = {
      name: "",
      gender: "true",
      phone: "",
      email: "",
      address: "",
      relationship: "bố",
      province: "",
      district: "",
      ward: "",
    };
    refresh();
  }
};

const addAllergies = async (value) => {
  for (let v of value) {
    const result = await http_create(Allergies, {
      ...v,
      child: props.id,
    });
    if (result.error) run_alert(alert_error(result.message));
    if (!result.error) {
      run_alert(alert_success(result.message));
    }
  }
  activeAddAllergies.value = false;
  refresh();
};

const editAllergies = async () => {
  const result = await http_update(
    Allergies,
    allergenEdit.value._id,
    allergenEdit.value
  );
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    activeEditAllergies.value = false;
    await refresh();
  }
};

const removeAllergies = async (item) => {
  const deleteList = allergiesList.value.filter((item) => item.checked);
  if (deleteList.length != 0) {
    const isRemove = await alert_remove(
      deleteList,
      ["Chất dị ứng", "Mô tả"],
      ["allergenName", "allergenDescription"],
      "70%"
    );
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(Allergies, item._id);
        if (result.error) run_alert(alert_warning(result.message));
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
      ["Chất dị ứng", "Mô tả"],
      ["allergenName", "allergenDescription"],
      "70%"
    );
    if (isRemove) {
      const result = await http_deleteOne(Allergies, item._id);
      if (result.error) run_alert(alert_warning(result.message));
      if (!result.error) {
        run_alert(alert_success(result.message));
        refresh();
      }
    }
  }
};

const editParent = async () => {
  const temp = `${parentEdit.value.address}, ${parentEdit.value.ward}, ${parentEdit.value.district}, ${parentEdit.value.province}`;
  parentEdit.value.address = temp;
  const result = await http_update(
    ParentDetails,
    parentEdit.value._id,
    parentEdit.value
  );
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    activeEditParent.value = false;
    await refresh();
  }
};

const remove = async (item) => {
  const deleteList = items.value.filter((item) => item.checked);
  if (deleteList.length != 0) {
    const isRemove = await alert_remove(
      deleteList,
      ["Parent", "gender", "phone", "e-mail", "address", "relationship"],
      ["name", "gender_format", "phone", "email", "address", "relationship"],
      "70%"
    );
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(ParentDetails, item._id);
        if (result.error) run_alert(alert_warning(result.message));
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
      ["Parent", "gender", "phone", "e-mail", "address", "relationship"],
      ["name", "gender_format", "phone", "email", "address", "relationship"],
      "70%"
    );
    if (isRemove) {
      const result = await http_deleteOne(ParentDetails, item._id);
      if (result.error) run_alert(alert_warning(result.message));
      if (!result.error) {
        run_alert(alert_success(result.message));
        refresh();
      }
    }
  }
};

const exportToPDF = () => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.setFontSize(16);
  pdf.text("Phiếu Thu Học Phí", pageWidth / 2, 20, { align: "center" });
  pdf.text(`Ngày: ${new Date().toLocaleDateString()}`, 20, 40);
  pdf.text("Số Tiền: $100", 20, 50);
  pdf.text("Họ Tên Học Sinh: John Doe", 20, 60);

  // ... Thêm thêm văn bản cần thiết

  pdf.save("phieuthu.pdf");
};

const allergiesList = ref([]);

const refresh = async () => {
  if (props.id) {
    allergiesList.value = await http_getAll(Allergies);
    console.log(allergiesList.value);
    allergiesList.value = allergiesList.value.filter(
      (i) => i.child._id == props.id
    );
    allergiesList.value = allergiesList.value.map((i) => ({
      ...i,
      noteValue: i.note,
      allergenName: i.allergen.name,
      allergenDescription: i.allergen.description,
    }));
    console.log("xxx", allergiesList.value);
    item.value = await http_getOne(Children, props.id);
    parentList.value = item.value.parentDetails;
    console.log(parentList.value);
    parentList.value = parentList.value.map((item) => ({
      ...item,
      gender_format: item.gender == "true" ? "nam" : "nữ",
    }));
    classList.value = item.value.classes;
    classList.value = classList.value.map((item) => ({
      ...item,
      grade_name: item.grade.name,
      schoolYear_name: item.schoolYear.name,
    }));
  }
};

onBeforeMount(async () => {
  reset();
  await refresh();
});
</script>
