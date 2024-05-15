<template>
  <div class="w-screen h-screen flex bg-white">
    <div class="flex-1">
      <img
        src="https://cdn.pixabay.com/photo/2016/04/12/19/01/three-1325106__340.png"
        alt=""
        class="h-screen"
      />
    </div>
    <div class="flex flex-col w-4/12 justify-center items-center">
      <div class="flex justify-start mb-10">
        <img
          src="../assets/images/logo.png"
          alt=""
          style="width: 400px"
          class=""
        />
      </div>
      <div class="flex -mt-10">
        <span class="text-3xl ml-2 font-extrabold">
          <span
            class="text-yellow-600"
            style="text-shadow: 2px 2px 4px rgba(225, 5, 5, 0.5)"
            >Hệ Thống&ensp;</span
          >
          <span
            class="text-blue-500"
            style="text-shadow: 2px 2px 4px rgba(11, 4, 234, 0.5)"
            >Quản Lý Nhà Trẻ</span
          >
        </span>
      </div>
      <Form
        class="flex flex-col mx-4 text-white"
        @submit="login"
        :validation-schema="formSchema"
      >
        <div class="flex flex-col mt-10 mb-5">
          <label for="email" class="mb-2 font-black text-slate-900 text-lg"
            >Tên đăng nhập</label
          >
          <Field
            v-model="user.username"
            name="userName"
            type="text"
            autocomplete="off"
            placeholder=""
            class="py-2 px-2 w-96 border bg-inherit text-slate-900 border-solid border-slate-300 rounded-md focus:border-slate-900 outline-none"
          />
          <ErrorMessage class="mt-2 text-red-500" name="userName" />
        </div>
        <div class="flex flex-col">
          <label for="password" class="mb-2 font-black text-lg text-slate-900">Mật khẩu</label>
          <div class="flex-1 relative">
            <span class="absolute inset-y-0 right-0 flex items-center">
              <span
                @click="showPassword = !showPassword"
                class="material-symbols-outlined mr-2 text-slate-600 cursor-pointer"
              >
                {{ showPassword ? "visibility" : "visibility_off" }}
              </span>
            </span>
            <Field
              v-model="user.password"
              :type="showPassword ? 'text' : 'password'"
              class="bg-inherit w-full border-slate-300 text-slate-900 rounded-md px-2 py-1.5 border border-solid focus:border-slate-900 outline-none"
              style=""
              name="password"
              placeholder=""
              autocomplete="off"
            />
          </div>
          <ErrorMessage class="mt-2 text-red-500" name="password" />
        </div>
        <div class="flex flex-col mt-10">
          <input
            type="submit"
            value="Đăng nhập"
            class="w-96 border border-solid rounded-md py-2 border-purple-500 bg-purple-500 text-xl hover:shadow-lg hover:shadow-yellow-500/50 cursor-pointer"
          />
        </div>
      </Form>
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
} from "../assets/js/imports";

const formSchema = yup.object().shape({
  userName: yup.string().required("Đây là trường bắt buộc."),
  password: yup.string().required("Đây là trường bắt buộc."),
});

const user = ref({
  username: "",
  password: "",
});
const router = useRouter();
const showPassword = ref(false);

const login = async () => {
  try {
    const User = await Account.signin({
      username: user.value.username,
      password: user.value.password,
    });

    if (User.error) {
      run_alert(alert_error(User.message));
    } else {
      sessionStorage.setItem("token", User.token);
      sessionStorage.setItem("username", User.username);
      sessionStorage.setItem("role", User.role);
      sessionStorage.setItem("owner_id", User.owner._id);
      sessionStorage.setItem("owner", User.owner);
      sessionStorage.setItem("owner_name", User.owner.name);
      sessionStorage.setItem(
        "owner_childcareCenter",
        User.owner.childcareCenter
      );
      sessionStorage.setItem(
        "owner_childcareCenterName",
        User.owner.childcareCenterName
      );
      sessionStorage.setItem(
        "owner_childcareCenterEmail",
        User.owner.childcareCenterEmail
      );
      sessionStorage.setItem(
        "owner_childcareCenterPhone",
        User.owner.childcareCenterPhone
      );
      sessionStorage.setItem(
        "owner_childcareCenterAddress",
        User.owner.childcareCenterAddress
      );
      sessionStorage.setItem("owner_isHeadquarters", User.owner.isHeadquarters);
      run_alert(alert_success(User.message)).then(async () => {
        sessionStorage.setItem("activeIndex", "1000");
        sessionStorage.removeItem("activeIndexChild");

        if (User.role == "phụ huynh") router.push({ name: "Dashboard-child" });
        if (User.role == "giáo viên quản lý trẻ")
          router.push({ name: "ClassRoom-teacher" });
        if (User.role == "nhân viên bếp")
          router.push({ name: "MealTicket-chef" });
        if (User.role == "kế toán")
          router.push({ name: "Dashboard-accountant" });
        if (User.role == "quản trị hệ thống" || User.role == "ban giám hiệu")
          router.push({ name: "Dashboard" });

        const token = sessionStorage.getItem("token");
        const isHeadquarters = sessionStorage.getItem("owner_isHeadquarters");
        const isToken = await Account.verifyToken({
          token,
          isHeadquarters,
        });
        console.log(isToken);
      });
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
