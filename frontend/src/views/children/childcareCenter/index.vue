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
              if (value != 'other') {
                currentPage = 1;
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
        <BAdd
          @click="
            () => {
              if (isToken) {
                activeAdd = true;
              }
            }
          "
        />
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="[
        'Tên nhà trẻ',
        'Hiệu trưởng',
        'Số điện thoại',
        'E-mail',
        'Địa chỉ',
        'Vai trò',
      ]"
      :labels="[
        'name',
        'director',
        'phone',
        'email',
        'address',
        'isHeadquarters',
      ]"
      :wrap-list="[true, false, false, false, true, false]"
      :show-action="[false, true, true]"
      :mode="mode"
      :startRow="startRow"
      @delete="(value) => isToken && remove(value)"
      @edit="
        async (value) => {
          if (isToken) {
            item = await http_getOne(ChildcareCenter, value);
            const temp = item.address.split(', ');
            item.province = temp[3];
            item.district = temp[2];
            item.ward = temp[1];
            item.address = temp[0];
            activeEdit = true;
          }
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
  <FormChildcareCenter
    v-if="activeAdd"
    :item="itemAdd"
    :title="`Thêm nhà trẻ mới`"
    :placeholder="`Add a new School Year`"
    @cancel="
      (value) => {
        itemAdd = {
          name: '',
          address: '',
          phone: '',
          email: '',
          director: '',
          province: '',
          district: '',
          ward: '',
          isHeadquarters: 'trụ sở chính',
        };
        activeAdd = value;
      }
    "
    @submit="create()"
  />
  <FormChildcareCenter
    v-if="activeEdit"
    :item="item"
    :title="`Sửa thông tin nhà trẻ`"
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
  ChildcareCenter,
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
  FormChildcareCenter,
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
} from "../../../components/common/index.js";

const itemAdd = ref({
  name: "",
  address: "",
  phone: "",
  email: "",
  director: "",
  province: "",
  district: "",
  ward: "",
  isHeadquarters: "trụ sở chính",
});

searchOption.value = [{ _id: "name", name: "Tìm kiếm theo tên năm học" }];

const create = async () => {
  const temp = `${itemAdd.value.address}, ${itemAdd.value.ward}, ${itemAdd.value.district}, ${itemAdd.value.province}`;
  const address_temp = itemAdd.value.address;
  itemAdd.value.address = temp;
  const result = await http_create(ChildcareCenter, itemAdd.value);
  if (result.error) {
    run_alert(alert_error(result.message));
    itemAdd.value.address = address_temp;
  }
  if (!result.error) {
    run_alert(alert_success(result.message));
    activeAdd.value = false;
    refresh();
    itemAdd.value = {
      name: "",
      address: "",
      phone: "",
      email: "",
      director: "",
      province: "",
      district: "",
      ward: "",
      isHeadquarters: "trụ sở chính",
    };
  }
};

const edit = async () => {
  const temp = `${item.value.address}, ${item.value.ward}, ${item.value.district}, ${item.value.province}`;
  const address_temp = item.value.address;
  item.value.address = temp;
  const result = await http_update(ChildcareCenter, item.value._id, item.value);
  if (result.error) {
    run_alert(alert_error(result.message));
    item.value.address = address_temp;
  }
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
      ChildcareCenter,
      ["Tên nhà trẻ"],
      ["name"]
    );
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await http_deleteOne(SchoolYear, item._id);
      }
    });
    if (isRemove) {
      run_alert(alert_success("Đã xoá thành công."));
      refresh();
    }
  }
  if (deleteList.length == 0) {
    const isRemove = await alert_remove([item], ["Tên nhà trẻ"], ["name"]);
    if (isRemove) {
      const result = await http_deleteOne(ChildcareCenter, item._id);
      if (!result.error) {
        run_alert(alert_success(result.message));
        refresh();
      }
    }
  }
};

const refresh = async () => {
  items.value = await http_getAll(ChildcareCenter);
  items.value = items.value.map((item) => ({
    ...item,
    checked: false,
  }));
};

const isToken = ref("");

onBeforeMount(async () => {
  isToken.value = await verifyToken();
  reset();
  refresh();
});
</script>
