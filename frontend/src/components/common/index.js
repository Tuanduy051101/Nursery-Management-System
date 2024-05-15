
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
export const searchWith = ref({});
export const searchOption = ref([]);
export const entryValue = ref(5);
export const typing_entry = ref(false);
export const option_entry = ref([
  { _id: 5, name: 5 },
  { _id: 10, name: 10 },
  { _id: 20, name: 20 },
  { _id: 30, name: 30 },
  { _id: 40, name: 40 },
  { _id: 'other', name: 'khác' },
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
          return item.children.map(child => child.name).join("");
        });
      }
      if (searchWith.value._id == 'parent_name') {
        return items.value.map((item, index) => {
          return item.parentDetails.map(i => i.name).join("");
        });
      }
      if (searchWith.value._id == 'parent_phone') {
        return items.value.map((item, index) => {
          return item.parentDetails.map(i => i.phone).join("");
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
export const const_sy = ref('Năm học');
export const const_gr = ref('Khối học');
export const const_cl = ref('Lớp học');
export const const_tf = ref('Khoản thu');
export const const_ge = ref('Giới tính');
export const const_ag = ref('Độ tuổi');
export const const_ps = ref('Chức vụ');
export const const_dl = ref('Bằng cấp');
export const const_st = ref('Trạng thái');
export const const_da = ref('Ngày');
export const const_se = ref('Buổi');
export const const_mo = ref('Tháng');
export const const_height = ref('Chiều cao');
export const const_weight = ref('Cân nặng');
export const const_rose = ref('Bông hồng');
export const const_health = ref('Sức khoẻ');
export const const_evaluate = ref('Đánh giá');
export const const_statusChild = ref('Trạng thái');
export const const_childcareCenter = ref('Nhà trẻ');
export const resetFilter = () => {
  ageValue.value = const_ag.value;
  genderValue.value = const_ge.value;
  schoolYearValue.value = const_sy.value;
  gradeValue.value = const_gr.value;
  classValue.value = const_cl.value;
  tuitionFeesValue.value = const_tf.value;
  positionValue.value = const_ps.value;
  diplomaValue.value = const_dl.value;
  dateValue.value = const_da.value;
  sessionValue.value = const_se.value;
  statusValue.value = const_st.value;
  monthValue.value = const_mo.value;
  heightValue.value = const_height.value;
  weightValue.value = const_weight.value;
  roseValue.value = const_rose.value;
  healthValue.value = const_health.value;
  evaluateValue.value = const_evaluate.value;
  statusChildValue.value = const_statusChild.value;
  childcareCenterValue.value = const_childcareCenter.value;
}
export const reset = () => {
  items.value = [];
  currentPage.value = 1;
  searchText.value = '';
  // entryValue.value = 5;
  typing_entry.value = false;
  numberOfPages.value = 1;
  totalRow.value = 0;
  startRow.value = 0;
  endRow.value = 0;
  activeAdd.value = false;
  activeEdit.value = false;
  resetFilter();
}
export const filters = () => {
  if (ageValue.value != const_ag.value && ageValue.value) {
    console.log('age');
    filter_age(ageValue.value);
  }
  if (genderValue.value != const_ge.value && genderValue.value) {
    console.log('gender');
    filter_gender(genderValue.value);
  }
  if (schoolYearValue.value != const_sy.value && schoolYearValue.value) {
    console.log('year');
    console.log(items.value);
    console.log('c');
    filter_schoolYear(schoolYearValue.value);
    console.log(items.value);
  }
  if (gradeValue.value != const_gr.value && gradeValue.value) {
    console.log('grade');
    filter_grade(gradeValue.value);
  }
  if (classValue.value != const_cl.value && classValue.value) {
    console.log('class');
    filter_class(classValue.value);
  }
  if (tuitionFeesValue.value != const_tf.value && tuitionFeesValue.value) {
    console.log('tuition');
    filter_tuitionFees(tuitionFeesValue.value);
  }
  if (positionValue.value != const_ps.value && positionValue.value) {
    console.log('position');
    filter_position(positionValue.value);
  }
  if (diplomaValue.value != const_dl.value && diplomaValue.value) {
    console.log('diploma');
    filter_diploma(diplomaValue.value);
  }
  if (dateValue.value != const_da.value && dateValue.value) {
    console.log('date');
    console.log(items.value);
    filter_date(dateValue.value);
    console.log(items.value);
  }
  if (sessionValue.value != const_se.value && sessionValue.value) {
    console.log('session');
    console.log(items.value);
    filter_session(sessionValue.value);
    console.log(items.value);
  }
  if (statusValue.value != const_st.value && statusValue.value) {
    console.log('status');
    filter_status(statusValue.value);
  }
  if (evaluateValue.value != const_evaluate.value && evaluateValue.value) {
    console.log('evaluate');
    filter_evaluate(evaluateValue.value);
  }
  if (monthValue.value != const_mo.value && monthValue.value) {
    console.log('month');
    filter_month(monthValue.value);
  }
  if (heightValue.value != const_height.value && heightValue.value) {
    console.log('height');
    filter_height(heightValue.value);
  }
  if (weightValue.value != const_weight.value && weightValue.value) {
    filter_weight(weightValue.value);
    console.log('weight');
  }
  if (roseValue.value != const_rose.value && roseValue.value) {
    console.log('rose');
    filter_rose(roseValue.value);
  }
  if (healthValue.value != const_health.value && healthValue.value) {
    console.log('health');
    filter_health(healthValue.value);
  }
  if (statusChildValue.value != const_statusChild.value && statusChildValue.value) {
    console.log('statuschild');
    filter_statusChild(statusChildValue.value);
  }
  if (childcareCenterValue.value != const_childcareCenter.value && childcareCenterValue.value) {
    console.log('childcareCenter');
    console.log(childcareCenterValue.value);
    console.log(items.value);
    filter_childcareCenter(childcareCenterValue.value);
    console.log(items.value);
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

export const classList = ref([]);
export const classValue = ref('');


export const schoolYearList = ref([]);
export const schoolYearValue = ref('');


export const tuitionFeesList = ref([]);
export const tuitionFeesValue = ref('');

export const filter_grade = (_id) => {
  items.value = items.value.filter(item => item.grade_id ? item.grade_id.includes(_id) : item.grade.includes(_id));
}

export const filter_class = (_id) => {
  items.value = items.value.filter(item => item.class_id ? item.class_id.includes(_id) : item.classes.some(i => i._id == _id));
}

export const filter_schoolYear = (_id) => {
  items.value = items.value.filter(item => item.schoolYear_id ? item.schoolYear_id == _id : item.schoolYear.includes(_id));
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
    name: 'khác',
  }
])
export const ageValue = ref('Age');
export const filter_age = (_id) => {
  console.log('items', items.value);
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

export const dateValue = ref('');
export const filter_date = (_id) => {
  items.value = items.value.filter(item => item.date == _id);
}

export const sessionList = ref([]);
export const sessionValue = ref('');
export const filter_session = (_id) => {
  items.value = items.value.filter(item => item.session._id == _id);
}

export const statusList = ref([
  { _id: 'true', name: 'có mặt' },
  { _id: 'false', name: 'vắng mặt' },
]);
export const statusValue = ref('');
export const filter_status = (_id) => {
  items.value = items.value.filter(item => item.status == _id);
}

export const evaluateList = ref([
  { _id: 'true', name: 'có mặt' },
  { _id: 'false', name: 'vắng mặt' },
]);
export const evaluateValue = ref('');
export const filter_evaluate = (_id) => {
  items.value = items.value.filter(item => item.evaluate == _id);
}


export const monthList = ref([]);
export const monthValue = ref('');
export const filter_month = (_id) => {
  items.value = items.value.filter(item => item.month._id == _id);
}

export const heightValue = ref('');
export const filter_height = (_id) => {
  items.value = items.value.filter(item => item.height == _id);
}
export const weightValue = ref('');
export const filter_weight = (_id) => {
  items.value = items.value.filter(item => item.weight == _id);
}
export const roseValue = ref('');
export const filter_rose = (_id) => {
  items.value = items.value.filter(item => item.roses == _id);
}
export const healthValue = ref('');
export const filter_health = (_id) => {
  items.value = items.value.filter(item => item.health == _id);
}

export const statusChildList = ref([
  {
    _id: 'nhập học',
    name: 'nhập học',
  },
  {
    _id: 'đang học',
    name: 'đang học',
  },
  {
    _id: 'tạm ngưng học',
    name: 'tạm ngưng học',
  },
  {
    _id: 'hoàn thành',
    name: 'hoàn thành',
  }
]);
export const statusChildValue = ref('');
export const filter_statusChild = (_id) => {
  items.value = items.value.filter(item => item.statusChild == _id);
}

export const getHours = () => {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}`;
}

export const childcareCenterValue = ref('');
export const childcareCenterList = ref([]);
export const filter_childcareCenter = (_id) => {
  items.value = items.value.filter(i => i.childcareCenterId == _id);
}

