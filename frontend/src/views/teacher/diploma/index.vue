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
        <!-- <FSelect
          class="w-28 mx-5"
          :options="option_mode"
          :modelValue="`auto`"
          :title="`Display`"
          v-model="mode"
        /> -->
        <FSelect
          v-if="isToken"
          class="w-full text-md ml-5"
          :options="childcareCenterList"
          :modelValue="temp_childcareCenter"
          :title="const_childcareCenter"
          @update:modelValue="
            async (value) => {
              childcareCenterValue = value;
              await refresh();
            }
          "
          @refresh="
            async () => {
              childcareCenterValue = const_childcareCenter;
              await refreshFilter();
            }
          "
          :showClose="true"
        />
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
      :fields="['Tên bằng cấp', 'Số lượng giáo viên']"
      :labels="['name', 'teacherAmount']"
      :mode="mode"
      :startRow="startRow"
      :show-action="[false, true, true]"
      @delete="(value) => remove(value)"
      @edit="
        async (value) => {
          item = await http_getOne(Diploma, value);
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
  <FormOne
    v-if="activeAdd"
    :item="itemAdd"
    :title="`Thêm bằng cấp mới`"
    :placeholder="`Add a new diploma`"
    @cancel="(value) => (activeAdd = value)"
    @submit="create()"
  />
  <FormOne
    v-if="activeEdit"
    :item="item"
    :title="`Sửa thông tin bằng cấp`"
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
} from "../../../components/common/index";

const itemAdd = ref({
  name: "",
});

searchOption.value = [{ _id: "name", name: "Tìm kiếm theo tên bằng cấp" }];

const create = async () => {
  const result = await http_create(Diploma, itemAdd.value);
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    activeAdd.value = false;
    refresh();
  }
};

const edit = async () => {
  const result = await http_update(Diploma, item.value._id, item.value);
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
    const isRemove = await alert_remove(deleteList, ["Tên bằng cấp"], ["name"]);
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(Diploma, item._id);
      }
    });
    if (isRemove) {
      run_alert(alert_success("Đã xoá thành công."));
      refresh();
    }
  }
  if (deleteList.length == 0) {
    const isRemove = await alert_remove([item], ["Tên bằng cấp"], ["name"]);
    if (isRemove) {
      const result = await http_deleteOne(Diploma, item._id);
      if (!result.error) {
        run_alert(alert_success(result.message));
        refresh();
      }
    }
  }
};

const temp_childcareCenter = ref("");
const isToken = ref("");
const childcareCenter = ref(sessionStorage.getItem("owner_childcareCenter"));
const childcareCenterName = ref(
  sessionStorage.getItem("owner_childcareCenterName")
);

const refresh = async () => {
  items.value = await http_getAll(Diploma);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    teacherAmount: item.teacher.filter(
      (i) => i.childcareCenter[i.childcareCenter.length - 1]._id == childcareCenterValue.value
    ).length,
  }));
};

const refreshFilter = async () => {
  items.value = await http_getAll(Diploma);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
    teacherAmount: item.teacher.length,
  }));
};

onBeforeMount(async () => {
  isToken.value = await verifyToken();
  reset();
  childcareCenterValue.value = childcareCenter.value;
  temp_childcareCenter.value = childcareCenterName.value;
  await refresh();
  childcareCenterList.value = await http_getAll(ChildcareCenter);
});
</script>
