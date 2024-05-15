<template>
    <div
      class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
    >
      <div
        class="bg-slate-900 h-screen opacity-70 flex-1 relative"
      ></div>
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
        <div class="flex flex-col my-5">
          <div>
            <p class="text-blue-700 text-base mx-5 -mb-2">
              Chọn nhiệm vụ<span class="text-red-500 text-3xl relative ml-0.5"
                >*</span
              >
            </p>
            <div class="flex justify-between items-center my-5 mx-5">
              <FSelect
                class="w-full text-md"
                :options="dutyList"
                :modelValue="const_dt"
                :title="const_dt"
                @update:modelValue="
                  (value) => {
                    dutyValue = value;
                  }
                "
              />
            </div>
            <div
              class="border border-solid my-5 border-slate-300 border-b-0"
            ></div>
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
              </div>
              <div class="flex-1 flex justify-end">
                <FSelect
                  class="w-full ml-5 text-md mr-5"
                  :options="gradeList"
                  :modelValue="const_gr"
                  :title="const_gr"
                  @update:modelValue="
                    (value) => {
                      gradeValue = value;
                      filtered();
                    }
                  "
                  @refresh="
                    async () => {
                      gradeValue = const_gr;
                      await filtered();
                    }
                  "
                  :showClose="true"
                />
              </div>
            </div>
            <Table
              :items="setPages"
              :fields="[
                'Tên lớp',
                'Khối học',
                'Năm học',
                'Số lượng trẻ',
                'Giáo viên đã phân công',
              ]"
              :labels="[
                'name',
                'grade_name',
                'schoolYear_name',
                'totalChildren',
                'teachers',
              ]"
              :wrap-list="[false, false, false, false, false]"
              :mode="mode"
              :startRow="startRow"
              :show-action="[false, false, false]"
            />
            <Pagination
              :numberOfPages="numberOfPages"
              :totalRow="totalRow"
              :startRow="startRow"
              :endRow="endRow"
              v-model:currentPage="currentPage"
            />
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
    teacher_assignment,
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
    reset,
    resetFilter,
  } from "../common/index.js";
  
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    schoolYearId: {
      type: String,
      required: true,
    },
    gradeId: {
      type: String,
      default: "",
    },
  });
  // const itemAdd = ref([
  //     duty: '',
  //     classes: ''
  // ])
  const months = ref([]);
  const const_dt = ref("Nhiệm vụ");
  const dutyValue = ref("Nhiệm vụ");
  const dutyList = ref([]);
  const activeTeacher = ref(false);
  const indexTeacher = ref(-1);
  const itemCp = ref(null);
  const classId = ref(null);
  
  const refresh = async () => {
    items.value = await http_getAll(Classes);
    if (props.schoolYearId) {
      items.value = items.value.filter(
        (i) => i.schoolYear._id == props.schoolYearId
      );
    }
    if (props.gradeId) {
      items.value = items.value.filter((i) => i.grade._id == props.gradeId);
    }
    items.value = items.value.map((i) => ({
      ...i,
      totalChildren: i.children.length,
      grade_name: i.grade.name,
      grade_id: i.grade._id,
      schoolYear_name: i.schoolYear.name,
      checked: false,
      note: "Không có",
      teachers:
        i.assignment.length == 0
          ? "không có"
          : i.assignment.length == 1
          ? i.assignment.map((j, k) => `<p>${j.teacher.name}</p>`).join("")
          : i.assignment
              .map((j, k) => `<p>${k + 1}. ${j.teacher.name}</p>`)
              .join(""),
      indexTeacher: "-1",
    }));
  };
  
  const filtered = async () => {
    await refresh();
    filters();
    currentPage.value = 1;
  };
  onBeforeMount(async () => {
    resetFilter();
    await refresh();
    gradeList.value = await http_getAll(Grade);
    dutyList.value = await http_getAll(Duty);
  });
  </script>
  