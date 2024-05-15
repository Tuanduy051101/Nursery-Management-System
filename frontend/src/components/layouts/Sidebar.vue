<template>
  <div
    class="fixed top-0 left-0 max-h-screen min-h-screen w-2/12 border border-solid border-slate-300 border-l-0"
  >
    <div class="flex flex-col items-center">
      <!-- Logo -->
      <div class="flex items-center justify-center rounded-full">
        <img
          src="../../assets/images/logo.png"
          alt=""
          style="width: 1000px; height: 200px"
          class="-mx-40"
        />
      </div>
      <!-- Dashboards -->
      <div class="overflow-auto -mt-5" style="max-height: 694px">
        <router-link
          :to="{ name: `Dashboard` }"
          class="flex items-center py-1 px-2 w-11/12 text-base"
          :class="[
            1000 == activeIndex
              ? 'border border-solid border-green-500 rounded-md bg-green-500 text-white'
              : 'hover:border hover:border-solid hover:border-gray-200 hover:rounded-md hover:bg-gray-200',
          ]"
          @click="(activeIndex = 1000), sessionStorageactiveIndex(activeIndex)"
        >
          <span
            class="material-symbols-outlined text-2xl mr-4"
            :class="[1000 == activeIndex ? 'text-white' : 'text-slate-900']"
          >
            home
          </span>
          <span
            class="text-lg text-white sidebar mt-1"
            :class="[1000 == activeIndex ? 'text-white' : 'text-slate-900']"
            >Thống kê</span
          >
        </router-link>
        <!-- Tasks -->
        <div
          v-for="sidebarTask in sidebarTasks"
          :key="sidebarTask.id"
          class="flex flex-col items-center w-11/12"
        >
          <router-link
            :to="{ name: `${sidebarTask.name}` }"
            class="mt-5 flex items-center justify-between overflow-hidden py-1 px-2 w-full text-base"
            :class="[
              sidebarTask.id == activeIndex
                ? 'border border-solid border-green-500 bg-green-500 rounded-lg text-white'
                : 'hover:border hover:border-solid hover:border-gray-200 hover:rounded-md hover:bg-gray-200',
            ]"
            @click="
              (activeIndex = sidebarTask.id),
                sessionStorageactiveIndex(sidebarTask.id),
                (activeIndexChild = -1),
                sessionStorageactiveIndexChild(activeIndexChild)
            "
          >
            <div class="flex items-center">
              <span
                class="material-symbols-outlined text-2xl mr-4"
                :class="[
                  sidebarTask.id == activeIndex
                    ? 'text-white'
                    : 'text-slate-900',
                ]"
              >
                {{ sidebarTask.icon }}
              </span>
              <span
                class="text-lg sidebar mt-1"
                :class="[
                  sidebarTask.id == activeIndex
                    ? 'text-white'
                    : 'text-slate-900',
                ]"
                >{{ sidebarTask.nameUse }}</span
              >
            </div>

            <!-- child tasks -->
            <div
              v-if="sidebarTask.children.length != 0"
              class="flex items-center"
            >
              <span
                class="material-symbols-outlined text-lg"
                :class="[
                  sidebarTask.id == activeIndex
                    ? 'text-white'
                    : 'text-slate-900',
                ]"
              >
                {{
                  sidebarTask.id == activeIndex
                    ? "expand_more"
                    : "navigate_next"
                }}
              </span>
            </div>
          </router-link>
          <!-- child tasks -->
          <router-link
            v-if="sidebarTask.id == activeIndex"
            v-for="(childTask, indexChild) in sidebarTask.children"
            :to="{ name: `${childTask.route}` }"
            class="flex items-center overflow-hidden py-1 px-2 w-11/12 text-base mt-3"
            :class="[
              indexChild == activeIndexChild && sidebarTask.id == activeIndex
                ? 'border border-solid border-green-500 rounded-md bg-green-500 text-white'
                : 'hover:border hover:border-solid hover:border-gray-200 hover:rounded-md hover:bg-gray-200',
            ]"
            @click="
              (activeIndexChild = indexChild),
                sessionStorageactiveIndexChild(activeIndexChild)
            "
          >
            <span
              class="material-symbols-outlined text-2xl mr-2"
              :class="[
                indexChild == activeIndexChild
                  ? 'text-white'
                  : 'text-slate-900',
              ]"
            >
              fiber_manual_record
            </span>
            <span
              class="text-md sidebar mt-1"
              :class="[
                indexChild == activeIndexChild
                  ? 'text-white'
                  : 'text-slate-900',
              ]"
              >{{ childTask.nameUse }}</span
            >
          </router-link>
        </div>
        <div class="py-1 px-2 my-5"></div>
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
  // alert
  alert_error,
  alert_warning,
  alert_success,
  run_alert,
  verifyToken,
} from "../../assets/js/imports";
const activeIndex = ref(sessionStorage.getItem("activeIndex") || -1);
const activeIndexChild = ref(sessionStorage.getItem("activeIndexChild") || -1);
const sidebarTasks = reactive([
  {
    id: 1,
    icon: "family_restroom",
    name: "Children",
    nameUse: "Trẻ",
    role: ["BGH", "QTHT"],
    children: [
      {
        id: 11,
        name: "Parents",
        nameUse: "Phụ huynh",
        route: "",
      },
      {
        id: 12,
        name: "Children DI",
        nameUse: "Chỉ số phát triển",
        route: "",
      },
    ],
  },
  {
    id: 2,
    icon: "airline_seat_recline_normal",
    name: "Teacher",
    nameUse: "Giáo viên",
    role: ["BGH", "QTHT"],
    children: [
      {
        id: 21,
        name: "Position",
        nameUse: "Chức vụ",
        route: "Position",
      },
      {
        id: 22,
        name: "Diploma",
        nameUse: "Bằng cấp",
        route: "Diploma",
      },
    ],
  },
  {
    id: 3,
    icon: "event_available",
    name: "Todo",
    nameUse: "Hoạt động",
    role: ["BGH", "QTHT"],
    children: [
      {
        id: 31,
        name: "Assignment",
        nameUse: "Phân công",
        route: "Assignment",
      },
      {
        id: 32,
        name: "Duty",
        nameUse: "Nhiệm vụ",
        route: "Duty",
      },
    ],
  },
  {
    id: 4,
    icon: "apartment",
    name: "Grade",
    nameUse: "Khối",
    role: ["BGH", "QTHT"],
    children: [
      {
        id: 41,
        name: "School Year",
        nameUse: "Năm học",
        route: "sYear",
      },
      {
        id: 42,
        name: "Tuition Fees",
        nameUse: "Khoản thu",
        route: "TuitionFees",
      },
      {
        id: 43,
        name: "Collection Rates",
        nameUse: "Mức thu",
        route: "CollectionRates",
      },
      {
        id: 44,
        name: "School Year",
        nameUse: "Nhà trẻ",
        route: "ChildcareCenter",
      },
      {
        id: 45,
        name: "Session",
        nameUse: "Buổi",
        route: "Session",
      },
    ],
  },
  {
    id: 5,
    icon: "event_available",
    name: "ClassRoom",
    nameUse: "Lớp học",
    role: ["BGH", "QTHT", ""],
    children: [],
  },
  {
    id: 6,
    icon: "restaurant",
    name: "Meal",
    nameUse: "Khẩu phần ăn",
    children: [
      {
        id: 61,
        name: "Meal Tickets",
        nameUse: "Phiếu ăn",
        route: "MealTicket",
      },
      {
        id: 62,
        name: "Dish",
        nameUse: "Món ăn",
        route: "Dish",
      },
      {
        id: 63,
        name: "Allergies",
        nameUse: "Dị ứng",
        route: "Allergies",
      },
    ],
  },
  {
    id: 7,
    icon: "receipt_long",
    name: "Invoice",
    nameUse: "Học phí",
    children: [],
  },
  {
    id: 8,
    icon: "settings",
    name: "Setting",
    nameUse: "Cài đặt",
    children: [],
  },
]);
const sessionStorageactiveIndex = (value) => {
  sessionStorage.setItem("activeIndex", value.toString());
};
const sessionStorageactiveIndexChild = (value) => {
  sessionStorage.setItem("activeIndexChild", value.toString());
};

const isToken = ref("");

onBeforeMount(async () => {
  isToken.value = await verifyToken();
});
</script>

<style>
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
  display: none;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(234 179 8);
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #b30000;
}
</style>
