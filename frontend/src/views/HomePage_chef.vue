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
  // Swal
  Swal,
  // components
//   Navbar,
//   Sidebar,
//   Footer,
  Login,
} from "../assets/js/imports.js";

import Navbar from "../components/layouts/chef/navbar.vue"
import Footer from "../components/layouts/chef/footer.vue";

export default {
  components: {
    Navbar,
    Footer,
  },
  methods: {
    showNotification() {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      // Hiển thị thông báo A
      Toast.fire({
        icon: "success",
        title: "Thành công A",
        showCloseButton: true,
        timer: 3000,
      }).then((result) => {
        // Khi thông báo A biến mất, hiển thị thông báo B
        if (result.dismiss === Swal.DismissReason.timer) {
          Toast.fire({
            icon: "success",
            title: "Thành công B",
            showCloseButton: true,
            timer: 3000,
          });
        }
      });
    },
  },
};
</script>

<template>
  <div class="w-full">
    <div class="flex flex-row">
      <div class="relative w-full ml-5">
        <div
          class="my-5 mr-5 rounded-md z-20 border border-solid border-slate-300 border-0.5 print:hidden"
        >
          <Navbar />
        </div>
        <div class="mr-5 mt-5">
          <RouterView></RouterView>
        </div>
        <div
          class="mr-5 mt-5 rounded-md border border-solid border-slate-300 print:hidden"
        >
          <Footer />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.swal2-close {
  background-color: transparent;
  color: black;
  font-size: 20px;
  font-weight: bold;
}
</style>
