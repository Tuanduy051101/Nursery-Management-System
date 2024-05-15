<template>
  <div
    class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
  >
    <div class="bg-slate-900 h-screen opacity-70 flex-1 relative"></div>
    <div
      class="bg-white mx-5 w-4/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
      style="max-height: 100vh; min-height: 100px"
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
        <Form @submit="" :validation-schema="formSchema" v-slot="{ errors }">
          <div
            v-if="name != `CollectionRates` && name != `Classes`"
            class="flex flex-col text-slate-900"
          >
            <label for="name" class="mb-1 -mt-2.5 flex items-center"
              >Tên<span class="text-red-500 text-3xl mt-2.5 relative ml-0.5"
                >*</span
              ></label
            >
            <Field
              v-model="item.name"
              class="bg-inherit rounded-md px-2 py-1.5 -mt-2.5 border border-solid focus:border-slate-900"
              name="name"
              type="text"
              placeholder=""
              :class="errors.name ? 'border-red-500' : 'border-slate-300'"
              autocomplete="off"
            />
            <ErrorMessage
              name="name"
              class="text-red-500 ml-0.5 mt-2 text-sm"
            />
          </div>

          <div v-if="name == 'grade'" class="flex flex-col text-slate-900 mt-5">
            <label for="name" class="mb-1 flex items-center"
              >Mô tả<span class="text-red-500 text-3xl relative ml-0.5"
                >*</span
              ></label
            >
            <Field
              v-model="item.description"
              class="bg-inherit rounded-md px-2 py-1.5 -mt-1.5 border border-solid focus:border-slate-300"
              name="description"
              type="text"
              placeholder=""
              autocomplete="off"
              as="textarea"
              :class="
                errors.description ? 'border-red-500' : 'border-slate-300'
              "
            />
            <ErrorMessage
              name="description"
              class="text-red-500 ml-0.5 mt-2 text-sm"
            />
            <!-- <ErrorMessage name="description" class="text-red-500 mt-2 text-sm" /> -->
          </div>

          <!-- Duty -->
          <div v-if="name == `Duty`" class="flex flex-col text-slate-900">
            <label for="description" class="mt-2.5 mb-2 flex items-center"
              >Mô tả<span class="text-black text-3xl relative ml-0.5"
                >*</span
              ></label
            >
            <Field
              v-model="item.description"
              class="bg-inherit rounded-md px-2 py-1.5 -mt-2.5 border-slate-300 border border-solid focus:border-slate-900"
              name="description"
              type="text"
              as="textarea"
              placeholder=""
              autocomplete="off"
            />
          </div>

          <!-- !Collection Rates -->
          <!-- school year -->
          <div
            v-if="name == `CollectionRates`"
            class="flex flex-col text-slate-900"
          >
            <label for="" class="mb-1 -mt-2.5 flex items-center"
              >Năm học<span class="text-red-500 text-3xl relative ml-0.5"
                >*</span
              ></label
            >
            <FSelect
              v-if="mSYear?.name || buttonName == 'Add'"
              @update:modelValue="(value) => (item.schoolYear = value)"
              @update="(value) => (runGet = value)"
              :options="sYear"
              :disabled="disabled"
              :modelValue="mSYear.name"
              :class="!item.schoolYear ? 'border-red-500' : 'border-slate-300'"
            />
            <span
              v-if="!item.schoolYear"
              class="text-red-500 ml-0.5 mt-2 text-sm"
              >Đây là trường bắt buộc.</span
            >
          </div>
          <!-- grade -->
          <div
            v-if="name == `CollectionRates`"
            class="flex flex-col text-slate-900"
          >
            <label for="" class="mb-1 mt-2.5 flex items-center"
              >Khối học<span class="text-red-500 text-3xl relative ml-0.5"
                >*</span
              ></label
            >
            <FSelect
              v-if="mGrade?.name || buttonName == 'Add'"
              @update:modelValue="(value) => (item.grade = value)"
              @update="(value) => (runGet = value)"
              :options="grade"
              :modelValue="mGrade.name"
              :disabled="disabled"
              :class="!item.grade ? 'border-red-500' : 'border-slate-300'"
            />
            <span v-if="!item.grade" class="text-red-500 ml-0.5 mt-2 text-sm"
              >Đây là trường bắt buộc.</span
            >
          </div>
          <!-- tuition fees -->
          <div
            v-if="name == `CollectionRates`"
            class="flex flex-col text-slate-900"
          >
            <label for="" class="mb-1 mt-2.5 flex items-center"
              >Khoản thu<span class="text-red-500 text-3xl relative ml-0.5"
                >*</span
              ></label
            >
            <FSelect
              v-if="mTFees?.name || buttonName == 'Add'"
              @update:modelValue="(value) => (item.tuitionFees = value)"
              @update="(value) => (runGet = value)"
              :options="tFees"
              :modelValue="mTFees.name"
              :disabled="disabled"
              :class="!item.tuitionFees ? 'border-red-500' : 'border-slate-300'"
            />
            <span
              v-if="!item.tuitionFees"
              class="text-red-500 ml-0.5 mt-2 text-sm"
              >Đây là trường bắt buộc.</span
            >
          </div>
          <!-- money -->
          <div
            v-if="name == `CollectionRates`"
            class="flex flex-col text-slate-900"
          >
            <label for="money" class="mb-1 mt-2.5 flex items-center"
              >Mức thu<span class="text-red-500 text-3xl relative ml-0.5"
                >*</span
              ></label
            >
            <Field
              :value="item.money_d"
              @input="$emit('money', $event.target.value)"
              class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-900"
              name="money"
              type="text"
              placeholder=""
              :class="errors.money ? 'border-slate-300' : 'border-slate-300'"
              autocomplete="off"
            />
            <span
              v-if="item.money"
              class="text-green-500 ml-0.5 mt-2 text-sm"
              >{{ item.money_d }}</span
            >
            <span
              v-if="!item.money && !errors.money"
              class="text-red-500 ml-0.5 mt-2 text-sm"
              >Đây là trường bắt buộc.</span
            >
            <ErrorMessage name="money" class="text-red-500 mt-2 text-sm" />
          </div>
          <!-- !Classes -->
          <!-- school year -->
          <div
            v-if="name == `Classes` && buttonName == 'Add'"
            class="flex flex-col text-slate-900"
          >
            <label for="" class="flex items-center -mt-2.5"
              >Năm học<span class="text-red-500 text-3xl relative ml-0.5"
                >*</span
              ></label
            >
            <FSelect
              @update:modelValue="(value) => (item.schoolYear = value)"
              @update="(value) => (runGet = value)"
              :options="sYear"
              :modelValue="mSYear.name"
              :class="!item.schoolYear ? 'border-red-500' : 'border-slate-300'"
            />
            <span
              v-if="!item.schoolYear"
              class="text-red-500 mt-2 ml-0.5 text-sm"
              >Đây là trường bắt buộc.</span
            >
          </div>
          <!-- grade -->
          <div
            v-if="name == `Classes` && buttonName == 'Add'"
            class="flex flex-col text-slate-900"
          >
            <label for="" class="mt-2.5 flex items-center"
              >Khối học<span class="text-red-500 text-3xl relative ml-0.5"
                >*</span
              ></label
            >
            <FSelect
              @update:modelValue="(value) => (item.grade = value)"
              @update="(value) => (runGet = value)"
              :options="grade"
              :modelValue="mGrade.name"
              :class="!item.grade ? 'border-red-500' : 'border-slate-300'"
            />
            <span v-if="!item.grade" class="text-red-500 mt-2 ml-0.5 text-sm"
              >Đây là trường bắt buộc.</span
            >
          </div>
          <!-- Amount classes -->
          <div
            v-if="name == `Classes` && buttonName == 'Add'"
            class="flex flex-col text-slate-900"
          >
            <label for="" class="mt-2.5 flex items-center"
              >Số lượng lớp<span class="text-red-500 text-3xl relative ml-0.5"
                >*</span
              ></label
            >
            <Field
              v-model="item.amountClasses"
              class="bg-inherit rounded-md px-2 py-1.5 border border-solid border-slate-300 focus:border-slate-900"
              name="amountClasses"
              style=""
              type="number"
              placeholder=""
              autocomplete="off"
            />
            <ErrorMessage
              name="amountClasses"
              class="text-red-500 mt-2 ml-0.5 text-sm"
            />
            <span
              v-if="!item.amountClasses"
              class="text-red-500 mt-2 ml-0.5 text-sm"
              >Đây là trường bắt buộc.</span
            >
          </div>
          <!-- Amount children -->
          <div
            v-if="name == `Classes` && buttonName == 'Add'"
            class="flex flex-col text-slate-900"
          >
            <label for="" class="mt-2.5 flex items-center"
              >Số lượng trẻ<span class="text-black text-3xl relative ml-0.5"
                >*</span
              ></label
            >
            <Field
              v-model="item.amountChildren"
              class="bg-inherit rounded-md px-2 py-1.5 border border-solid border-slate-300 focus:border-slate-900"
              name="amountChildren"
              style=""
              type="number"
              placeholder=""
              autocomplete="off"
            />
            <ErrorMessage
              name="amountChildren"
              class="text-red-500 mt-2 ml-0.5 text-sm"
            />
          </div>
          <!-- edit name class -->
          <div
            v-if="name == `Classes` && buttonName == 'Edit'"
            class="flex flex-col text-slate-900"
          >
            <label for="" class="flex items-center"
              >Tên lớp học<span class="text-red-500 text-3xl relative ml-0.5"
                >*</span
              ></label
            >
            <Field
              v-model="item.name"
              class="bg-inherit rounded-md px-2 py-1.5 border border-solid border-slate-300 focus:border-slate-900"
              name="className"
              style=""
              type="text"
              placeholder=""
              autocomplete="off"
            />
            <ErrorMessage
              name="className"
              class="text-red-500 mt-2 ml-0.5 text-sm"
            />
            <span v-if="!item.name" class="text-red-500 mt-2 ml-0.5 text-sm"
              >Tên lớp đã tồn tại.</span
            >
          </div>
          <!-- !Teacher -->
          <!-- gender -->
          <div v-if="name == `Teacher`" class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Gender<span class="text-red-500 text-3xl mt-2.5 relative ml-0.5"
                >*</span
              ></label
            >
            <FSelect
              @update:modelValue="(value) => (item.gender = value)"
              @update="(value) => (runGet = value)"
              :options="[
                {
                  _id: true,
                  name: 'nam',
                },
                {
                  _id: false,
                  name: 'nu',
                },
              ]"
              :modelValue="`nam`"
            />
          </div>
          <!-- phone -->
          <div v-if="name == `Teacher`" class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Phone<span class="text-red-500 text-3xl mt-2.5 relative ml-0.5"
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
              autocomplete="off"
              :class="
                !item.phone || errors.phone
                  ? 'border-red-500'
                  : 'border-slate-600'
              "
            />
            <ErrorMessage name="phone" class="text-red-500 mt-1 ml-1 text-sm" />
          </div>
          <!-- email -->
          <div v-if="name == `Teacher`" class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >E-mail<span class="text-red-500 text-3xl mt-2.5 relative ml-0.5"
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
              autocomplete="off"
              :class="
                !item.email || errors.email
                  ? 'border-red-500'
                  : 'border-slate-600'
              "
            />
            <ErrorMessage name="email" class="text-red-500 mt-1 ml-1 text-sm" />
          </div>
          <!-- address -->
          <div v-if="name == `Teacher`" class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Address<span class="text-red-500 text-3xl mt-2.5 relative ml-0.5"
                >*</span
              ></label
            >
            <Field
              v-model="item.address"
              class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
              name="address"
              style=""
              type="text"
              placeholder=""
              autocomplete="off"
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
          <!-- Position -->
          <div v-if="name == `Teacher`" class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Position<span
                class="text-red-500 text-3xl mt-2.5 relative ml-0.5"
                >*</span
              ></label
            >
            <FSelect
              @update:modelValue="(value) => (item.grade = value)"
              @update="(value) => (runGet = value)"
              :options="grade"
              :modelValue="mGrade.name"
              :class="!item.grade ? 'border-red-500' : 'border-slate-600'"
            />
            <span v-if="!item.grade" class="text-red-500 mt-1 ml-1 text-sm"
              >Please select a value !</span
            >
          </div>
          <div class="flex">
            <button
              @click="$emit('submit')"
              class="border border-solid px-3 py-1.5 flex items-center justify-center rounded-md mt-5 hover:shadow-lg hover:shadow-yellow-500/50"
              :class="[
                buttonName == 'Add'
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-yellow-500 bg-yellow-500 text-white',
              ]"
            >
              {{ buttonName == "Add" ? "Thêm" : "Cập nhật" }}
            </button>
            <button
              v-if="buttonName == 'Add' && name == 'Classes'"
              @click="$emit('submit')"
              class="border border-solid ml-5 px-3 py-1.5 flex items-center justify-center rounded-md mt-5 hover:shadow-lg hover:shadow-yellow-500/50"
              :class="[
                buttonName == 'Add'
                  ? ' bg-purple-500 border-purple-500 text-white'
                  : 'border-yellow-500 bg-yellow-500 text-white',
              ]"
            >
              Thêm tự động
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import IAdd from "../icons/Add.vue";
import FSelect from "../forms/Select.vue";
import SYear from "../../services/sYear.service";
import Grade from "../../services/grade.service";
import TFees from "../../services/tuitionFees.service";
import { FormatMoney } from "format-money-js";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    IAdd,
    FSelect,
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
    disabled: {
      type: Boolean,
      default: false,
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
      name: yup.string().required(`Đây là trường bắt buộc.`),
      description: yup.string().required("Đây là trường bắt buộc."),
      // money: yup.number().min(10000, "Minimum value is 10.000 vnd !"),
      amountClasses: yup.number().max(10, "Maximum value is 10 !"),
      phone: yup
        .string()
        .required("Đây là trường bắt buộc.")
        .matches(
          /((09|03|07|08|05)+([0-9]{8})\b)/g,
          "Số điện thoại không hợp lệ."
        ),
      email: yup
        .string()
        .required("Đây là trường bắt buộc.")
        .email("Địa chỉ mail không hợp lệ."),
      address: yup.string().required("Đây là trường bắt buộc."),
      money: yup.string().required("Đây là trường bắt buộc."),
    });
    return {
      formSchema,
      sYear: [],
      tFees: [],
      grade: [],
      mSYear: {
        name: "",
      },
      mTFees: {},
      mGrade: {},
      runGet: false,
      error: false,
      childcareCenter: sessionStorage.getItem("owner_childcareCenter"),
    };
  },
  methods: {
    formatMoney(money) {
      const fm = new FormatMoney({
        decimals: 0,
        append: true,
      });

      const temp = fm.from(money, { symbol: "vnđ" });

      return temp;
    },
    cancel() {
      this.$emit("cancel", false);
    },
    async submit() {
      if (this.name == "CollectionRates") {
        if (
          !this.item.schoolYear ||
          !this.item.grade ||
          !this.item.tuitionFees ||
          !this.item.money
        ) {
        } else this.$emit("submit");
      } else if (this.name == "Classes") {
        if (
          !this.item.amountClasses ||
          !this.item.schoolYear ||
          !this.item.grade
        ) {
        } else {
          this.item.name =
            "NT" +
            this.mSYear.name[2] +
            this.mSYear.name[3] +
            this.mGrade.name[0] +
            "0";
          this.$emit("submit");
        }
      } else {
        this.$emit("submit");
      }
    },

    async getAllSYear() {
      try {
        this.sYear = await SYear.getAll();
        this.sYear = this.sYear.filter(
          (i) => i.childcareCenter._id == this.childcareCenter
        );
      } catch (error) {
        console.log(error);
      }
    },

    async getAllTFees() {
      try {
        this.tFees = await TFees.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    async getAllGrade() {
      try {
        this.grade = await Grade.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    async getSYear() {
      try {
        this.mSYear = await SYear.get(this.item.schoolYear);
      } catch (error) {
        console.log(error);
      }
    },

    async getTFees() {
      try {
        this.mTFees = await TFees.get(this.item.tuitionFees);
      } catch (error) {
        console.log(error);
      }
    },

    async getGrade() {
      try {
        this.mGrade = await Grade.get(this.item.grade);
      } catch (error) {
        console.log(error);
      }
    },

    async getAll() {
      await this.getAllSYear();
      await this.getAllTFees();
      await this.getAllGrade();
    },

    async get() {
      await this.getSYear();
      await this.getTFees();
      await this.getGrade();
    },
  },
  async created() {
    await this.getAll();
    await this.get();
  },
};
</script>
