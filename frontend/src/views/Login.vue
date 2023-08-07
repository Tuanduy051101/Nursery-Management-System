<template>
  <div class="w-screen h-screen flex bg-slate-800">
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
          style="width: 250px"
          class=""
        />
      </div>
      <span class="mt-5 ml-4 text-xl font-black text-white">Welcome to</span>
      <div class="flex mt-4">
        <span class="text-green-500 text-xl ml-2 uppercase tracking-widest logo"
          >Nursery</span
        >
        <span
          class="text-yellow-500 text-xl ml-2 uppercase tracking-widest logo"
          >Management</span
        >
        <span class="text-red-500 text-xl ml-2 uppercase tracking-widest logo"
          >System</span
        >
      </div>
      <Form
        class="flex flex-col mx-4 text-white"
        @submit="login"
        :validation-schema="formSchema"
      >
        <div class="flex flex-col mt-10 mb-5">
          <label for="email" class="mb-2 font-black text-lg">User Name</label>
          <Field
            v-model="user.username"
            name="userName"
            type="text"
            autocomplete="off"
            placeholder=""
            class="py-2 px-2 w-96 border bg-inherit border-solid border-slate-600 rounded-md focus:border-slate-300"
          />
          <ErrorMessage class="mt-2 text-red-500" name="userName" />
        </div>
        <div class="flex flex-col">
          <label for="password" class="mb-2 font-black text-lg">Password</label>
          <div class="flex-1 relative">
            <span class="absolute inset-y-0 right-0 flex items-center">
              <span
                @click="showPassword = !showPassword"
                class="material-symbols-outlined mr-2 text-slate-300 cursor-pointer"
              >
                {{ showPassword ? "visibility" : "visibility_off" }}
              </span>
            </span>
            <Field
              v-model="user.password"
              :type="showPassword ? 'text' : 'password'"
              class="bg-inherit w-full border-slate-600 rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
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
            value="Login"
            class="w-96 border border-solid rounded-md py-2 border-blue-700 text-xl hover:bg-blue-700 hover:text-white cursor-pointer"
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
  userName: yup.string().required("Username needs to have value."),
  password: yup.string().required("Password needs to have value."),
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
      sessionStorage.setItem("owner", User.owner);
      run_alert(alert_success(User.message)).then(() => {
        sessionStorage.setItem("activeIndex", '1000');
        sessionStorage.removeItem("activeIndexChild");
        router.push({ name: "Dashboard" });
      });
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
