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
        Chi tiết thông tin lớp học
      </p>
      <div class="flex justify-end mx-5 my-5 text-slate-300">
        <div
          class="border border-solid border-slate-300 border-r-0 px-4 py-2 cursor-pointer flex items-center"
          :class="
            actionPage == 6
              ? 'border-1 border-green-500 bg-green-500 text-white'
              : 'hover:bg-gray-200 hover:border-gray-200 text-slate-900'
          "
          @click="actionPage = 6"
        >
          Thông tin
        </div>
        <div
          class="border border-solid border-slate-300 px-4 py-1 cursor-pointer flex items-center"
          :class="
            actionPage == 1
              ? 'border-1 border-green-500 bg-green-500 text-white'
              : 'hover:bg-gray-200 hover:border-gray-200 text-slate-900'
          "
          @click="actionPage = 1"
        >
          Danh sách trẻ
        </div>
        <div
          class="border border-solid border-slate-300 border-r-0 px-4 py-1 cursor-pointer flex items-center"
          :class="
            actionPage == 2
              ? 'border-1 border-green-500 bg-green-500 text-white'
              : 'border-l-0 border-r-0 hover:bg-gray-200 hover:border-gray-200 text-slate-900'
          "
          @click="actionPage = 2"
        >
          Điểm danh
        </div>
        <div
          class="border border-solid border-slate-300 border-r-0 px-4 py-1 cursor-pointer flex items-center"
          :class="
            actionPage == 3
              ? 'border-1 border-green-500 bg-green-500 text-white'
              : 'hover:bg-gray-200 hover:border-gray-200 text-slate-900'
          "
          @click="actionPage = 3"
        >
          Chỉ số phát triển
        </div>
        <div
          class="border border-solid border-slate-300 border-r-0 px-4 py-1 cursor-pointer flex items-center"
          :class="
            actionPage == 4
              ? 'border-1 border-green-500 bg-green-500 text-white'
              : 'hover:bg-gray-200 hover:border-gray-200 text-slate-900'
          "
          @click="actionPage = 4"
        >
          Phiếu ăn
        </div>
        <div
          class="border border-solid border-slate-300 px-4 py-1 cursor-pointer flex items-center"
          :class="
            actionPage == 5
              ? 'border-1 border-green-500 bg-green-500 text-white'
              : 'hover:bg-gray-200 hover:border-gray-200 text-slate-900'
          "
          @click="actionPage = 5"
        >
          Học phí
        </div>
      </div>
    </div>
    <div class="border border-solid border-slate-300 border-b-0"></div>
    <div v-if="actionPage == 6 && item?.name" class="flex justify-start mb-5">
      <div class="px-5">
        <div class="flex text-slate-600 mt-5">
          <!-- class info -->
          <div class="flex mr-5">
            <div class="flex-col space-y-2">
              <p class="">
                Tên lớp:
                <span class="text-slate-900 capitalize">{{ item.name }}</span>
              </p>
              <p class="">
                Khối học:
                <span class="text-slate-900 capitalize">{{
                  item.grade.name
                }}</span>
              </p>
              <p class="">
                Sĩ số lớp:
                <span class="text-slate-900">{{ item.children.length }}</span>
              </p>
            </div>
            <div class="flex-col ml-10 space-y-2">
              <p class="">
                Năm học:
                <span class="text-slate-900">{{ item.schoolYear.name }}</span>
              </p>
              <p class="">
                Học tại:
                <span class="text-slate-900 capitalize">{{
                  item.schoolYear.childcareCenter.name
                }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Table
      :items="teacherList"
      :fields="[
        'Mã giáo viên',
        'Tên giáo viên',
        'Số điện thoại',
        'Nhiệm vụ',
      ]"
      :labels="[
        'teacher_id',
        'teacher_name',
        'teacher_phone',
        'duty_name',
      ]"
      :showAction="[role == 'Teacher' ? false : true, false, false]"
      :wrap-list="[false, false, false, true]"
      v-if="actionPage == 6 && item?.name"
      :activeSTT="true"
    />
    <div
      class="flex flex-row-reverse my-5 mr-5"
      v-if="
        actionPage == 6 &&
        item?.name &&
        (role == 'ban giám hiệu' || role == 'quản trị hệ thống')
      "
    >
      <button
        @click="activeAssignment = true"
        class="flex items-center justify-center px-6 py-1.5 bg-blue-500 border border-solid border-blue-500 rounded-md text-white hover:shadow-lg hover:shadow-yellow-500/50"
      >
        <span class="text-lg">Thêm phân công</span>
      </button>
    </div>
    <FormAssignmentClass
      v-if="activeAssignment"
      :itemAdd="itemAdd"
      :title="`Thêm phân công mới`"
      @cancel="
        (value) => {
          activeAssignment = value;
          itemAdd = {
            duty: '',
            classes: '',
            teachers: [],
            note: '',
            grade: '',
            schoolYear: '',
          };
          refresh();
        }
      "
      @submit="
        (value) => {
          itemAdd = value;
          create();
          refresh();
        }
      "
    />
    <div v-if="actionPage == 6" class="mb-5"></div>
    <!-- children -->
    <ChildrenList
      v-if="actionPage == 1"
      :classId="item._id"
      :children="item.children"
    />
    <CDIList v-if="actionPage == 3" :cdiL="item.cdiL" :classId="item._id" />
    <MealTicketList v-if="actionPage == 4" :classId="item._id" />
    <AttendanceList v-if="actionPage == 2" :classId="item._id" />
    <ReceiptList v-if="actionPage == 5" :classId="item._id" />
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
  Notification,
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
  FormAssignmentClass,
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
} from "../../../components/common/index.js";

const actionPage = ref(6);
const actionList = ref([1, 2, 3, 4, 5, 6]);
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const itemAdd = ref({
  duty: "",
  classes: "",
  teachers: [],
  note: "",
  grade: "",
  schoolYear: "",
});

const role = ref("");
role.value = sessionStorage.getItem("role");

const teacherList = ref([]);
const activeAssignment = ref(false);

const create = async () => {
  const result = await http_create(Assignment, itemAdd.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    refresh();
    itemAdd.value = {
      duty: "",
      classes: "",
      teachers: [],
      note: "",
      grade: "",
      schoolYear: "",
    };
    activeAssignment.value = false;
    //
    const sender = sessionStorage.getItem("owner_id");
    const recipientList = result.documents;
    const classes = result.classes;
    const dutyInfo = result.dutyInfo;
    const classInfo = result.classInfo;

    // Sử dụng Promise.all để đợi tất cả các Promise hoàn thành
    await Promise.all(
      recipientList.map(async (recipient) => {
        // Tạo thông báo cho mỗi người nhận
        await http_create(Notification, {
          title: "Thông báo phân công",
          content: `Bạn đã được phân công ${dutyInfo.name} lớp ${
            classInfo.name
          } ${classInfo.grade.name} năm học ${
            classInfo.schoolYear.name
          }. Bắt đầu từ ngày ${formatDate(
            classInfo.schoolYear.startDate
          )} tại ${classInfo.schoolYear.childcareCenter.name}.`,
          dateSent: formatDateReverse(),
          recipient: recipient,
          sender: sender,
          status: "đã gửi",
          typeRecipient: "teacher",
        });
      })
    );
  }
};

const refresh = async () => {
  if (props.id) {
    item.value = await http_getOne(Classes, props.id);
    item.value = item.value[0];
    itemAdd.value.classes = props.id;
    itemAdd.value.grade = item.value.grade._id;
    itemAdd.value.schoolYear = item.value.schoolYear._id;
    teacherList.value = item.value.assignment;
    teacherList.value = teacherList.value.map((item) => ({
      teacher_name: item.teacher.name,
      _id: item._id,
      teacher_phone: item.teacher.phone,
      teacher_email: item.teacher.email,
      teacher_id: item.teacher._id,
      duty_name: item.duty.name,
      teacher_gender: item.teacher.gender == "true" ? "nam" : "nữ",
    }));
  }
};

onBeforeMount(async () => {
  await refresh();
});
</script>
