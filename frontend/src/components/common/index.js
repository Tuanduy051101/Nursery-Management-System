
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
} from "../../assets/js/imports";
export const items = ref([]);
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

