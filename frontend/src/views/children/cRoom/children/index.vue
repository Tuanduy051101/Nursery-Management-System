<template>
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
      <FSearch
        class="flex-1 ml-5"
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
      <router-link
        v-if="role != 'Teacher'"
        :to="{
          name: role == 'Teacher' ? 'ClassRoom-teacher.add' : 'ClassRoom.add',
          params: { id: classId },
        }"
      >
        <BAdd @click="activeAdd = true" class="ml-5 h-full" />
      </router-link>
      <div
        ref="selectRef"
        class="group relative h-10 border-2 border-solid border-gray-200 bg-gray-200 hover:shadow-lg hover:shadow-yellow-500/50 cursor-pointer rounded-md ml-5 flex items-center px-5"
      >
        <label
          class="group cursor-pointer text-black"
          @click="activeExport = true"
        >
          Xuất file
        </label>
        <ul
          v-if="activeExport"
          class="w-full group absolute right-0 mt-32 py-2 bg-white border border-gray-300 rounded-md shadow-lg z-10"
        >
          <li @click="export_pdf" class="px-4 hover:bg-gray-100 cursor-pointer">
            <span class="text-sm text-black">pdf</span>
          </li>
          <li
            @click="export_excel"
            class="px-4 hover:bg-gray-100 cursor-pointer"
          >
            excel
          </li>
        </ul>
      </div>
    </div>
  </div>
  <Table
    :items="setPages"
    :fields="[
      'Mã trẻ',
      'Tên trẻ',
      'Giới tính',
      'Ngày sinh',
      'Tên phụ huynh',
      'Số điện thoại'
    ]"
    :labels="[
      '_id',
      'name',
      'gender_format',
      'birthday_format',
      'parent_name',
      'parent_phone',
    ]"
    :wrap-list="[false, false, false, false, false]"
    :mode="mode"
    :startRow="startRow"
    @delete="(value) => remove(value)"
    :show-action="[true, false, role == 'giáo viên quản lý trẻ' ? false : true]"
    @view="
        (value) => {
          idChild = value;
          activeViewDetailChild = true;
        }
      "
  />
  <!-- :action-list="[
      role == 'Teacher' ? 'Children-teacher.view' : 'Children.view',
    ]" -->
    {{ activeViewDetailChild }} {{ idChild }}
  <Pagination
    :numberOfPages="numberOfPages"
    :totalRow="totalRow"
    :startRow="startRow"
    :endRow="endRow"
    v-model:currentPage="currentPage"
  />
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
  XLSX,
  generateOTP,
  jsPDF,
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
  resetFilter,
  reset,
} from "../../../../components/common/index.js";
import "jspdf-autotable";

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

const activeExport = ref(false);
const selectRef = ref(null);
const activeViewDetailChild = ref(false);
const idChild = ref("");

const handleClickOutside = (event) => {
  if (selectRef.value != null) {
    if (!selectRef.value.contains(event.target)) {
      activeExport.value = false;
    }
  }
};

const role = ref("");
role.value = sessionStorage.getItem("role");

searchOption.value = [
  { _id: "name", name: "Tìm kiếm theo mã trẻ" },
  { _id: "name", name: "Tìm kiếm theo tên trẻ" },
];

const remove = async (item) => {
  const deleteList = items.value.filter((item) => item.checked);
  if (deleteList.length != 0) {
    const isRemove = await alert_remove(
      deleteList,
      ["Tên trẻ"],
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
      run_alert(alert_success("Đã xoá trẻ ra khỏi lớp thành công."));
      await refresh();
    }
  }
  if (deleteList.length == 0) {
    const isRemove = await alert_remove([item], ["Tên trẻ"], ["name"], "40%");
    if (isRemove) {
      const result = await Classes.removeChild(props.classId, {
        child: item._id,
      });
      if (!result.error) {
        run_alert(alert_success(result.message));
        await refresh();
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
    parent_phone: item.parentDetails[0].phone,
  }));
};

const export_excel = async () => {
  const temp = await http_getOne(Classes, props.classId);
  const data = [
    [`Danh sách lớp ${temp[0].name}`],
    [
      "Children",
      "Children's gender",
      "Children's Birthday",
      "Children's address",
      "Parents's name",
      "Parent's gender",
      "Phone",
      "Email",
      "Parent's address",
      "Relationship",
    ],
  ];

  for (let value of items.value) {
    data.push([
      value.name,
      value.gender_format,
      value.birthday,
      value.address,
      value.parentDetails[0].name,
      value.parentDetails[0].gender == "true" ? "nam" : "nữ",
      value.parentDetails[0].phone,
      value.parentDetails[0].email,
      value.parentDetails[0].address,
      value.parentDetails[0].relationship,
    ]);
  }

  // Tạo workbook và worksheet mới
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Thêm worksheet vào workbook
  XLSX.utils.book_append_sheet(wb, ws, "Danh sách");

  // Tạo Blob từ workbook
  const blob = new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Tạo URL cho blob và tạo một thẻ a để tải file
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "danh_sach.xlsx";
  a.click();

  // Giải phóng URL
  URL.revokeObjectURL(url);
};

const export_pdf = () => {
  const data = [
    ["Danh sách trẻ"],
    ["Tên", "Tuổi"],
    ["Nguyễn Văn A", 25],
    ["Trần Thị B", 30],
    // ...Thêm dữ liệu khác
  ];

  // Tạo đối tượng jsPDF
  const doc = new jsPDF();

  // Thêm nội dung vào PDF
  doc.text("Danh sách trẻ", 10, 10);
  doc.autoTable({
    head: [["Tên", "Tuổi"]],
    body: data.slice(1), // Loại bỏ tiêu đề cột
  });

  // Lưu file PDF
  doc.save("danh_sach.pdf");
};

onBeforeMount(async () => {
  reset();
  await refresh();
});
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
