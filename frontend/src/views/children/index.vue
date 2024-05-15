<template>
  <div class="border border-solid border-slate-300 rounded-md">
    <p class="text-blue-700 text-base mx-5 mt-5">Bộ lọc tìm kiếm</p>
    <div class="flex justify-center items-center mx-5 my-5" v-if="isToken">
      <FSelect
        class="w-full text-md"
        :options="childcareCenterList"
        :modelValue="temp_childcareCenter"
        :title="const_childcareCenter"
        @update:modelValue="
          async (value) => {
            childcareCenterValue = value;
            await filtered1();
            schoolYearList = await http_getAll(SchoolYear);
            schoolYearList = schoolYearList.filter(
              (i) =>
                i.childcareCenter[i.childcareCenter.length - 1]._id ==
                childcareCenter
            );
          }
        "
        @refresh="
          async () => {
            childcareCenterValue = const_childcareCenter;
            await filtered1();
          }
        "
        :showClose="true"
      />
    </div>
    <div class="flex justify-center items-center mx-5 my-5">
      <FSelect
        class="w-full text-md"
        :options="schoolYearList"
        :modelValue="const_sy"
        :title="const_sy"
        @update:modelValue="
          async (value) => {
            schoolYearValue = value;
            await filtered1();
          }
        "
        @refresh="
          async () => {
            schoolYearValue = const_sy;
            await filtered1();
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
            await filtered1();
          }
        "
        @refresh="
          async () => {
            gradeValue = const_gr;
            await filtered1();
          }
        "
        :showClose="true"
      />
      <FSelect
        class="w-full text-md"
        :options="classList"
        :modelValue="const_cl"
        :title="const_cl"
        @update:modelValue="
          async (value) => {
            classValue = value;
            await filtered1();
          }
        "
        @refresh="
          async () => {
            classValue = const_cl;
            await filtered1();
          }
        "
        :showClose="true"
      />
    </div>
    <div class="flex justify-center items-center mx-5 my-5">
      <FSelect
        class="w-full mr-5 text-md"
        :options="ageList"
        :title="const_ag"
        :modelValue="const_ag"
        @update:modelValue="
          async (value) => {
            if (value != 'other') {
              ageValue = value;
              filtered1();
            } else
              ageValue = await alert_input_1(
                'number',
                '',
                `Enter the child's age.`
              );
            filtered1();
          }
        "
        @refresh="
          async () => {
            ageValue = const_ag;
            await filtered1();
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
            filtered1();
          }
        "
        @refresh="
          () => {
            genderValue = const_ge;
            filtered1();
          }
        "
        :showClose="true"
      />
      <FSelect
        class="w-full text-md ml-5"
        :options="statusChildList"
        :title="const_statusChild"
        :modelValue="const_statusChild"
        @update:modelValue="
          (value) => {
            statusChildValue = value;
            filtered1();
          }
        "
        @refresh="
          async () => {
            statusChildValue = const_statusChild;
            await filtered1();
          }
        "
        :showClose="true"
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
                  'Nhập số lượng bản ghi trên mỗi trang'
                );
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
      </div>
      <div class="flex-1 flex relative justify-end">
        <BAdd @click="activeAdd = true" />
        <div
          @click="showAdvanced = !showAdvanced"
          class="border-2 border-solid bg-gray-500 border-gray-500 cursor-pointer rounded-md ml-5 flex items-center px-5 text-lg text-slate-300 hover:shadow-lg hover:shadow-yellow-500/50"
        >
          <label for="" class="cursor-pointer text-white"> Nâng cao </label>
        </div>
        <div
          v-if="showAdvanced"
          class="absolute top-16 right-0 bg-white border border-solid border-slate-300 py-5 px-5 rounded-md flex flex-col space-y-4 pt-2 z-50 shadow-lg"
        >
          <div
            class="border-2 border-solid bg-gray-500 mt-2 py-2 border-gray-500 cursor-pointer rounded-md flex items-center px-5 text-lg text-slate-300 hover:shadow-lg hover:shadow-yellow-500/50 transition-all duration-200 ease-in-out"
          >
            <label for="file-upload" class="cursor-pointer text-white text-sm">
              Thêm nhiều trẻ
            </label>
            <input
              id="file-upload"
              type="file"
              style="display: none"
              @change="handleFileUpload"
              accept=".xls, .xlsx"
            />
          </div>
          <div
            ref="selectRef"
            class="group bg-gray-500 relative border-2 py-2 border-solid border-gray-500 hover:shadow-lg hover:shadow-yellow-500/50 cursor-pointer rounded-md flex items-center px-5 transition-all duration-200 ease-in-out"
          >
            <label
              class="group cursor-pointer text-white text-sm"
              @click="activeExport = true"
            >
              Xuất file
            </label>
            <ul
              v-if="activeExport"
              class="w-full group absolute right-0 mt-32 py-2 bg-white border border-gray-300 rounded-md shadow-lg z-10"
            >
              <li
                @click="export_pdf"
                class="px-4 hover:bg-gray-100 cursor-pointer transition-colors duration-200 ease-in-out"
              >
                <span class="text-sm text-black">pdf</span>
              </li>
              <li
                @click="export_excel"
                class="px-4 hover:bg-gray-100 cursor-pointer transition-colors duration-200 ease-in-out"
              >
                excel
              </li>
            </ul>
          </div>
          <div
            @click="activeChangeStatus = true"
            class="border-2 py-2 border-solid bg-gray-500 border-gray-500 cursor-pointer rounded-md flex items-center px-5 text-lg text-white hover:shadow-lg hover:shadow-yellow-500/50 transition-all duration-200 ease-in-out"
          >
            <label
              for=""
              class="cursor-pointer text-white whitespace-nowrap text-sm"
            >
              Cập nhật trạng thái
            </label>
          </div>
          <!-- <div
            @click="activeChangeStatus = true"
            class="border-2 py-2 border-solid bg-gray-500 border-gray-500 cursor-pointer rounded-md flex items-center px-5 text-lg text-white hover:shadow-lg hover:shadow-yellow-500/50 transition-all duration-200 ease-in-out"
          >
            <label
              for=""
              class="cursor-pointer text-white whitespace-nowrap text-sm"
            >
              Chuyển lớp
            </label>
          </div> -->
          <div
            @click="activeTransferSchool = true"
            class="border-2 py-2 border-solid bg-gray-500 border-gray-500 cursor-pointer rounded-md flex items-center px-5 text-lg text-white hover:shadow-lg hover:shadow-yellow-500/50 transition-all duration-200 ease-in-out"
          >
            <label
              for=""
              class="cursor-pointer text-white whitespace-nowrap text-sm"
            >
              Chuyển trường
            </label>
          </div>
        </div>
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="[
        'Mã trẻ',
        'Họ tên',
        'Giới tính',
        'Ngày sinh',
        'Phụ huynh',
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
      :actionList="['Children.view']"
      :mode="mode"
      :startRow="startRow"
      @delete="(value) => remove(value)"
      @edit="
        async (value) => {
          item = await http_getOne(Children, value);
          item.gender_format = item.gender == 'true' ? 'nam' : 'nữ';
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
  <FormChildren
    v-if="activeAdd"
    :item="itemAdd"
    :title="`Thêm trẻ mới`"
    @cancel="
      (value) => {
        itemAdd.c_province = '';
        itemAdd.c_district = '';
        itemAdd.c_ward = '';
        itemAdd.p_province = '';
        itemAdd.p_district = '';
        itemAdd.p_ward = '';
        itemAdd.c_address = '';
        itemAdd.p_address = '';
        itemAdd.user_name = '';
        itemAdd.password = '';
        activeAdd = value;
      }
    "
    @submit="create()"
  />
  <FormChangeStatus
    v-if="activeChangeStatus"
    :itemAdd="itemChangeStatus"
    :title="`Cập nhật trạng thái của trẻ tại trường`"
    @cancel="
      (value) => {
        activeChangeStatus = value;
      }
    "
    @submit="create_historyStatus()"
  />
  <FormChangeStatus
    v-if="activeTransferSchool"
    :itemAdd="itemTransferSchool"
    :title="`Cập nhật thông tin chuyển trường`"
    @cancel="
      (value) => {
        activeTransferSchool = value;
      }
    "
    :type="`transferSchool`"
    @submit="transfer_school()"
  />
  <FormChildren
    v-if="activeEdit"
    :item="item"
    :title="`Sửa thông tin trẻ`"
    :buttonName="`Edit`"
    @cancel="
      (value) => {
        activeEdit = value;
      }
    "
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
  FormAssignment,
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
  excelNumberToDate,
  formatDateReverse,
  // exel
  XLSX,
  generateOTP,
  jsPDF,
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
  reset,
  classList,
  classValue,
  const_cl,
  const_statusChild,
  statusChildValue,
  statusChildList,
  const_childcareCenter,
  childcareCenterValue,
  childcareCenterList,
} from "../../components/common/index.js";

import "jspdf-autotable";

const itemAdd = ref({
  c_name: "",
  c_gender: "true",
  c_birthday: "",
  c_province: "",
  c_district: "",
  c_ward: "",
  c_address: "",
  p_name: "",
  p_gender: "true",
  p_phone: "",
  p_email: "",
  p_province: "",
  p_district: "",
  p_ward: "",
  p_address: "",
  p_relationship: "bố",
  user_name: "",
  password: "",
  role: "phụ huynh",
  childcareCenter: sessionStorage.getItem("owner_childcareCenter"),
  startSchooling: "",
});

searchOption.value = [
  { _id: "_id", name: "Tìm kiếm theo mã trẻ" },
  { _id: "name", name: "Tìm kiếm theo tên trẻ" },
  { _id: "address", name: "Tìm kiếm theo địa chỉ thường trú" },
  { _id: "parent_name", name: "Tìm kiếm theo tên phụ huynh" },
  { _id: "parent_phone", name: "Tìm kiếm theo số điện thoại phụ huynh" },
];

const activeExport = ref(false);
const selectRef = ref(null);
const showAdvanced = ref(false);
const activeChangeStatus = ref(false);
const activeTransferSchool = ref(false);
const activeTransferClass = ref(false);
const itemChangeStatus = ref({
  status: "đang học",
});
const itemTransferSchool = ref({
  date: formatDateReverse(),
  childcareCenter: "",
});
const itemTransferClass = ref({
  status: "đang học",
});
const showUpdate = ref(false);
const handleClickOutside = (event) => {
  if (selectRef.value != null) {
    if (!selectRef.value.contains(event.target)) {
      activeExport.value = false;
    }
  }
};

const excelData = ref([]);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      excelData.value = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      excelData.value = excelData.value.filter((item) => item.length > 0);
      excelData.value[2] = excelData.value[2].filter((item) => item);

      if (excelData.value.length > 2) {
        const fields = excelData.value[1];
        let e = 0,
          s = 0,
          eList = [];
        console.log(excelData.value);
        for (let i = 2; i < excelData.value.length; i++) {
          if (
            excelData.value[i].filter((item) => item).length != fields.length
          ) {
            run_alert(alert_warning("Dữ liệu không hợp lệ."));
            break;
          }

          itemAdd.value = {
            c_name: excelData.value[i][0],
            c_gender: excelData.value[i][1] == "Nam" ? "true" : "false",
            c_birthday: excelNumberToDate(excelData.value[i][2]),
            c_address: excelData.value[i][3],
            p_name: excelData.value[i][4],
            p_gender: excelData.value[i][5] == "Nam" ? "true" : "false",
            p_phone: "0" + excelData.value[i][6],
            p_email: excelData.value[i][7],
            p_address: excelData.value[i][8],
            p_relationship: excelData.value[i][9],
            user_name: excelData.value[i][10],
            startSchooling: excelData.value[i][11],
            password: generateOTP(),
            role: "phụ huynh",
            childcareCenter: sessionStorage.getItem("owner_childcareCenter"),
          };

          const result = await http_create(Children, itemAdd.value);

          if (result.error) {
            e++;
            eList.push(i + 1);
          } else s++;
        }

        run_alert(
          alert_success(`Đã thêm thành công ${s} ${s == 1 ? "trẻ" : "trẻ"}.`)
        );

        refresh();
      }
    };
    reader.readAsArrayBuffer(file);
  } else {
    run_alert(
      alert_error(
        `Please choose an Excel file with the .xls or .xlsx extension.`
      )
    );
  }
};

const export_excel = () => {
  // Dữ liệu mẫu (chỉ dùng để minh họa)
  const data = [
    ["Danh sách trẻ"],
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
      "Username",
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
      value.account.name,
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

const create = async () => {
  const p_temp = `${itemAdd.value.p_address}, ${itemAdd.value.p_ward}, ${itemAdd.value.p_district}, ${itemAdd.value.p_province}`;
  const c_temp = `${itemAdd.value.c_address}, ${itemAdd.value.c_ward}, ${itemAdd.value.c_district}, ${itemAdd.value.c_province}`;
  itemAdd.value.p_address = p_temp;
  itemAdd.value.c_address = c_temp;
  const result = await http_create(Children, itemAdd.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    activeAdd.value = false;
    itemAdd.value.c_province = "";
    itemAdd.value.c_district = "";
    itemAdd.value.c_ward = "";
    itemAdd.value.p_province = "";
    itemAdd.value.p_district = "";
    itemAdd.value.p_ward = "";
    itemAdd.value.c_address = "";
    itemAdd.value.p_address = "";
    itemAdd.value.user_name = "";
    itemAdd.value.password = "";
    refresh();
  }
  backup_items();
};

const edit = async () => {
  const temp = `${item.value.address}, ${item.value.ward}, ${item.value.district}, ${item.value.province}`;
  item.value.address = temp;
  const result = await http_update(Children, item.value._id, item.value);
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
      ["Trẻ", "Giới tính", "Ngày sinh"],
      ["name", "gender_format", "birthday_format"]
    );
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(Children, item._id);
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
      ["Trẻ", "Giới tính", "Ngày sinh"],
      ["name", "gender_format", "birthday_format"]
    );
    if (isRemove) {
      const result = await http_deleteOne(Children, item._id);
      if (!result.error) {
        run_alert(alert_success(result.message));
        refresh();
      }
    }
  }
  backup_items();
};

const create_historyStatus = async () => {
  try {
    const check = await Children.create_statusChange({
      children: items.value.filter((item) => item.checked),
      date: formatDateReverse(),
      status: itemChangeStatus.value.status,
    });
    if (check.error) {
      run_alert(alert_error(check.message));
    } else {
      run_alert(alert_success(check.message));
      activeChangeStatus.value = false;
      refresh();
    }
  } catch (error) {
    console.log(error);
  }
};

const transfer_school = async () => {
  try {
    const check = await Children.transfer_school({
      children: items.value.filter((item) => item.checked),
      ...itemTransferSchool.value,
    });
    if (check.error) {
      run_alert(alert_error(check.message));
    } else {
      run_alert(alert_success(check.message));
      activeTransferSchool.value = false;
      refresh();

    }
  } catch (error) {
    console.log(error);
  }
};

watch(schoolYearValue, async (n, o) => {
  if (
    schoolYearValue.value != const_sy.value &&
    gradeValue.value != const_gr.value
  ) {
    classList.value = await http_getAll(Classes);
    classList.value = classList.value.filter(
      (value) =>
        value.schoolYear._id == schoolYearValue.value &&
        gradeValue.value == value.grade._id
    );
  }
});

watch(gradeValue, async (n, o) => {
  if (
    schoolYearValue.value != const_sy.value &&
    gradeValue.value != const_gr.value
  ) {
    classList.value = await http_getAll(Classes);
    classList.value = classList.value.filter(
      (value) =>
        value.schoolYear._id == schoolYearValue.value &&
        gradeValue.value == value.grade._id
    );
  }
});

const temp_childcareCenter = ref("");

const refresh = async () => {
  items.value = await http_getAll(Children);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    birthday_format: formatDate(item.birthday),
    parent_name: item.parentDetails[0].name,
    parent_phone: item.parentDetails[0].phone,
    gender_format: item.gender == "true" ? "nam" : "nữ",
    schoolYear: item.classes.map((item1) => item1.schoolYear._id),
    grade: item.classes.map((item1) => item1.grade._id),
    childcareCenterId:
      item.childcareCenter[item.childcareCenter.length - 1]._id,
    age_format:
      new Date().getFullYear() - new Date(item.birthday).getFullYear(),
  }));
  items.value = items.value.filter(
    (i) =>
      i.childcareCenter[i.childcareCenter.length - 1]._id ==
      childcareCenter.value
  );
};

const refreshFilter = async () => {
  items.value = await http_getAll(Children);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    birthday_format: formatDate(item.birthday),
    parent_name: item.parentDetails[0].name,
    parent_phone: item.parentDetails[0].phone,
    gender_format: item.gender == "true" ? "nam" : "nữ",
    schoolYear: item.classes.map((item1) => item1.schoolYear._id),
    grade: item.classes.map((item1) => item1.grade._id),
    childcareCenterId:
      item.childcareCenter[item.childcareCenter.length - 1]._id,
    age_format:
      new Date().getFullYear() - new Date(item.birthday).getFullYear(),
  }));
};

const filtered = async () => {
  await refresh();
  filters();
  currentPage.value = 1;
};

const filtered1 = async () => {
  await refreshFilter();
  filters();
  currentPage.value = 1;
};

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
  childcareCenterList.value = await http_getAll(ChildcareCenter);
  gradeList.value = await http_getAll(Grade);
  schoolYearList.value = await http_getAll(SchoolYear);
  schoolYearList.value = schoolYearList.value.filter(
    (i) => i.childcareCenter._id == childcareCenter.value
  );
  const currentYear = new Date().getFullYear();
  const startSchooling = schoolYearList.value.filter(
    (i) =>
      i.name == currentYear.toString() ||
      i.name.split("-")[0] == currentYear.toString()
  );
  itemAdd.value.startSchooling = startSchooling[0].startDate;
});

const myText = ref(null);

// Lắng nghe sự kiện click để đóng dropdown khi bên ngoài được click
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  // myText.value.addEventListener("copy", function (e) {
  //   e.clipboardData.setData("text/plain", "655a16baac3b0f4121d58456");
  //   e.preventDefault();
  // });
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
