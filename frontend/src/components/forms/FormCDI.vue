<template>
    <div
      class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
    >
      <div class="bg-slate-900 h-screen opacity-70 flex-1 relative"></div>
      <div
        class="bg-white mx-5 w-4/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
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
        <div class="flex flex-col my-5 mx-3">
          <div>
            <!-- teacher -->
            <div class="flex flex-col text-slate-900">
              <label for="" class="-mt-2.5 mb-2 flex items-center"
                >Tháng<span
                  class="text-red-500 text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <FSelect
              @update:modelValue="(value) => (itemAdd.month = value)"
              :options="months"
              :modelValue="`Chọn`"
              class="border-slate-300 hover:border-slate-900"
            />
              <span v-if="!itemAdd.month" class="text-red-500 mt-2 ml-0.5 text-sm"
                >Đây là trường bắt buộc.</span
              >
            </div>
            <button
              @click="$emit('submit')"
              class="text-white border border-solid border-blue-500 bg-blue-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:shadow-lg mt-5 hover:shadow-yellow-500/50"
            >
              Thêm
            </button>
            <!-- </Form> -->
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
    Session,
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
  const months = ref([]);
  onBeforeMount(async () => {
    months.value = await http_getAll(Month);
  })
  </script>
  