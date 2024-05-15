<template>
  <Form @submit="submit" :validation-schema="formSchema" v-slot="{ errors }">
    <div
      class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
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
            title="Đóng"
          >
            close
          </span>
        </div>
        <div class="flex flex-col mt-2 mx-3">
          <div class="flex flex-row">
            <div
              class="w-full overflow-auto pr-3 py-3"
              v-show="activeStep == 1"
              style="max-height: calc(100vh - 250px)"
            >
              <!-- name -->
              <div class="flex flex-col text-slate-900">
                <label for="name" class="-mt-2.5 flex items-center"
                  >Họ và tên<span class="text-red-500 text-3xl ml-0.5 relative"
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
                <div class="flex items-center -mt-2 -mb-2">
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
                  >Số điện thoại<span
                    class="text-red-500 text-3xl relative ml-0.5"
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
                  >E-mail<span class="text-slate-900 text-3xl relative ml-0.5"
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
                :checks="checks"
                :province="item.province"
                :district="item.district"
                :ward="item.ward"
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
                        item.relationship = value;
                      } else {
                        item.relationship = await alert_input_1(
                          'text',
                          '',
                          'Nhập vào mối quan hệ với trẻ',
                        );
                      }
                    }
                  "
                  @update="(value) => (runGet = value)"
                  :model-value="item.relationship"
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
                      errors.phone &&
                      ((errors.email && item.email) || !item.email) &&
                      item.province &&
                      item.district &&
                      item.ward
                    ) {
                      submit();
                    }
                  }
                "
                class="text-white border border-solid px-3 py-1.5 flex items-center justify-center rounded-md mt-5 hover:shadow-lg hover:shadow-yellow-500/50"
                :class="
                  buttonName == 'Add'
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-yellow-500 bg-yellow-500'
                "
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
import Account from "../../services/account.service";
import LocationPicker from "../../components/forms/LocationPicker.vue";
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
  },
  data() {
    const formSchema = yup.object().shape({
      name: yup.string().required("Đây là trường bắt buộc."),
      phone: yup
        .string()
        .required("Đây là trường bắt buộc.")
        .matches(
          /((09|03|07|08|05)+([0-9]{8})\b)/g,
          "Số điện thoại không hợp lệ."
        ),
      email: yup.string().email("Địa chỉ mail không hợp lệ."),
      address: yup.string().required("Đây là trường bắt buộc."),
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
          name: "Parents",
        },
      ],
      activeStep: 1,
      showPassword: false,
      accounts: [],
      checkUser: true,
      modeAdd: true,
      checks: {
        province: true,
        district: true,
        ward: true,
      },
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
  },
  created() {},
};
</script>
