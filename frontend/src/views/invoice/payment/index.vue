<template>
    <!-- Header -->
    <p class="text-slate-300 text-lg mx-5 mt-5">Search Filter</p>
    <div class="flex justify-center items-center my-5 mx-5">
      <FSelect
        class="w-full text-md"
        :options="schoolYearList"
        :modelValue="const_sy"
        :title="const_sy"
        @update:modelValue="
          (value) => {
            schoolYearValue = value;
            filtered();
          }
        "
        @refresh="
          async () => {
            schoolYearValue = const_sy;
            await filtered();
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
          (value) => {
            gradeValue = value;
            filter_grade(gradeValue);
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
      <FSelect
        class="w-full text-md"
        :options="statusList"
        :modelValue="const_st"
        :title="const_st"
        @update:modelValue="
          (value) => {
            statusValue = value;
            filtered();
          }
        "
        @refresh="
          async () => {
            statusValue = const_st;
            await filtered();
          }
        "
        :showClose="true"
      />
    </div>
    <div class="border border-solid my-5 border-slate-600 border-b-0"></div>
    <div class="flex items-center justify-between my-5 mx-5">
      <div class="w-6/12 flex">
        <FSelect
          style="width: 105px"
          :options="option_entry"
          :modelValue="entryValue"
          :title="`Record`"
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
        <FSelect
          class="w-28 mx-5"
          :options="option_mode"
          :modelValue="`auto`"
          :title="`Display`"
          v-model="mode"
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
        <button
          @click="activeAdd = true"
          class="border border-solid border-green-900 px-5 text-slate-300 rounded-md hover:border-2 hover:border-green-500"
          type="button"
        >
          Add
        </button>
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="[
        'Children',
        'Class',
        'Total',
        'Start Day',
        'End Day',
        'Make Date',
        'Status',
      ]"
      :labels="[
        'child_name',
        'class_name',
        'total_format',
        'startDate_format',
        'endDate_format',
        'datePerForm_format',
        'status',
      ]"
      :mode="mode"
      :startRow="startRow"
      @delete="(value) => remove(value)"
      @edit="
        async (value) => {
          item = items.filter((item) => item._id == value);
          item = item[0];
          edit();
        }
      "
      :action-list="[role == 'Accounting' ? 'Receipt-accounting.view' : 'Receipt.view']"
    />
    <Pagination
      :numberOfPages="numberOfPages"
      :totalRow="totalRow"
      :startRow="startRow"
      :endRow="endRow"
      v-model:currentPage="currentPage"
    />
    <FormReceipt
      v-if="activeAdd"
      :item="itemAdd"
      :title="`Add new receipts`"
      @cancel="
        (value) => {
          activeAdd = value;
          itemAdd = {
            schoolYear: '',
            dateStart: '',
            dateEnd: '',
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
  } from "../../../components/common/index.js";
  
  const itemAdd = ref({
    schoolYear: "",
    dateStart: "",
    dateEnd: "",
  });
  
  const role = ref('');
  role.value = sessionStorage.getItem("role");
  
  searchOption.value = [{ _id: "_child_name", name: "Search by child's name" }];
  
  const create = async () => {
    const result = await http_create(Receipt, itemAdd.value);
    if (result.error) run_alert(alert_error(result.message));
    if (!result.error) {
      refresh();
      run_alert(alert_success(result.message));
      activeAdd.value = false;
      itemAdd.value = {
        schoolYear: "",
        dateStart: "",
        dateEnd: "",
      };
    }
  };
  
  const edit = async () => {
    const result = await http_update(Receipt, item.value._id, item.value);
    if (result.error) run_alert(alert_error(result.message));
    if (!result.error) {
      run_alert(alert_success(result.message));
      refresh();
    }
  };
  
  const remove = async (item) => {
    const deleteList = items.value.filter((item) => item.checked);
    if (deleteList.length != 0) {
      const isRemove = await alert_remove(
        deleteList,
        ["Children", "Class", "Total", "Status"],
        ["child_name", "class_name", "total_format", "status_format"],
        "50%"
      );
      deleteList.forEach(async (item) => {
        if (isRemove) {
          const result = await http_deleteOne(Receipt, item._id);
        }
      });
      if (isRemove) {
        run_alert(alert_success("Successfully deleted."));
        refresh();
      }
    }
    if (deleteList.length == 0) {
      const isRemove = await alert_remove(
        [item],
        ["Children", "Class", "Total", "Status"],
        ["child_name", "class_name", "total_format", "status_format"],
        "50%"
      );
      if (isRemove) {
        const result = await http_deleteOne(Receipt, item._id);
        if (!result.error) {
          run_alert(alert_success(result.message));
          refresh();
        }
      }
    }
  };
  
  const refresh = async () => {
    items.value = await http_getAll(Receipt);
    items.value = items.value.map((item) => ({
      ...item,
      checked: false,
      child_name: item.child.name,
      _child_name: item.child.name,
      class_name: item.classes.name,
      grade_id: item.classes.grade._id,
      schoolYear_id: item.classes.schoolYear._id,
      total_format: formatCurrencyVND(item.total),
      startDate_format: formatDate(item.dateStart),
      endDate_format: formatDate(item.dateEnd),
      datePerForm_format:
        item.datePerForm != "chưa thanh toán"
          ? formatDate(item.datePerForm)
          : "chưa thanh toán",
      status_format: item.status == "true" ? "đã thanh toán" : "chưa thanh toán",
    }));
  };
  
  const filtered = async () => {
    await refresh();
    filters();
  };
  
  onBeforeMount(async () => {
    await refresh();
    schoolYearList.value = await http_getAll(SchoolYear);
    gradeList.value = await http_getAll(Grade);
    statusList.value = [
      {
        _id: 'true',
        name: 'đã thanh toán'
      },
      {
        _id: 'false',
        name: 'chưa thanh toán'
      }
    ]
  });
  </script>
  