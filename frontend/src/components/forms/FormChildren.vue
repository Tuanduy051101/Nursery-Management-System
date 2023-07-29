<template>
  <Form @submit="submit" :validation-schema="formSchema" v-slot="{ errors }">
    <div
      class="fixed top-0 right-0 w-screen h-screen z-50 flex overflow-auto items-center justify-center"
    >
      <div class="bg-slate-800 h-screen opacity-70 flex-1 relative"></div>
      <div
        class="bg-slate-800 mx-5 w-6/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
        style="min-height: 100px"
      >
        <div
          class="flex flex-row justify-between items-center px-3 py-3 text-slate-300 border border-solid border-slate-300 border-l-0 border-r-0 border-t-0 text-lg"
        >
          <span>{{ title }}</span>
          <span
            @click="cancel"
            class="material-symbols-outlined cursor-pointer text-slate-600 hover:text-slate-300"
          >
            close
          </span>
        </div>
        <div class="flex flex-col my-5 mx-3">
          <div class="flex flex-row mt-5">
            <div
              class="w-2/12 mr-4 flex h-full flex-col items-start justify-center"
            >
              <div
                v-for="(step, index) in stepList"
                :key="step.id"
                class="flex flex-row items-center mb-8 cursor-pointer"
                @click="activeStep = step.id"
              >
                <span
                  class="h-10 w-10 mr-3 rounded-md flex items-center justify-center"
                  :class="[
                    step.id == activeStep
                      ? 'border border-solid border-slate-300 text-slate-300'
                      : 'border border-solid border-slate-600 text-slate-600',
                  ]"
                  >{{ step.id }}</span
                >
                <span
                  class=""
                  :class="[
                    step.id == activeStep ? 'text-slate-300' : 'text-slate-600',
                  ]"
                  >{{ step.name }}</span
                >
              </div>
            </div>
            <div
              class="border border-solid border-t-0 border-l-0 border-b-0 border-slate-600 mx-4"
            ></div>
            <!--! page 1 -->
            <div class="w-10/12" v-show="activeStep == 1">
              <div class="flex">
                <!-- name -->
                <div class="flex w-6/12 flex-col text-slate-300">
                  <label for="name" class="mb-1 -mt-2.5 ml-1 flex items-center"
                    >Name<span
                      class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                      >*</span
                    ></label
                  >
                  <Field
                    v-model="item.name"
                    class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                    name="name"
                    type="text"
                    placeholder=""
                    :class="!item.name ? 'border-red-500' : 'border-slate-600'"
                  />
                  <ErrorMessage
                    name="name"
                    class="text-red-500 mt-1 ml-1 text-sm"
                  />
                </div>
                <!-- gender -->
                <div class="flex w-6/12 flex-col text-slate-300 ml-3">
                  <label for="" class="mb-1 -mt-2.5 ml-1 flex items-center"
                    >Gender<span
                      class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                      >*</span
                    ></label
                  >
                  <FSelect
                    class=""
                    @update:modelValue="(value) => (item.gender = value)"
                    @update="(value) => (runGet = value)"
                    :options="[
                      {
                        _id: true,
                        name: 'nam',
                      },
                      {
                        _id: false,
                        name: 'nữ',
                      },
                    ]"
                    :modelValue="`nam`"
                  />
                </div>
              </div>
              <!-- phone -->
              <div class="flex flex-col text-slate-300">
                <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
                  >Phone<span
                    class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.phone"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                  name="phone"
                  style=""
                  type="text"
                  placeholder=""
                  :class="
                    !item.phone || errors.phone
                      ? 'border-red-500'
                      : 'border-slate-600'
                  "
                />
                <ErrorMessage
                  name="phone"
                  class="text-red-500 mt-1 ml-1 text-sm"
                />
              </div>
              <!-- email -->
              <div class="flex flex-col text-slate-300">
                <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
                  >E-mail<span
                    class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.email"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                  name="email"
                  style=""
                  type="text"
                  placeholder=""
                  :class="
                    !item.email || errors.email
                      ? 'border-red-500'
                      : 'border-slate-600'
                  "
                />
                <ErrorMessage
                  name="email"
                  class="text-red-500 mt-1 ml-1 text-sm"
                />
              </div>
              <!-- address -->
              <div class="flex flex-col text-slate-300">
                <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
                  >Address<span
                    class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.address"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                  name="address"
                  id="address"
                  style=""
                  type="text"
                  placeholder=""
                  :class="
                    !item.address || errors.address
                      ? 'border-red-500'
                      : 'border-slate-600'
                  "
                />
                <ErrorMessage
                  name="address"
                  class="text-red-500 mt-1 ml-1 text-sm"
                />
              </div>
              <!-- Relationship -->
              <div class="flex flex-col text-slate-300">
                <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
                  >Relationship<span
                    class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                    >*</span
                  ></label
                >
                <FSelect
                  @update:modelValue="(value) => (item.relationship = value)"
                  @update="(value) => (runGet = value)"
                  :options="[
                    { _id: 'bố', name: 'bố' },
                    { _id: 'mẹ', name: 'mẹ' },
                    { _id: 'anh trai', name: 'anh trai' },
                    { _id: 'chị gái', name: 'chị gái' },
                    { _id: 'người giám hộ', name: 'người giám hộ' },
                  ]"
                  :modelValue="`bố`"
                  :class="
                    !item.relationship ? 'border-red-500' : 'border-slate-600'
                  "
                />
                <span
                  v-if="!item.relationship"
                  class="text-red-500 mt-1 ml-1 text-sm"
                  >Please select a value !</span
                >
              </div>
            </div>
            <!--! page 2 -->
            <div class="w-11/12" v-show="activeStep == 2">
              <div class="flex">
                <!-- name -->
                <div class="flex w-6/12 flex-col text-slate-300">
                  <label
                    for="name_c"
                    class="mb-1 -mt-2.5 ml-1 flex items-center"
                    >Name<span
                      class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                      >*</span
                    ></label
                  >
                  <Field
                    v-model="item1.name"
                    class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                    name="name_c"
                    type="text"
                    placeholder=""
                    :class="!item1.name ? 'border-red-500' : 'border-slate-600'"
                  />
                  <ErrorMessage
                    name="name_c"
                    class="text-red-500 mt-1 ml-1 text-sm"
                  />
                </div>
                <!-- gender -->
                <div class="flex w-6/12 flex-col text-slate-300 ml-3">
                  <label for="" class="mb-1 -mt-2.5 ml-1 flex items-center"
                    >Gender<span
                      class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                      >*</span
                    ></label
                  >
                  <FSelect
                    class=""
                    @update:modelValue="(value) => (item1.gender = value)"
                    @update="(value) => (runGet = value)"
                    :options="[
                      {
                        _id: true,
                        name: 'nam',
                      },
                      {
                        _id: false,
                        name: 'nữ',
                      },
                    ]"
                    :modelValue="`nam`"
                  />
                </div>
              </div>
              <!-- birthday -->
              <div class="flex flex-col text-slate-300">
                <label for="name_c" class="mb-1 mt-2.5 ml-1 flex items-center"
                  >Birthday<span
                    class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item1.birthday"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                  name="birthday"
                  type="date"
                  placeholder=""
                  :class="
                    !item1.birthday ? 'border-red-500' : 'border-slate-600'
                  "
                />
                <ErrorMessage
                  name="birthday"
                  class="text-red-500 mt-1 ml-1 text-sm"
                />
              </div>
              <!-- address -->
              <div class="flex flex-col text-slate-300">
                <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
                  >Address<span
                    class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item1.address"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                  name="address_c"
                  id="address_c"
                  style=""
                  type="text"
                  placeholder=""
                  :class="
                    !item1.address || errors.address_c
                      ? 'border-red-500'
                      : 'border-slate-600'
                  "
                />
                <ErrorMessage
                  name="address_c"
                  class="text-red-500 mt-1 ml-1 text-sm"
                />
              </div>
            </div>
            <!-- acccount -->
            <div class="w-11/12" v-show="activeStep == 3">
              <div class="">
                <!-- name -->
                <div class="flex flex-col text-slate-300">
                  <label for="" class="mb-1 -mt-2.5 ml-1 flex items-center"
                    >User name<span
                      class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                      >*</span
                    ></label
                  >
                  <Field
                    v-model="item2.name"
                    class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                    style=""
                    name="userName"
                    type="text"
                    placeholder=""
                    :class="!item2.name ? 'border-red-500' : 'border-slate-600'"
                  />
                  <p
                    v-if="checkUser == false"
                    class="text-red-500 mt-1 ml-1 text-sm"
                  >
                    This name already has a user.
                  </p>
                </div>
                <!-- password -->
                <div class="flex flex-col text-slate-300">
                  <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
                    >Password<span
                      class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                      >*</span
                    ></label
                  >
                  <div class="flex-1 relative">
                    <span class="absolute inset-y-0 right-0 flex items-center">
                      <span
                        v-if="!showPassword"
                        @click="showPassword = !showPassword"
                        class="material-symbols-outlined mr-2 text-slate-300 cursor-pointer"
                      >
                        visibility
                      </span>
                      <span
                        @click="showPassword = !showPassword"
                        v-if="showPassword"
                        class="material-symbols-outlined mr-2 text-slate-300 cursor-pointer"
                      >
                        visibility_off
                      </span>
                    </span>
                    <Field
                      v-if="showPassword == false"
                      v-model="item2.password"
                      class="bg-inherit w-full rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                      style=""
                      name="passwd"
                      type="password"
                      placeholder=""
                      :class="
                        !item2.password ? 'border-red-500' : 'border-slate-600'
                      "
                    />
                    <Field
                      v-if="showPassword == true"
                      v-model="item2.password"
                      class="bg-inherit w-full rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
                      style=""
                      name="password"
                      type="text"
                      placeholder=""
                      :class="
                        !item2.password ? 'border-red-500' : 'border-slate-600'
                      "
                    />
                  </div>
                </div>
                <!-- role -->
                <div class="flex flex-col text-slate-300">
                  <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
                    >Role<span
                      class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                      >*</span
                    ></label
                  >
                  <FSelect
                    class=""
                    :options="[
                      {
                        _id: 'BGH',
                        name: 'Ban Giám Hiệu',
                      },
                      {
                        _id: 'GVQLT',
                        name: 'Giáo Viên Quản Lý Trẻ',
                      },
                      {
                        _id: 'PH',
                        name: 'Phụ Huynh',
                      },
                      {
                        _id: 'QTHT',
                        name: 'Quản Trị Hệ Thống',
                      },
                      {
                        _id: 'KT',
                        name: 'Kế Toán',
                      },
                      {
                        _id: 'GVDD',
                        name: 'Giáo Viên Điều Dướng',
                      },
                    ]"
                    @update:modelValue="(value) => (item2.role = value)"
                  />
                </div>
              </div>
              <!-- Button Add -->
              <button
                @click=""
                class="text-slate-300 border border-solid border-green-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:bg-green-500 mt-5 hover:text-slate-100"
              >
                Add
              </button>
            </div>
          </div>
          <div class="flex justify-end mt-5">
            <span
              v-if="activeStep >= 1 && activeStep < stepList.length"
              class="flex items-center mr-5 px-5 py-1.5 rounded-md border border-solid border-slate-600 text-slate-600 hover:border-slate-300 hover:text-slate-300 cursor-pointer"
              @click="activeStep = 2"
              >Next
              <span class="material-symbols-outlined flex items-center ml-2">
                navigate_next
              </span>
            </span>
            <span
              v-if="activeStep > 1 && activeStep <= stepList.length"
              class="flex items-center px-5 py-1.5 rounded-md border border-solid border-slate-600 text-slate-600 hover:border-slate-300 hover:text-slate-300 cursor-pointer"
              @click="activeStep = 1"
              ><span class="material-symbols-outlined flex items-center mr-2">
                navigate_before </span
              >Previous</span
            >
          </div>
        </div>
      </div>
    </div>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import FSelect from "./Select.vue";
import BAdd from "../buttons/Add.vue";
import Account from "../../services/account.service";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    FSelect,
    BAdd,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      default: {},
    },
    item1: {
      type: Object,
      default: {},
    },
    item2: {
      type: Object,
      default: {},
    },
    placeholder: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
  },
  emits: ["cancel", "submit"],
  watch: {
    async runGet() {
      await this.get();
      this.runGet = false;
    },
    async activeStep() {
      await this.getAllAccounts();
      if (this.activeStep == 3) {
        this.setUser();
        this.checkUser1();
      }
    },
  },
  data() {
    const formSchema = yup.object().shape({
      name: yup.string().required("Name must have a value !"),
      name_c: yup.string().required("Name must have a value !"),
      phone: yup
        .string()
        .required("Phone number must have a value !")
        .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "Invalid phone number !"),
      email: yup
        .string()
        .required("Email must have a value !")
        .email("Incorrect e-mail !"),
      address: yup.string().required("Address must have a value !"),
      address_c: yup.string().required("Address must have a value !"),
      birthday: yup.date(),
    });
    return {
      formSchema,
      runGet: false,
      error: false,
      position: [],
      diploma: [],
      mPosition: {},
      mDiploma: {},
      stepList: [
        {
          id: 1,
          name: "Parent",
        },
        {
          id: 2,
          name: "Child",
        },
        {
          id: 3,
          name: "Account",
        },
      ],
      activeStep: 1,
      showPassword: false,
      accounts: [],
      checkUser: true,
    };
  },
  methods: {
    cancel() {
      this.$emit("cancel", false);
    },
    submit() {
      if (this.checkUser && this.item2.role.length > 0) {
        this.$emit("submit");
      }
    },
    // Hàm để tạo OTP
    generateOTP() {
      // Khai báo một biến chuỗi
      // nơi lưu trữ tất cả các chuỗi
      var string =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$&!?";
      let OTP = "";
      // Tìm độ dài của chuỗi
      var len = string.length;
      for (let i = 0; i < 10; i++) {
        OTP += string[Math.floor(Math.random() * len)];
      }
      this.item2.password = OTP;
      return OTP;
    },

    setUser() {
      this.item2.name = this.item1.name;
      this.generateOTP();
    },

    async getAllAccounts() {
      try {
        this.accounts = await Account.getAll();
      } catch (error) {}
    },

    checkUser1() {
      this.accounts = this.accounts.filter((value, index) => {
        return value.name == this.item2.name;
      });
      if (this.accounts.length > 0) this.checkUser = false;
      else this.checkUser = true;
    },
  },
  created() {
    this.getAllAccounts();
  },
};
</script>
