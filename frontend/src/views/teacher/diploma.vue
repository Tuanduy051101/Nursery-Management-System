<template>
  <div class="border-t border-solid border-slate-300">
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
      <div class="flex-1 flex justify-end">
        <!-- <FSearch
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
        /> -->
        <BAdd @click="activeAdd = true" />
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="['Tên bằng cấp']"
      :labels="['name']"
      :mode="mode"
      :startRow="startRow"
      @delete="(value) => remove(value)"
      @edit="
        async (value) => {
          item = await http_getOne(Diploma, value);
          activeEdit = true;
        }
      "
      :show-action="[false, false, true]"
    />
    <Pagination
      :numberOfPages="numberOfPages"
      :totalRow="totalRow"
      :startRow="startRow"
      :endRow="endRow"
      v-model:currentPage="currentPage"
    />
  </div>
  <FormAddDiploma
    v-if="activeAdd"
    :itemAdd="itemAdd"
    :title="`Thêm bằng cấp`"
    @cancel="
      (value) => {
        activeAdd = value;
        itemAdd = {
          diploma: '',
          teacher_id: teacher_id,
        };
      }
    "
    @submit="create()"
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
  FormAddDiploma,
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
} from "../../assets/js/imports";
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
} from "../../components/common/index";

const itemAdd = ref({
  diploma: "",
  teacher_id: props.teacher_id,
});

const props = defineProps({
  diplomaList: {
    type: Array,
    required: true,
  },
  teacher_id: {
    type: String,
    required: true,
  },
});

searchOption.value = [{ _id: "name", name: "Search by name" }];

const create = async () => {
  const result = await Teacher.addDiploma(props.teacher_id, {
    diplomas: [itemAdd.value.diploma],
  });
  if (result.error) run_alert(alert_error(result.message));
  if (!result.error) {
    run_alert(alert_success(result.message));
    refresh();
    activeAdd.value = false;
    itemAdd.value = {
      diploma: "",
      teacher_id: props.teacher_id,
    };
  }
};

const remove = async (item) => {
  const deleteList = items.value.filter((item) => item.checked);
  if (deleteList.length != 0) {
    const isRemove = await alert_remove(deleteList, ["Tên bằng cấp"], ["name"]);
    deleteList.forEach(async (item) => {
      if (isRemove) {
        const result = await Teacher.deleteDiploma(props.teacher_id, {
            diplomas: [item._id]
        })
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
      const result = await Teacher.deleteDiploma(props.teacher_id, {
            diplomas: [item._id]
        })
      if (!result.error) {
        run_alert(alert_success(result.message));
        refresh();
      }
    }
  }
};

const refresh = async () => {
  if (props.diplomaList || props.teacher_id) {
    console.log('chay nhe cc');
    items.value = await http_getOne(Teacher, props.teacher_id);
    items.value = items.value.diploma;
    items.value = items.value.map((item) => ({
      ...item,
      checked: false,
    }));
  }
};

onBeforeMount(async () => {
  reset();
  await refresh();
});
</script>
