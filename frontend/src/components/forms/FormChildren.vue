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
          class="flex flex-row justify-between items-center px-3 py-3 text-slate-300 border border-solid border-slate-300 border-l-0 border-r-0 border-t-0 text-lg"
        >
          <span class="text-slate-900">{{ title }}</span>
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
                      ? 'border border-solid border-green-500 text-white bg-green-500'
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
              class="border border-solid border-t-0 border-l-0 border-b-0 border-slate-300 mx-4"
            ></div>
            <!--! page 1 -->
            <div
              class="w-9/12 overflow-auto pr-3 py-3"
              style="max-height: calc(100vh - 250px)"
              v-show="activeStep == 1"
            >
              <!-- name -->
              <div class="flex flex-col text-slate-900">
                <label for="name" class="-mt-2.5 flex items-center"
                  >Họ và tên<span class="text-red-500 text-3xl ml-0.5 relative"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.p_name"
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
                    v-model="item.p_gender"
                    class="mr-2"
                    :checked="item.p_gender == 'true'"
                  />
                  <label for="male" class="mr-4 mt-1">Nam</label>

                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="false"
                    v-model="item.p_gender"
                    class="mr-2"
                    :checked="item.p_gender == 'false'"
                  />
                  <label for="female" class="mt-1">Nữ</label>
                </div>
                <p
                  v-if="!item.p_gender"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                >
                  Vui lòng chọn giới tính.
                </p>
              </div>
              <!-- phone -->
              <div class="flex flex-col text-slate-900">
                <label for="" class="mt-2.5 flex items-center"
                  >Số điện thoại<span
                    class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.p_phone"
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
                  >E-mail<span class="text-slate-900 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.p_email"
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
              <!-- address -->

              <LocationPicker
                :checks="checks"
                @province-selected="(value) => (item.p_province = value)"
                @district-selected="(value) => (item.p_district = value)"
                @ward-selected="(value) => (item.p_ward = value)"
              />
              <div class="flex flex-col text-slate-900">
                <label for="" class="mt-2.5 flex items-center"
                  >Địa chỉ thường trú<span
                    class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.p_address"
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
              <!-- Relationship -->
              <div class="flex flex-col text-slate-900">
                <label for="" class="mt-2.5 ml-1 flex items-center"
                  >Mối quan hệ<span
                    class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <FSelect
                  @update:modelValue="
                    async (value) => {
                      if (value != 'other') {
                        item.p_relationship = value;
                      } else {
                        item.p_relationship = await alert_input_1(
                          'text',
                          '',
                          'Nhập vào mối quan hệ với trẻ',
                        );
                      }
                    }
                  "
                  @update="(value) => (runGet = value)"
                  :model-value="item.p_relationship"
                  :options="[
                    { _id: 'bố', name: 'bố' },
                    { _id: 'mẹ', name: 'mẹ' },
                    { _id: 'anh trai', name: 'anh trai' },
                    { _id: 'chị gái', name: 'chị gái' },
                    { _id: 'người giám hộ', name: 'người giám hộ' },
                    { _id: 'other', name: 'khác' },
                  ]"
                  :modeAdd="modeAdd"
                  @click="modeAdd = false"
                />
                <span
                  v-if="!item.p_relationship"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                  >Please select a value !</span
                >
              </div>
            </div>
            <!--! page 2 -->
            <div
              class="w-9/12 overflow-auto pr-3 py-3"
              style="max-height: calc(100vh - 250px)"
              v-show="activeStep == 2"
            >
              <!-- name -->
              <div class="flex flex-col text-slate-900">
                <label for="name_c" class="-mt-2.5 flex items-center"
                  >Họ và tên<span class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.c_name"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                  name="name_c"
                  type="text"
                  placeholder=""
                  :class="errors.name_c ? 'border-red-500' : 'border-slate-300'"
                  autocomplete="off"
                />
                <ErrorMessage
                  name="name_c"
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
                    id="male2"
                    name="gender2"
                    value="true"
                    v-model="item.c_gender"
                    class="mr-2"
                    :checked="item.c_gender == 'true'"
                  />
                  <label for="male" class="mr-4 mt-1">Nam</label>

                  <input
                    type="radio"
                    id="female2"
                    name="gender2"
                    value="false"
                    v-model="item.c_gender"
                    class="mr-2"
                    :checked="item.c_gender == 'false'"
                  />
                  <label for="female" class="mt-1">Nữ</label>
                </div>
              </div>
              <!-- birthday -->
              <div class="flex flex-col text-slate-900">
                <label for="name_c" class="mt-2.5 ml-1 flex items-center"
                  >Ngày sinh<span class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.c_birthday"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                  name="birthday"
                  type="date"
                  placeholder=""
                  :class="
                    errors.birthday ? 'border-red-500' : 'border-slate-300'
                  "
                  autocomplete="off"
                />
                <ErrorMessage
                  name="birthday"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                />
              </div>
              <!-- address -->
              <LocationPicker1
                :checks="checks1"
                @province-selected="(value) => (item.c_province = value)"
                @district-selected="(value) => (item.c_district = value)"
                @ward-selected="(value) => (item.c_ward = value)"
              />
              <div class="flex flex-col text-slate-900">
                <label for="" class="mt-2.5 flex items-center"
                  >Địa chỉ thường trú<span
                    class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.c_address"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                  name="address_c"
                  as="textarea"
                  style=""
                  placeholder=""
                  :class="
                    errors.address_c ? 'border-red-500' : 'border-slate-300'
                  "
                  autocomplete="off"
                />
                <ErrorMessage
                  name="address_c"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                />
              </div>
              <div class="flex flex-col text-slate-900">
                <label for="name_c" class="mt-2.5 ml-1 flex items-center"
                  >Ngày nhập học<span
                    class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.startSchooling"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                  name="startSchooling"
                  type="date"
                  placeholder=""
                  :class="
                    errors.startSchooling
                      ? 'border-red-500'
                      : 'border-slate-300'
                  "
                  autocomplete="off"
                />
                <ErrorMessage
                  name="startSchooling"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                />
              </div>
            </div>
            <!-- acccount -->
            <div class="w-11/12" v-show="activeStep == 3">
              <div class="">
                <!-- name -->
                <div class="flex flex-col text-slate-900">
                  <label for="" class="-mt-2.5 ml-1 flex items-center"
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
                <button
                  @click="
                    () => {
                      checks = {
                        province: false,
                        district: false,
                        ward: false,
                      };
                      checks1 = {
                        province: false,
                        district: false,
                        ward: false,
                      };
                      if (
                        !errors.phone &&
                        ((!errors.email && item.p_email) || !item.p_email) &&
                        !errors.birthday &&
                        item.p_province &&
                        item.p_district &&
                        item.p_ward &&
                        item.c_province &&
                        item.c_district &&
                        item.c_ward
                      ) {
                        submit();
                      }
                    }
                  "
                  class="border border-solid px-3 py-1.5 flex items-center justify-center rounded-md mt-5 hover:shadow-lg hover:shadow-yellow-500/50"
                  :class="[
                    buttonName == 'Add'
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-yellow-500 hover:bg-yellow-500',
                  ]"
                >
                  Thêm
                </button>
              </div>
            </div>
            <!-- <div class="w-11/12" v-show="activeStep == 4">
              <div class="">
                <div class="flex flex-col text-slate-900">
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
              </div>
              
            </div> -->
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
              class="flex items-center ml-5 px-5 py-1.5 rounded-md border border-solid border-slate-900 text-slate-900 hover:border-gray-200 hover:bg-gray-200 cursor-pointer"
              @click="activeStep = activeStep + 1"
              >Kế tiếp
            </span>
          </div>
        </div>
      </div>
    </div>
  </Form>
  <!-- Edit -->
  <Form
    v-if="buttonName == 'Edit'"
    @submit=""
    :validation-schema="formSchema"
    v-slot="{ errors }"
  >
    <div
      class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
    >
      <div class="bg-slate-900 h-screen opacity-70 flex-1 relative"></div>
      <div
        class="bg-white mx-5 w-4/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
        style="min-height: 100px"
      >
        <div
          class="flex flex-row justify-between items-center px-3 py-3 text-slate-300 border border-solid border-slate-300 border-l-0 border-r-0 border-t-0 text-lg"
        >
          <span class="text-slate-900">{{ title }}</span>
          <span
            @click="cancel"
            class="material-symbols-outlined cursor-pointer text-slate-900 hover:text-red-500"
            title="Đóng"
          >
            close
          </span>
        </div>
        <div class="flex flex-col my-5 mx-3">
          <div class="flex flex-row">
            <div
              class="w-full overflow-auto pr-3 pt-3"
              style="max-height: calc(100vh - 250px)"
            >
              <!-- name -->
              <div class="flex flex-col text-slate-900">
                <label for="name_c" class="-mt-2.5 flex items-center"
                  >Họ và tên<span class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.name"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                  name="name_c"
                  type="text"
                  placeholder=""
                  :class="errors.name_c ? 'border-red-500' : 'border-slate-300'"
                  autocomplete="off"
                />
                <ErrorMessage
                  name="name_c"
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
                    id="male3"
                    name="gender3"
                    value="true"
                    v-model="item.gender"
                    class="mr-2"
                    :checked="item.gender == 'true'"
                  />
                  <label for="male" class="mr-4 mt-1">Nam</label>

                  <input
                    type="radio"
                    id="female3"
                    name="gender3"
                    value="false"
                    v-model="item.gender"
                    class="mr-2"
                    :checked="item.gender == 'false'"
                  />
                  <label for="female3" class="mt-1">Nữ</label>
                </div>
              </div>
              <!-- birthday -->
              <div class="flex flex-col text-slate-900">
                <label for="name_c" class="mt-2.5 ml-1 flex items-center"
                  >Ngày sinh<span class="text-red-500 text-3xl relative ml-0.5"
                    >*</span
                  ></label
                >
                <Field
                  v-model="item.birthday"
                  class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
                  name="birthday"
                  type="date"
                  placeholder=""
                  :class="
                    errors.birthday ? 'border-red-500' : 'border-slate-300'
                  "
                  autocomplete="off"
                />
                <ErrorMessage
                  name="birthday"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                />
              </div>
              <!-- address -->
              <LocationPicker2
                :province="item.province"
                :district="item.district"
                :ward="item.ward"
                :checks="checks1"
                @province-selected="(value) => (item.province = value)"
                @district-selected="(value) => (item.district = value)"
                @ward-selected="(value) => (item.ward = value)"
              />
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
                  name="address_c"
                  as="textarea"
                  style=""
                  placeholder=""
                  :class="
                    errors.address_c ? 'border-red-500' : 'border-slate-300'
                  "
                  autocomplete="off"
                />
                <ErrorMessage
                  name="address_c"
                  class="text-red-500 mt-2 ml-0.5 text-sm"
                />
              </div>
              <button
                @click="
                  () => {
                    checks1 = {
                      province: false,
                      district: false,
                      ward: false,
                    };
                    if (
                      !errors.birthday &&
                      item.province &&
                      item.district &&
                      item.ward
                    ) {
                      submit();
                    }
                  }
                "
                class="text-white border border-solid px-3 py-1.5 flex items-center justify-center rounded-md mt-5 hover:shadow-lg hover:shadow-yellow-500/50"
                :class="[
                  buttonName == 'Add'
                    ? 'border-green-500 hover:bg-green-500'
                    : 'border-yellow-500 bg-yellow-500',
                ]"
              >
                {{ buttonName == "Edit" ? "Cập nhật" : "Thêm" }}
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
import Account from "../../services/account.service";
import ChildcareCenter from "../../services/childcareCenter.service";
import axios from "axios";
import LocationPicker from "../../components/forms/LocationPicker.vue";
import LocationPicker1 from "../../components/forms/LocationPicker.vue";
import LocationPicker2 from "../../components/forms/LocationPicker.vue";
import { alert_input_1 } from "../../assets/js/alert.js";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    FSelect,
    BAdd,
    LocationPicker,
    LocationPicker1,
    LocationPicker2,
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
      this.runGet = false;
    },
    async activeStep() {
      await this.getAllAccounts();
      if (this.activeStep == 3) {
        this.setUser();
      }
    },
  },
  data() {
    const formSchema = yup.object().shape({
      name: yup.string().required(`Đây là trường bắt buộc.`),
      name_c: yup.string().required(`Đây là trường bắt buộc.`),
      phone: yup
        .string()
        .required(`Đây là trường bắt buộc.`)
        .matches(
          /((09|03|07|08|05)+([0-9]{8})\b)/g,
          `Số điện thoại không hợp lệ.`
        ),
      email: yup.string().email("Địa chỉ mail không hợp lệ."),
      address: yup.string().required(`Đây là trường bắt buộc.`),
      address_c: yup.string().required(`Đây là trường bắt buộc.`),
      birthday: yup
        .date()
        .required(`Đây là trường bắt buộc.`)
        .max(new Date(), "Ngày sinh không được lớn hơn ngày hiện tại.")
        .test("age", "Tuổi trẻ phải từ 0-6 tuổi.", (value) => {
          if (value) {
            const today = new Date();
            const age = today.getFullYear() - value.getFullYear();
            return age >= 0 && age <= 6;
          }
          return false;
        }),
      startSchooling: yup.date().required(`Đây là trường bắt buộc.`),
      // .min(new Date(), "Ngày bắt đầu nhập học phải lớn hơn ngày hiện tại."),
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
          name: "Thông tin phụ huynh",
        },
        {
          id: 2,
          name: "Thông tin trẻ",
        },
        {
          id: 3,
          name: "Thông tin tài khoản",
        },
      ],
      activeStep: 1,
      showPassword: true,
      accounts: [],
      checkUser: true,
      modeAdd: true,
      addressFull: [],
      checks: {
        province: true,
        district: true,
        ward: true,
      },
      checks1: {
        province: true,
        district: true,
        ward: true,
      },
      childcareCenter: [],
    };
  },
  methods: {
    alert_input_1,
    cancel() {
      this.$emit("cancel", false);
    },
    submit() {
      this.$emit("submit");
    },
    cLog(value) {
      console.log(value);
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
      this.item.user_name = this.item.c_name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .split(" ")
        .join("");
      this.generateOTP();
    },

    async getAllAccounts() {
      try {
        this.accounts = await Account.getAll();
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

    checkUser1() {
      this.accounts = this.accounts.filter((value, index) => {
        return value.name == this.item.user_name;
      });
      if (this.accounts.length > 0) this.checkUser = false;
      else this.checkUser = true;
    },
  },
  created() {
    this.getAllAccounts();
    this.getAllChildcareCenter();
    const apiUrl = "https://provinces.open-api.vn/api/";
    const params = { depth: 3 };

    // Sử dụng axios để gửi yêu cầu GET
    axios
      .get(apiUrl, { params })
      .then((response) => {
        // Xử lý dữ liệu trả về từ API
        console.log("Dữ liệu từ API:", response.data);
        this.addressFull = response.data;
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  },
};
</script>
