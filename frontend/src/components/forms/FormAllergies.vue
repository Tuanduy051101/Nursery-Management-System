<template>
  <div
    class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
  >
    <div class="bg-slate-900 h-screen opacity-70 flex-1 relative"></div>
    <div
      class="bg-white mx-5 w-11/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
      style="min-height: 100px; max-height: 100vh"
    >
      <div
        class="flex flex-row justify-between items-center px-3 py-3 text-slate-900 border border-solid border-slate-300 border-l-0 border-r-0 border-t-0 text-lg"
      >
        <span>{{ title }}</span>
        <span
          @click="$emit('cancel', false)"
          class="material-symbols-outlined cursor-pointer text-slate-900 hover:text-red-500"
        >
          close
        </span>
      </div>
      <div
        class="flex flex-col my-5 mx-3 overflow-auto"
        style="max-height: calc(100vh - 250px)"
      >
        <div>
          <div class="p-4">
            <table class="table-auto w-full">
              <thead>
                <tr>
                  <th
                    v-for="header in headers"
                    :key="header"
                    class="border border-solid p-2"
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
                  <td class="border border-solid p-2">
                    <span class="flex justify-center">{{ row.stt }}</span>
                  </td>
                  <td
                    class="border border-solid p-2 relative"
                    @focusin="showDropdown(rowIndex)"
                  >
                    <input
                      v-model="row.allergen"
                      @keydown.enter.prevent="handleEnterKey(row.stt)"
                      class="w-full"
                      @input="handleAllergen($event)"
                    />
                    <div
                      v-if="isDropdownOpen == rowIndex"
                      class="absolute overflow-auto z-50 mt-2 w-48 bg-white border border-solid border-slate-300 rounded-md shadow-lg"
                      style="max-height: 100px"
                    >
                      <div
                        v-for="option in options"
                        :key="option"
                        @click="row.allergen = option.name,row.description = option.description  , isDropdownOpen = -1"
                        class="cursor-pointer px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      >
                        {{ option.name }}
                      </div>
                    </div>
                  </td>
                  <td class="border border-solid p-2">
                    <textarea
                      @keydown.enter.prevent="handleEnterKey(row.stt)"
                      v-model="row.description"
                      @input="adjustTextAreaHeight"
                      class="w-full outline-none mt-2"
                      style="height: 40px; max-height: 100px"
                      ref="textArea"
                      @click="isDropdownOpen = -1"
                    ></textarea>
                  </td>
                  <td class="border border-solid p-2">
                    <select
                      v-model="row.severity"
                      class="w-full border rounded-md outline-none"
                      @click="isDropdownOpen = -1"
                    >
                      <option
                        v-for="option in ['nhẹ', 'nặng']"
                        :key="option"
                        :value="option"
                      >
                        {{ option }}
                      </option>
                    </select>
                  </td>
                  <!-- <td class="border border-solid p-2">
                    <select
                      v-model="row.reactionType"
                      class="w-full border rounded-md outline-none"
                      @click="isDropdownOpen = -1"
                    >
                      <option
                        v-for="option in ['nhanh', 'chậm']"
                        :key="option"
                        :value="option"
                      >
                        {{ option }}
                      </option>
                    </select>
                  </td> -->
                  <td class="border border-solid p-2">
                    <textarea
                      @keydown.enter.prevent="handleEnterKey(row.stt)"
                      v-model="row.reactionType"
                      @input="adjustTextAreaHeight"
                      class="w-full outline-none  mt-2"
                      style="height: 40px; max-height: 100px"
                      ref="textArea"
                      @click="isDropdownOpen = -1"
                    ></textarea>
                  </td>
                  <td class="border border-solid p-2">
                    <textarea
                      @keydown.enter.prevent="handleEnterKey(row.stt)"
                      v-model="row.treatment"
                      @input="adjustTextAreaHeight"
                      class="w-full outline-none mt-2"
                      style="height: 40px; max-height: 100px"
                      ref="textArea"
                      @click="isDropdownOpen = -1"
                    ></textarea>
                  </td>
                  <td class="border border-solid p-2">
                    <textarea
                      @keydown.enter.prevent="handleEnterKey(row.stt)"
                      v-model="row.note"
                      @input="adjustTextAreaHeight"
                      class="w-full outline-none mt-2"
                      style="height: 40px; max-height: 100px"
                      ref="textArea"
                      @click="isDropdownOpen = -1"
                    ></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            @click="$emit('submit', tableData)"
            class="text-white border border-solid border-blue-500 bg-blue-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:shadow-lg mt-5 hover:shadow-yellow-500"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
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
  Allergen,
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
} from "../common/index.js";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  itemAdd: {
    type: Object,
    default: {},
  },
});

const headers = ref([
  "Stt",
  "Chất gây dị ứng",
  "Mô tả",
  "Mức độ dị ứng",
  "Phản ứng",
  "Giải pháp",
  "Ghi chú",
]);
const tableData = ref([
  {
    stt: 1,
    allergen: "",
    description: "",
    severity: "",
    reactionType: "",
    treatment: "",
    note: "",
  },
]);
const editingRow = ref(null);
const editingCell = ref(null);

const startEditing = (row, cell) => {
  editingRow.value = row;
  editingCell.value = cell;
};

const stopEditing = () => {
  editingRow.value = null;
  editingCell.value = null;
};

const handleEnterKey = (index) => {
  if (index == tableData.value.length) {
    tableData.value.push({
      stt: index + 1,
      allergen: "",
      description: "",
      severity: "",
      reactionType: "",
      treatment: "",
      notes: "",
    });
  }
};

const adjustTextAreaHeight = () => {
  const textArea = $refs.textArea;

  // Đặt chiều cao tối thiểu cho textarea
  const minHeight = 10;

  // Cập nhật chiều cao của textarea dựa trên nội dung bên trong
  textArea.style.height = "auto";
  textArea.style.height = Math.max(textArea.scrollHeight, minHeight) + "px";
};

const options = ref(["X", "Y", "Z", "dsd", "dsd"]);
let isDropdownOpen = ref(-1);

const showDropdown = (index) => {
  isDropdownOpen.value = index;
};

const hideDropdown = () => {
  isDropdownOpen.value = -1;
};

const handleAllergen = async (event) => {
  const inputValue = event.target.value;
  try {
    options.value = await Allergen.getAll();
    options.value = options.value.map((i) => i.name);
    if (inputValue.length > 0) {
      options.value = options.value.filter((i) =>
        i.split(" ").some((j) =>
          inputValue
            .toLowerCase()
            .split(" ")
            .some((k) => k == j)
        )
      );
    }
  } catch (error) {
    console.log(error);
  }
};

onBeforeMount(async () => {
  try {
    options.value = await Allergen.getAll();
  } catch (error) {
    console.log(error);
  }
});
</script>

<style scoped>
/* Thêm các kiểu CSS cần thiết tại đây */
textarea {
  transition: height 0.2s; /* Thêm hiệu ứng chuyển động nếu bạn muốn */
}
</style>
