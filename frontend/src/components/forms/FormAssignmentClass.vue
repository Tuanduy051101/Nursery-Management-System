<template>
    <div
      class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
    >
      <div
        v-if="!activeTeacher"
        class="bg-slate-900 h-screen opacity-70 flex-1 relative"
      ></div>
      <div
        v-if="activeTeacher"
        class="bg-slate-900 h-screen opacity-70 flex-1 relative"
      ></div>
      <teacher_assignment
        v-if="activeTeacher"
        class="bg-white absolute w-10/12"
        @submit="
          (value) => {
            activeTeacher = false;
            item.teachers = value;
          }
        "
        @cancel="activeTeacher = false"
        :schoolYear_id="item.schoolYear"
        :class_id="item.classes"
      />
      <div
        v-show="!activeTeacher"
        class="bg-white mx-5 w-4/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
        style="min-height: 100px;"
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
        <div class="flex flex-col my-5 mx-3 overflow-auto" style="max-height: calc(100vh - 250px);">
          <div>
            <!-- teacher -->
            <div class="flex flex-col -mt-3 text-slate-900">
              <label for="" class="mt-2.5 flex items-center"
                >Giáo viên<span class="text-red-500 text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <FSelect
                @click="activeTeacher = true"
                :modelValue="
                  item?.teachers
                    ? item.teachers.length != 0
                      ? 'Đã chọn'
                      : 'Chọn'
                    : 'Chọn'
                "
              />
              <span
                v-if="item.teachers"
                class="text-green-500 mt-2 ml-0.5 text-sm"
                >Đã chọn {{ item.teachers.length }}
                {{ item.teachers.length == 1 ? "giáo viên" : "giáo viên" }}</span
              >
              <span v-if="!item.teachers" class="text-red-500 mt-2 ml-0.5 text-sm"
                >Đây là trường bắt buộc.</span
              >
            </div>
            <!-- duty -->
            <div class="flex flex-col text-slate-900">
              <label for="" class="mt-2.5 flex items-center"
                >Nhiệm vụ<span class="text-red-500 text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <FSelect
                @update:modelValue="(value) => (item.duty = value)"
                :options="duty"
                :modelValue="`Chọn`"
                :class="!item.duty ? 'border-red-500' : 'border-slate-300'"
              />
              <span v-if="!item.duty" class="text-red-500 mt-2 ml-0.5 text-sm"
                >Đây là trường bắt buộc.</span
              >
            </div>
            <!-- note -->
            <div class="flex flex-col text-slate-900">
              <label for="" class="mt-2.5 flex items-center"
                >Ghi chú<span class="text-black text-3xl relative ml-0.5"
                  >*</span
                ></label
              >
              <textarea
                v-model="item.note"
                class="bg-inherit border border-solid border-slate-300 rounded-md focus:border-slate-900 p-2"
                style="outline: none; max-height: 80px"
              ></textarea>
            </div>
            <button
              @click="$emit('submit', item)"
              class="text-white border mt-5 border-solid border-blue-500 bg-blue-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:shadow-lg hover:shadow-yellow-500/50"
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
    teacher_assignment,
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
    // eventBus
    eventBus,
  } from "../../assets/js/imports";
  //
  import {
    items,
    items_cp,
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
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
  });
  
  const item = computed(() => props.itemAdd);
  
  const activeTeacher = ref(false);
  
  const classes = ref([]);
  const schoolYear = ref([]);
  const grade = ref([]);
  const duty = ref([]);
  
  onBeforeMount(async () => {
    classes.value = await http_getAll(Classes);
    duty.value = await http_getAll(Duty);
    schoolYear.value = await http_getAll(SchoolYear);
    grade.value = await http_getAll(Grade);
  });
  </script>
  