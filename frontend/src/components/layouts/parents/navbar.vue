<template>
    <div class="flex flex-row items-center justify-between">
      <div class="flex items-center">
        <img
          src="../../../assets/images/logo.png"
          alt=""
          style="width: 60px"
          class="ml-5"
        />
        <div class="flex space-x-8 mx-5 items-center text-slate-300 text-lg">
          <div v-for="(value, index) in menus" class="">
            <router-link
              :to="{
                name: value.router,
              }"
            >
              <a
                @click="(activeMenu = index), sessionStorageactiveIndex(index)"
                href="#"
                :class="[
                  activeMenu == index ? 'text-green-500' : 'hover:text-blue-500',
                ]"
                >{{ value.name }}</a
              >
            </router-link>
          </div>
        </div>
      </div>
  
      <div class="flex">
        <div class="mx-5 mt-1.5">
          <!-- task -->
          <div class="flex justify-end items-center -space-x-2.5">
            <a class="flex items-center group border rounded-sm">
              <span
                class="material-symbols-outlined group-hover:text-white text-slate-300 cursor-pointer"
                >notifications</span
              >
            </a>
            <div
              class="bg-red-900 rounded-full shadow-xl text-slate-300 mb-6 px-2 pt-0.5"
            >
              0
            </div>
          </div>
        </div>
        <!-- user -->
        <div class="group relative mr-5">
          <div
            class="group flex justify-end items-center overflow-hidden my-1 cursor-pointer"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
          >
            <!-- <img class="shrink-0 h-12 w-12 rounded-full border border-solid border-slate-600" src="https://cdn.pixabay.com/photo/2022/05/15/13/38/woman-7198072__340.jpg" alt="avatar" /> -->
            <div
              class="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-semibold"
            >
              {{ getFirstLetter(username) }}
            </div>
            <div class="ml-3 mr-2">
              <p class="text-base font-medium text-slate-300">{{ username }}</p>
              <p class="text-xs font-medium text-white">{{ role }}</p>
            </div>
          </div>
          <ul
            class="hidden w-40 absolute right-0 mt-2 py-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 group-hover:block"
          >
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <span class="text-sm">Change password</span>
            </li>
            <li
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              @click="logout"
            >
              <span class="text-sm">Logout</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
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
} from "../../../assets/js/imports";
  export default {
    data() {
      return {
        username: sessionStorage.getItem("username"),
        role: sessionStorage.getItem("role"),
        activeMenu: sessionStorage.getItem("activeIndex") || 0,
        menus: [
          {
            _id: 1,
            name: "Dashboard",
            router: "Dashboard-teacher",
          },
          {
            _id: 2,
            name: "Children development index",
            router: "Cdi-child",
          },
          {
            _id: 2,
            name: "Attendance",
            router: "Attendance-child",
          },
          {
            _id: 2,
            name: "Meal",
            router: "Meal-child",
          },
          {
            _id: 2,
            name: "Receipt",
            router: "Receipt-child",
          },
          {
            _id: 3,
            name: "Report",
            router: "Dish-chef",
          },
        ],
      };
    },
    methods: {
      logout() {
        sessionStorage.removeItem("token");
        run_alert(alert_success(`Logout successful.`));
        this.$router.push({ name: "Login" });
      },
      getFirstLetter(name) {
        const lastName = name.trim().split(" ").pop();
        return lastName ? lastName.charAt(0).toUpperCase() : "";
      },
      sessionStorageactiveIndex(value) {
        sessionStorage.setItem("activeIndex", value.toString());
      },
      sessionStorageactiveIndexChild(value) {
        sessionStorage.setItem("activeIndexChild", value.toString());
      },
    },
  };
  </script>
  
  <style scoped>
  /* Your custom styles go here */
  .avatar {
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: calc(var(--size) / 2.5);
    color: #ffffff;
  }
  
  .initial {
    text-transform: uppercase;
  }
  </style>
  