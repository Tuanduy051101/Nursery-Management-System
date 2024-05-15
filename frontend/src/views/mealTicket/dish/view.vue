<template>
  <div
    v-if="dishInfo?.name"
    class="border border-solid border-slate-300 rounded-md mb-5"
  >
    <div class="flex justify-start">
      <p
        class="text-lg border border-solid border-t-0 border-l-0 border-slate-300 px-4 py-1.5"
        style="border-radius: 0% 0% 5px 0%"
      >
        Chi tiết thông tin món ăn
      </p>
    </div>
    <!-- class detail -->
    <div class="flex flex-col justify-start py-5 px-5 text-slate-600">
      <span class="px-2"
        >Tên món ăn:
        <span class="text-slate-900 text-justify ml-2">{{
          dishInfo.name.charAt(0).toUpperCase() + dishInfo.name.slice(1)
        }}</span></span
      >
      <span class="px-2 py-2"
        >Chức năng:
        <span class="text-slate-900 text-justify ml-2">{{
          capitalizeFirstLetterAndAfterPeriod(dishInfo.function)
        }}</span></span
      >
      <span class="px-2 pb-2"
        >Ghi chú:
        <span class="text-slate-900 text-justify ml-2">{{
          capitalizeFirstLetterAndAfterPeriod(dishInfo.note)
        }}</span></span
      >
      <span class="px-2"
        >Cách nấu:
        <span
          v-if="dishInfo.cooking == 'không có'"
          class="text-slate-900 text-justify ml-2"
          >{{ dishInfo.cooking }}</span
        >
        <!-- <span class="text-slate-900 text-justify ml-2">{{
          dishInfo.cooking.charAt(0).toUpperCase() + dishInfo.cooking.slice(1)
        }}</span> -->
        <div
          v-if="dishInfo.cooking != 'không có'"
          v-for="(value, index) in dishInfo.cooking
            .split('.')
            .filter((v, i) => i > 0 && i % 2 != 0)
            .map((j) => `${j}.`)"
          class="text-slate-900 flex text-justify"
        >
          <span class="text-yellow-600 mr-1 ml-2" style="white-space: nowrap"
            >Bước {{ index + 1 }}.
            <span class="text-slate-900">{{ capitalizeFirstLetterAndAfterPeriod(value.trim()) }}</span></span
          >
        </div>
      </span>
    </div>
    <div class="border border-solid border-slate-300 border-t-0"></div>
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
        <!-- <FSelect
          class="w-28 mx-5"
          :options="option_mode"
          :modelValue="`auto`"
          :title="`Display`"
          v-model="mode"
        /> -->
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
      </div>
      <div class="flex-1 flex flex-row-reverse">
        <BAdd @click="activeAdd = true" />
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="[
        'Tên thực phẩm',
        'chức năng',
        'số lượng',
        'cách chế biến',
        'ghi chú',
      ]"
      :labels="[
        'foodstuff_name',
        'foodstuff_function',
        'amount',
        'making',
        'noteValue',
      ]"
      :wrap-list="[false, true, false, true, true]"
      :showAction="[false, true, true]"
      @delete="(value) => remove(value)"
      @edit="
        async (value) => {
          activeEdit = true;
          item = items.filter((item) => item._id == value);
          item = item[0];
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
    <FormDish
      v-if="activeAdd"
      :item="itemAdd"
      :title="`Thêm nguyên liệu mới`"
      @cancel="
        (value) => {
          activeAdd = value;
        }
      "
      @submit="create()"
      :button-name="`Add I`"
    />
    <FormDish
      v-if="activeEdit"
      :item="item"
      :title="`Sửa thông tin nguyên liệu`"
      @cancel="
        (value) => {
          activeEdit = value;
        }
      "
      @submit="edit()"
      :button-name="`Edit I`"
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
} from "../../../components/common/index.js";

const itemAdd = ref({
  name: "",
  amount: "",
  function: "",
  note: "",
  making: "",
  dish: props.id,
});

searchOption.value = [
  { _id: "name", name: "Tìm kiếm theo tên thực phẩm" },
  { _id: "function", name: "Tìm kiếm theo chức năng thực phẩm" },
];

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const create = async () => {
  const result = await http_create(Ingredient, itemAdd.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    refresh();
    run_alert(alert_success(result.message));
    activeAdd.value = false;
    itemAdd.value = {
      name: "",
      amount: "",
      function: "",
      note: "",
      making: "",
      dish: props.id,
    };
  }
};

const edit = async () => {
  const result = await http_update(Ingredient, item.value._id, item.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    activeEdit.value = false;
    run_alert(alert_success(result.message));
    refresh();
  }
};

const remove = async (item) => {
  const deleteList = items.value.filter((item) => item.checked);
  if (deleteList.length != 0) {
    const isRemove = await alert_remove(
      deleteList,
      ["Tên thực phẩm", "chức năng", "số lượng", "cách chế biến", "ghi chú"],
      ["foodstuff_name", "foodstuff_function", "amount", "making", "note"],
      "70%"
    );
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(Ingredient, item._id);
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
      ["Tên thực phẩm", "chức năng", "số lượng", "cách chế biến", "ghi chú"],
      ["foodstuff_name", "foodstuff_function", "amount", "making", "note"],
      "70%"
    );
    if (isRemove) {
      const result = await http_deleteOne(Ingredient, item._id);
      if (!result.error) {
        run_alert(alert_success(result.message));
        refresh();
      }
    }
  }
};

const dishInfo = ref({});

const refresh = async () => {
  if (props.id) {
    dishInfo.value = await http_getOne(Dish, props.id);
    items.value = dishInfo.value.ingredient;
    items.value = items.value.map((value) => ({
      ...value,
      checked: false,
      foodstuff_name: value.foodstuff.name,
      foodstuff_function: value.foodstuff.function,
      name: value.foodstuff.name,
      function: value.foodstuff.function,
      foodstuff_id: value.foodstuff._id,
      noteValue: value.note,
    }));
  }
};

const filtered = async () => {
  await refresh();
  filters();
};

const capitalizeFirstLetterAndAfterPeriod = (str) => {
  if (str) {
    let sentences = str.toString().split(". ");

    // Viết hoa chữ cái đầu tiên của mỗi câu
    sentences = sentences.map(
      (sentence) =>
        sentence.charAt(0).toLocaleUpperCase("vi-VN") + sentence.slice(1)
    );

    // Nối các câu lại thành một chuỗi
    str = sentences.join(". ");

    return str;
  }
};

onBeforeMount(async () => {
  reset();
  await refresh();
});
</script>

<style scoped>
.text-justify {
  text-align: justify;
}
</style>
