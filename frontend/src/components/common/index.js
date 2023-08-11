
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
  // image letters
  VueLetterAvatar,
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
export const items = ref([]);
export const items_cp = ref([]);
export const item = ref({});
export const background = ref("rgb(51 65 85 / var(--tw-bg-opacity))");
export const searchText = ref("");
export const searchWith = ref({
  _id: 'name',
  name: 'Search by name'
});
export const searchOption = ref([]);
export const entryValue = ref(5);
export const typing_entry = ref(false);
export const option_entry = ref([
  { _id: 5, name: 5 },
  { _id: 10, name: 10 },
  { _id: 20, name: 20 },
  { _id: 30, name: 30 },
  { _id: 40, name: 40 },
  { _id: 50, name: 50 },
  { _id: 'other', name: 'other' },
]);
export const mode = ref("auto");
export const option_mode = ref([
  { _id: 0, name: 'auto' },
  { _id: 1, name: 'fixed' },
]);
export const numberOfPages = ref(1);
export const totalRow = ref(0);
export const startRow = ref(0);
export const endRow = ref(0);
export const currentPage = ref(1);
export const activeAdd = ref(false);
export const activeEdit = ref(false);
export const deleteValue = ref(0);
const toString = computed(() => {
  for (let value of searchOption.value) {
    if (searchWith.value._id == value._id) {
      if (searchWith.value._id == 'child_name') {
        return items.value.map((item, index) => {
          console.log(item.children);
          return item.children.map(child => child.name).join("");
        });
      }
      return items.value.map((item, index) => {
        return [item[value._id]].join("");
      });
    }
  }
});
const filter = computed(() => {
  return items.value.filter((item, index) => {
    return toString.value[index].includes(searchText.value.toLocaleLowerCase());
  });
});
const filtered = computed(() => {
  if (!searchText.value) {
    totalRow.value = items.value.length;
    return items.value;
  } else {
    totalRow.value = filter.value.length;
    return filter.value;
  }
});
const setNumberOfPages = computed(() => {
  return Math.ceil(filtered.value.length / entryValue.value);
});
export const setPages = computed(() => {
  if (setNumberOfPages.value == 0) numberOfPages.value = 1;
  else numberOfPages.value = setNumberOfPages.value;

  startRow.value = (currentPage.value - 1) * entryValue.value + 1;
  endRow.value = currentPage.value * entryValue.value;

  return filtered.value.filter((item, index) => {
    return (
      index + 1 > (currentPage.value - 1) * entryValue.value &&
      index + 1 <= currentPage.value * entryValue.value
    );
  });
});

// click outside
const selectRef = ref(null);
const handleClickOutside = (event) => {
  if (!selectRef.value.contains(event.target)) {
    data.activeSelect = false;
  }
};

// define
export const const_sy = ref('School year');
export const const_gr = ref('Grade');
export const const_tf = ref('Tuition fees');
export const const_ge = ref('Gender');
export const const_ag = ref('Age');
export const const_ps = ref('Position');
export const const_dl = ref('Diploma');
export const filters = () => {
  if (ageValue.value != const_ag.value && ageValue.value) {
    filter_age(ageValue.value);
  }
  if (genderValue.value != const_ge.value && genderValue.value) {
    filter_gender(genderValue.value);
  }
  if (schoolYearValue.value != const_sy.value && schoolYearValue.value) {
    filter_schoolYear(schoolYearValue.value);
  }
  if (gradeValue.value != const_gr.value && gradeValue.value) {
    filter_grade(gradeValue.value);
  }
  if (tuitionFeesValue.value != const_tf.value && tuitionFeesValue.value) {
    filter_tuitionFees(tuitionFeesValue.value);
  }
  if (positionValue.value != const_ps.value && positionValue.value) {
    filter_position(positionValue.value);
  }
  if (diplomaValue.value != const_dl.value && diplomaValue.value) {
    filter_diploma(diplomaValue.value);
  }
}


// data
export const positionList = ref([]);
export const positionValue = ref('');
export const filter_position = (_id) => {
  items.value = items.value.filter(item => item.position._id == _id);
}

export const diplomaList = ref([]);
export const diplomaValue = ref('');
export const filter_diploma = (_id) => {
  items.value = items.value.filter(item => item.diploma.some(item1 => item1._id == _id));
}

export const gradeList = ref([]);
export const gradeValue = ref('');


export const schoolYearList = ref([]);
export const schoolYearValue = ref('');


export const tuitionFeesList = ref([]);
export const tuitionFeesValue = ref('');

export const filter_grade = (_id) => {
  items.value = items.value.filter(item => item.grade_id == _id);
}

export const filter_schoolYear = (_id) => {
  items.value = items.value.filter(item => item.schoolYear_id == _id);
}
export const filter_tuitionFees = (_id) => {
  items.value = items.value.filter(item => item.tuitionFees_id == _id);
}

export const backup_items = () => {
  items_cp.value = items.value;
}

export const restore_items = () => {
  items.value = items_cp.value;
  // restore_filter.value = !restore_filter.value;

}

export const restore_filter = ref(false);

export const modelValue_schoolYear = ref('School year');

export const ageList = ref([
  {
    _id: 2,
    name: '2 tuổi',
  },
  {
    _id: 3,
    name: '3 tuổi',
  },
  {
    _id: 4,
    name: '4 tuổi',
  },
  {
    _id: 5,
    name: '5 tuổi',
  },
  {
    _id: 'other',
    name: 'other',
  }
])
export const ageValue = ref('Age');
export const filter_age = (_id) => {
  items.value = items.value.filter(item => item.age_format == _id);
}


export const genderList = ref([
  { _id: 'true', name: 'Nam' },
  { _id: 'false', name: 'Nữ' },
])
export const genderValue = ref('');
export const filter_gender = (_id) => {
  items.value = items.value.filter(item => item.gender == _id);
}