<template>
  <Form
    v-if="buttonName == 'Add'"
    @submit=""
    :validation-schema="formSchema"
    v-slot="{ errors }"
  >
    <div
      class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
    >
      <div class="bg-slate-900 h-screen opacity-70 flex-1 relative"></div>
      <div
        class="bg-white mx-5 w-6/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
        style="min-height: 100px"
      >
        <div
          class="flex flex-row justify-between items-center px-3 py-3 text-slate-900 border border-solid border-slate-300 border-l-0 border-r-0 border-t-0 text-lg"
        >
          <span>{{ title }}</span>
          <span
            @click="cancel"
            class="material-symbols-outlined cursor-pointer text-slate-900 hover:text-red-500"
            title="Đóng"
          >
            close
          </span>
        </div>
        <div class="flex flex-col my-5 mx-3">
          <div class="flex flex-row mt-5">
            <div
              class="w-4/12 mr-4 flex h-full flex-col items-start justify-center"
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
                      ? 'border border-solid border-green-500 bg-green-500 text-white'
                      : 'border border-solid border-slate-900 text-slate-900 hover:bg-gray-200 hover:border-gray-200',
                  ]"
                  >{{ step.id }}</span
                >
                <span
                  class="whitespace-nowrap"
                  :class="[
                    step.id == activeStep ? 'text-slate-900' : 'text-slate-900',
                  ]"
                  >{{ step.name }}</span
                >
              </div>
            </div>
            <div
              class="border border-solid border-t-0 border-l-0 border-b-0 border-slate-200 mx-4"
            ></div>
            <!--! page 1 -->
            <div
              class="w-11/12 overflow-auto pr-3 pt-3"
              style="max-height: calc(100vh - 250px)"
              v-show="activeStep == 1"
            >
              <!-- name -->
              <div class="flex flex-col text-slate-900">
                <label for="name" class="-mt-2.5 flex items-center"
                  >Họ tên<span class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.name"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                  name="name"
                  type="text"
                  placeholder=""
                  :class="errors.name ? 'border-red-500' : 'border-slate-300'"
                  autocomplete="off"
                />
                <ErrorMessage
                  name="name"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                />
              </div>
              <!-- gender -->
              <div class="flex flex-col text-slate-900">
                <label for="" class="mt-2.5 flex items-center"
                  >Giới tính<span class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <div class="flex items-center">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="true"
                    v-model="item.gender"
                    class="mr-2"
                    :checked="item.gender == 'true'"
                  />
                  <label for="male" class="mr-4 mt-1">Nam</label>

                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="false"
                    v-model="item.gender"
                    class="mr-2"
                    :checked="item.gender == 'false'"
                  />
                  <label for="female" class="mt-1">Nữ</label>
                </div>
                <p v-if="!item.gender" class="text-red-500 mt-2 ml-0.5 text-sm">
                  Vui lòng chọn giới tính.
                </p>
              </div>
              <!-- phone -->
              <div class="flex flex-col text-slate-900">
                <label for="" class="mt-2.5 flex items-center"
                  >Phone<span class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.phone"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                  name="phone"
                  style=""
                  type="text"
                  placeholder=""
                  :class="errors.phone ? 'border-red-500' : 'border-slate-300'"
                  autocomplete="off"
                />
                <ErrorMessage
                  name="phone"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                />
              </div>
              <!-- email -->
              <div class="flex flex-col text-slate-900">
                <label for="" class="mt-2.5 flex items-center"
                  >E-mail<span class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.email"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                  name="email"
                  style=""
                  type="text"
                  placeholder=""
                  :class="errors.email ? 'border-red-500' : 'border-slate-300'"
                  autocomplete="off"
                />
                <ErrorMessage
                  name="email"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                />
              </div>
              <LocationPicker
                :province="item.province"
                :district="item.district"
                :ward="item.ward"
                :checks="checks"
                @province-selected="(value) => (item.province = value)"
                @district-selected="(value) => (item.district = value)"
                @ward-selected="(value) => (item.ward = value)"
              />
              <!-- address -->
              <div class="flex flex-col text-slate-900">
                <label for="" class="mt-2.5 flex items-center"
                  >Địa chỉ thường trú<span
                    class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.address"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                  name="address"
                  as="textarea"
                  style=""
                  placeholder=""
                  :class="
                    errors.address ? 'border-red-500' : 'border-slate-300'
                  "
                  autocomplete="off"
                />
                <ErrorMessage
                  name="address"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                />
              </div>
            </div>
            <!--! page 2 -->
            <div class="w-11/12" v-show="activeStep == 2">
              <!-- Position -->
              <div class="flex flex-col text-slate-900">
                <label for="" class="-mt-2.5 flex items-center"
                  >Chức vụ<span class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <FSelect
                  @update:modelValue="
                    async (value) => {
                      if (value != 'other') {
                        item.position = value;
                      } else {
                        const temp = await alert_input_1(
                          'text',
                          '',
                          'Nhập vào tên chức vụ'
                        );
                        item.position = (
                          await createPosition({ name: temp })
                        ).document._id;
                        await getAllPosition();
                      }
                    }
                  "
                  @update="(value) => (runGet = value)"
                  :options="position"
                  :modelValue="`Chọn`"
                  :class="
                    !item.position ? 'border-red-500' : 'border-slate-300'
                  "
                />
                <span
                  v-if="!item.position"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                  >Đây là trường bắt buộc.</span
                >
              </div>
              <!-- Diploma -->
              <div class="flex flex-col text-slate-900">
                <label for="" class="mt-2.5 flex items-center"
                  >Bằng cấp<span class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <FSelect
                  @update:modelValue="
                    async (value) => {
                      if (value != 'other') {
                        item.diploma = value;
                      } else {
                        const temp = await alert_input_1(
                          'text',
                          '',
                          'Nhập vào tên bằng cấp'
                        );
                        item.diploma = (
                          await createDiploma({ name: temp })
                        ).document._id;
                        await getAllDiploma();
                      }
                    }
                  "
                  @update="(value) => (runGet = value)"
                  :options="diploma"
                  :modelValue="`Chọn`"
                  :class="!item.diploma ? 'border-red-500' : 'border-slate-300'"
                  :activeSearch="true"
                />
                <span
                  v-if="!item.diploma"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                  >Đây là trường bắt buộc.</span
                >
              </div>
              <div class="flex flex-col text-slate-900">
                <label for="name_c" class="mt-2.5 ml-1 flex items-center"
                  >Ngày công tác<span
                    class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.startWorking"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                  name="startWorking"
                  type="date"
                  placeholder=""
                  :class="
                    errors.startWorking ? 'border-red-500' : 'border-slate-300'
                  "
                  autocomplete="off"
                />
                <ErrorMessage
                  name="startWorking"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                />
              </div>
            </div>
            <!-- account -->
            <div class="w-11/12" v-show="activeStep == 3">
              <div class="">
                <!-- name -->
                <div class="flex flex-col text-slate-900">
                  <label for="" class="-mt-2.5 flex items-center"
                    >Tên đăng nhập<span
                      class="text-red-500 text-3xl relative ml-0.5"
                      >*</span
                    ></label
                  >
                  <Field
                    v-model="item.user_name"
                    class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                    style=""
                    name="username"
                    type="text"
                    placeholder=""
                    :class="
                      errors.username ? 'border-red-500' : 'border-slate-300'
                    "
                    autocomplete="off"
                  />
                  <p
                    v-if="checkUser == false"
                    class="text-red-500 mt-2 ml-0.5 text-sm"
                  >
                    Tên tài khoản đã tồn tại.
                  </p>
                  <ErrorMessage
                    name="username"
                    class="text-red-500 mt-2 ml-0.5 text-sm"
                  />
                </div>
                <!-- password -->
                <div class="flex flex-col text-slate-900">
                  <label for="" class="mt-2.5 flex items-center"
                    >Mật khẩu<span class="text-red-500 text-3xl relative ml-0.5"
                      >*</span
                    ></label
                  >
                  <div class="flex-1 relative">
                    <span class="absolute inset-y-0 right-0 flex items-center">
                      <span
                        @click="showPassword = !showPassword"
                        class="material-symbols-outlined mr-2 text-slate-300 cursor-pointer hover:text-slate-900"
                      >
                        {{ showPassword ? "visibility" : "visibility_off" }}
                      </span>
                    </span>
                    <Field
                      v-model="item.password"
                      class="bg-inherit w-full rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                      style=""
                      name="password"
                      :type="!showPassword ? 'password' : 'text'"
                      placeholder=""
                      :class="
                        errors.password ? 'border-red-500' : 'border-slate-300'
                      "
                      autocomplete="off"
                    />
                  </div>
                  <ErrorMessage
                    name="password"
                    class="text-red-500 mt-2 ml-0.5 text-sm"
                  />
                </div>
                <!-- role -->
                <div class="flex flex-col text-slate-900">
                  <label for="" class="mt-2.5 flex items-center"
                    >Vai trò tài khoản<span
                      class="text-red-500 text-3xl relative ml-0.5"
                      >*</span
                    ></label
                  >
                  <FSelect
                    class=""
                    :options="[
                      {
                        _id: 'ban giám hiệu',
                        name: 'ban giám hiệu',
                      },
                      {
                        _id: 'giáo viên quản lý trẻ',
                        name: 'giáo viên quản lý trẻ',
                      },
                      {
                        _id: 'quản trị hệ thống',
                        name: 'quản trị hệ thống',
                      },
                      {
                        _id: 'kế toán',
                        name: 'kế toán',
                      },
                      {
                        _id: 'nhân viên bếp',
                        name: 'nhân viên bếp',
                      },
                    ]"
                    :model-value="`Chọn`"
                    @update:modelValue="(value) => (item.role = value)"
                  />
                </div>
                <p v-if="!item.role" class="text-red-500 mt-2 ml-0.5 text-sm">
                  Đây là trường bắt buộc.
                </p>
              </div>
              <button
                @click="
                  () => {
                    checks = {
                      province: false,
                      district: false,
                      ward: false,
                    };
                    if (
                      !errors.phone &&
                      !errors.email &&
                      !errors.startWorking &&
                      item.province &&
                      item.district &&
                      item.ward
                    ) {
                      submit();
                    }
                  }
                "
                class="text-white border border-solid px-3 py-1.5 flex items-center justify-center rounded-md hover:shadow-lg hover:shadow-yellow-500/50 mt-3"
                :class="[
                  buttonName == 'Add'
                    ? 'border-blue-500 bg-blue-500 '
                    : 'border-yellow-500 hover:bg-yellow-500',
                ]"
              >
                {{ buttonName == "Add" ? "Thêm" : "Cập nhật" }}
              </button>
              <!-- Button Add -->
            </div>
            <div v-if="isHeadquarters" class="w-11/12" v-show="activeStep == 4">
              <!-- <div class="">
                <div v-if="isHeadquarters" class="flex flex-col text-slate-900">
                  <label for="" class="mt-2.5 flex items-center"
                    >Tên nhà trẻ<span
                      class="text-red-500 text-3xl relative ml-0.5"
                      >*</span
                    ></label
                  >
                  <FSelect
                    class=""
                    :options="childcareCenter"
                    @update:modelValue="
                      (value) => (item.childcareCenter = value)
                    "
                  />
                  <p
                    v-if="!item.childcareCenter"
                    class="text-red-500 mt-2 ml-0.5 text-sm"
                  >
                    Đây là trường bắt buộc.
                  </p>
                </div>
              </div> -->
              <!-- Button Add -->
            </div>
          </div>
          <div class="flex justify-end mt-5">
            <span
              v-if="activeStep > 1 && activeStep <= stepList.length"
              class="flex items-center px-5 py-1.5 rounded-md border border-solid border-slate-900 text-slate-900 hover:border-gray-200 hover:bg-gray-200 cursor-pointer"
              @click="activeStep = activeStep - 1"
              >Trước</span
            >
            <span
              v-if="activeStep >= 1 && activeStep < stepList.length"
              class="flex items-center px-5 py-1.5 ml-5 rounded-md border border-solid border-slate-900 text-slate-900 hover:border-gray-200 hover:bg-gray-200 cursor-pointer"
              @click="activeStep = activeStep + 1"
              >Kế tiếp
            </span>
          </div>
        </div>
      </div>
    </div>
  </Form>
  <Form
    v-if="buttonName == 'Edit'"
    @submit=""
    :validation-schema="formSchema"
    v-slot="{ errors }"
  >
    <div
      class="fixed top-0 right-0 w-screen h-screen z-50 flex overflow-auto items-center justify-center"
    >
      <div class="bg-slate-900 h-screen opacity-70 flex-1 relative"></div>
      <div
        class="bg-white mx-5 w-4/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
        style="min-height: 100px"
      >
        <div
          class="flex flex-row justify-between items-center px-3 py-3 text-slate-900 border border-solid border-slate-300 border-l-0 border-r-0 border-t-0 text-lg"
        >
          <span>{{ title }}</span>
          <span
            @click="cancel"
            class="material-symbols-outlined cursor-pointer text-slate-900 hover:text-red-500"
          >
            close
          </span>
        </div>
        <div class="flex flex-col my-5 mx-3">
          <div class="flex flex-row">
            <div
              class="w-full overflow-auto pr-3 pt-2"
              style="max-height: calc(100vh - 250px)"
            >
              <!-- name -->
              <div class="flex flex-col text-slate-900">
                <label for="name" class="-mt-2.5 flex items-center"
                  >Name<span class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.name"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                  name="name"
                  type="text"
                  placeholder=""
                  :class="errors.name ? 'border-red-500' : 'border-slate-300'"
                  autocomplete="off"
                />
                <ErrorMessage
                  name="name"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                />
              </div>
              <!-- gender -->
              <div class="flex flex-col text-slate-900">
                <label for="" class="mt-2.5 flex items-center"
                  >Giới tính<span class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <div class="flex items-center">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="true"
                    v-model="item.gender"
                    class="mr-2"
                    :checked="item.gender == 'true'"
                  />
                  <label for="male" class="mr-4 mt-1">Nam</label>

                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="false"
                    v-model="item.gender"
                    class="mr-2"
                    :checked="item.gender == 'false'"
                  />
                  <label for="female" class="mt-1">Nữ</label>
                </div>
                <p v-if="!item.gender" class="text-red-500 mt-2 ml-0.5 text-sm">
                  Vui lòng chọn giới tính.
                </p>
              </div>
              <!-- phone -->
              <div class="flex flex-col text-slate-900">
                <label for="" class="mt-2.5 flex items-center"
                  >Phone<span class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.phone"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                  name="phone"
                  style=""
                  type="text"
                  placeholder=""
                  :class="errors.phone ? 'border-red-500' : 'border-slate-300'"
                  autocomplete="off"
                />
                <ErrorMessage
                  name="phone"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                />
              </div>
              <!-- email -->
              <div class="flex flex-col text-slate-900">
                <label for="" class="mt-2.5 flex items-center"
                  >E-mail<span class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.email"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                  name="email"
                  style=""
                  type="text"
                  placeholder=""
                  :class="errors.email ? 'border-red-500' : 'border-slate-300'"
                  autocomplete="off"
                />
                <ErrorMessage
                  name="email"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                />
              </div>
              <LocationPicker
                :province="item.province"
                :district="item.district"
                :ward="item.ward"
                :checks="checks"
                @province-selected="(value) => (item.province = value)"
                @district-selected="(value) => (item.district = value)"
                @ward-selected="(value) => (item.ward = value)"
              />
              <!-- address -->
              <div class="flex flex-col text-slate-900">
                <label for="" class="mt-2.5 flex items-center"
                  >Địa chỉ thường trú<span
                    class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.address"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                  name="address"
                  as="textarea"
                  style=""
                  placeholder=""
                  :class="
                    errors.address ? 'border-red-500' : 'border-slate-300'
                  "
                  autocomplete="off"
                />
                <ErrorMessage
                  name="address"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                />
              </div>
              <!-- Position -->
              <div class="flex flex-col text-slate-900">
                <label for="" class="mt-2.5 flex items-center"
                  >Chức vụ<span class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <FSelect
                  @update:modelValue="
                    async (value) => {
                      if (value != 'other') {
                        item.position = value;
                      } else {
                        const temp = await alert_input_1(
                          'text',
                          '',
                          'Nhập vào tên chức vụ'
                        );
                        item.position = (
                          await createPosition({ name: temp })
                        ).document._id;
                        await getAllPosition();
                      }
                    }
                  "
                  @update="(value) => (runGet = value)"
                  :options="position"
                  :modelValue="item.position_name || 'Choose'"
                  :class="
                    !item.position ? 'border-red-500' : 'border-slate-300'
                  "
                  :activeSearch="true"
                />
                <span
                  v-if="!item.position"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                  >Đây là trường bắt buộc.</span
                >
              </div>
              <button
                @click="
                  () => {
                    checks = {
                      province: false,
                      district: false,
                      ward: false,
                    };
                    if (
                      !errors.phone &&
                      !errors.email &&
                      item.province &&
                      item.district &&
                      item.ward
                    ) {
                      submit();
                    }
                  }
                "
                class="text-white border border-solid px-3 py-1.5 flex items-center justify-center rounded-md hover:shadow-lg hover:shadow-yellow-500/50 mt-5"
                :class="[
                  buttonName == 'Add'
                    ? 'border-green-500 hover:bg-green-500'
                    : 'border-yellow-500 bg-yellow-500',
                ]"
              >
                {{ buttonName == "Add" ? "Thêm" : "Cập nhật" }}
              </button>
            </div>
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
import Position from "../../services/position.service";
import ChildcareCenter from "../../services/childcareCenter.service";
import Diploma from "../../services/diploma.service";
import Account from "../../services/account.service";
import LocationPicker from "../../components/forms/LocationPicker.vue";
import { verifyToken } from "../../assets/js/imports.js";
import { alert_input_1 } from "../../assets/js/alert.js";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    FSelect,
    BAdd,
    LocationPicker,
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
    placeholder: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    buttonName: {
      type: String,
      default: "Add",
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
      name: yup.string().required(`Đây là trường bắt buộc.`),
      phone: yup
        .string()
        .required("Đây là trường bắt buộc.")
        .matches(
          /((09|03|07|08|05)+([0-9]{8})\b)/g,
          "Số điện thoại không hợp lê."
        ),
      email: yup
        .string()
        .required(`Đây là trường bắt buộc.`)
        .email("Địa chỉ mail không hợp lệ."),
      startWorking: yup.date().required(`Đây là trường bắt buộc.`),
      // .min(new Date(), "Ngày bắt đầu công tác phải lớn hơn ngày hiện tại."),
      address: yup.string().required(`Đây là trường bắt buộc.`),
      username: yup.string().required(`Đây là trường bắt buộc.`),
      password: yup.string().required(`Đây là trường bắt buộc.`),
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
          name: "Thông tin cá nhân",
        },
        {
          id: 2,
          name: "Thông tin công việc",
        },
        {
          id: 3,
          name: "Thông tài khoản",
        },
      ],
      activeStep: 1,
      showPassword: true,
      accounts: [],
      checkUser: false,
      checks: {
        province: true,
        district: true,
        ward: true,
      },
      childcareCenter: [],
      isHeadquarters: true,
    };
  },
  methods: {
    cancel() {
      this.$emit("cancel", false);
    },
    alert_input_1,
    // submit() {
    //   if (!this.item.position || !this.item.diploma) {
    //   } else {
    //     this.$emit("submit", this.item);
    //   }
    // },
    async getAllPosition() {
      try {
        this.position = await Position.getAll();
        this.position.push({
          _id: "other",
          name: "khác",
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getAllDiploma() {
      try {
        this.diploma = await Diploma.getAll();
        this.diploma.push({
          _id: "other",
          name: "khác",
        });
      } catch (error) {
        console.log(error);
      }
    },

    async getAll() {
      await this.getAllDiploma();
      await this.getAllPosition();
    },

    async getPosition() {
      try {
        this.mPosition = await Position.get(this.item.position);
      } catch (error) {
        console.log(error);
      }
    },

    async getDiploma() {
      try {
        this.mDiploma = await Diploma.get(this.item.diploma);
      } catch (error) {
        console.log(error);
      }
    },

    async getAllChildcareCenter() {
      try {
        this.childcareCenter = await ChildcareCenter.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    async get() {
      await this.getPosition();
      await this.getDiploma();
    },

    submit() {
      this.$emit("submit");
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
      this.item.password = OTP;
      return OTP;
    },

    setUser() {
      this.item.user_name = this.item.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .split(" ")
        .join("");
      this.generateOTP();
    },

    async getAllAccounts() {
      try {
        this.accounts = await Account.getAll();
      } catch (error) {}
    },

    checkUser1() {
      this.accounts = this.accounts.filter((value, index) => {
        return value.name == this.item.user_name;
      });
      if (this.accounts.length > 0) this.checkUser = false;
      else this.checkUser = true;
    },
    async createPosition(value) {
      try {
        const result = await Position.create(value);
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    async createDiploma(value) {
      try {
        const result = await Diploma.create(value);
        return result;
      } catch (error) {
        console.log(error);
      }
    },
  },
  async created() {
    await this.getAllChildcareCenter();
    await this.getAll();
    // await this.get();
    await this.getAllAccounts();
    this.isHeadquarters = await verifyToken();
  },
};
</script>
