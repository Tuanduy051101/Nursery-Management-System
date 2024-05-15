<template>
    <div class="border border-solid border-slate-300 rounded-md">
      <!-- Header -->
      <p class="text-blue-700 text-base mx-5 mt-5">Bộ lọc tìm kiếm</p>
      <div class="flex justify-between items-center my-5 mx-5">
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
          class="w-full ml-5 text-md"
          :options="gradeList"
          :modelValue="const_gr"
          :title="const_gr"
          @update:modelValue="
            (value) => {
              gradeValue = value;
              filtered(gradeValue);
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
      <div class="border border-solid my-5 border-slate-300 border-b-0"></div>
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
        <div class="flex-1 flex">
          <FSearch
            class="flex-1"
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
      </div>
      <Table
        :items="setPages"
        :fields="['Tên lớp học', 'Khối học', 'Năm học', 'Sĩ số']"
        :labels="['name', 'grade_name', 'schoolYear_name', 'totalChildren']"
        :actionList="['ClassRoom-teacher.view']"
        :mode="mode"
        :startRow="startRow"
        @delete="(value) => remove(value)"
        @edit="
          async (value) => {
            item = await http_getOne(Classes, value);
            item = item[0];
            activeEdit = true;
          }
        "
        :show-action="[true, false, false]"
        :show-checkbox="false"
        :activeSTT="true"
      />
      <Pagination
        :numberOfPages="numberOfPages"
        :totalRow="totalRow"
        :startRow="startRow"
        :endRow="endRow"
        v-model:currentPage="currentPage"
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
    reset,
  } from "../../../components/common/index";
  
  const itemAdd = ref({
    amountClasses: 0,
    schoolYear: "",
    grade: "",
    amountChildren: 0,
  });

  const owner_id = ref({});
  owner_id.value = sessionStorage.getItem("owner_id");
  
  searchOption.value = [
    { _id: "name", name: "Tìm kiếm theo tên lớp" },
    { _id: "child_name", name: "Tìm kiếm theo tên trẻ" },
  ];
  
  const create = async () => {
    try {
      const result = await Classes.createAuto(itemAdd.value);
      if (result.error) run_alert(alert_error(result.message));
      if (!result.error) {
        if (itemAdd.amountChildren != 0) {
          for (let value of result.result) {
            await Classes.addChildAuto(value._id, {
              amountChildren: itemAdd.value.amountChildren,
            });
          }
        }
        run_alert(alert_success(result.message));
        activeAdd.value = false;
        itemAdd.value = {
          amountClasses: 0,
          schoolYear: "",
          grade: "",
          amountChildren: 0,
        };
        refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const edit = async () => {
    console.log(item.value);
    const result = await http_update(Classes, item.value._id, item.value);
    if (result.error) run_alert(alert_error(result.message));
    if (!result.error) {
      run_alert(alert_success(result.message));
      activeEdit.value = false;
      refresh();
    }
    backup_items();
  };
  
  const remove = async (item) => {
    const deleteList = items.value.filter((item) => item.checked);
    if (deleteList.length != 0) {
      const isRemove = await alert_remove(
        deleteList,
        ["Class name", "Amount children"],
        ["name", "totalChildren"],
        "40%"
      );
      deleteList.forEach(async (item) => {
        if (isRemove) {
          const result = await http_deleteOne(Classes, item._id);
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
        ["Class name", "Amount children"],
        ["name", "totalChildren"],
        "40%"
      );
      if (isRemove) {
        const result = await http_deleteOne(Classes, item._id);
        if (!result.error) {
          run_alert(alert_success(result.message));
          refresh();
        }
      }
    }
    backup_items();
  };
  
  const refresh = async () => {
    items.value = await http_getAll(Classes);
    items.value = items.value.filter(item => item.assignment.some(item1 => item1.teacher._id == owner_id.value));
    items.value = items.value.map((item) => ({
      ...item,
      checked: false,
      grade_name: item.grade.name,
      schoolYear_name: item.schoolYear.name,
      totalChildren: item.children.length,
      schoolYear_id: item.schoolYear._id,
      grade_id: item.grade._id,
    }));
  };
  
  const filtered = async () => {
    await refresh();
    filters();
    currentPage.value = 1;
  };
  
  onBeforeMount(async () => {
    reset();
    await refresh();
    schoolYearList.value = await http_getAll(SchoolYear);
    gradeList.value = await http_getAll(Grade);
  });
  </script>