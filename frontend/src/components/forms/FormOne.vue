<template>
  <div
    class="fixed top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
  >
    <div class="bg-slate-800 h-screen opacity-70 flex-1 relative"></div>
    <div
      class="bg-slate-800 mx-5 w-4/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
      style="max-height: 100vh; min-height: 100px;"
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
        <Form @submit="" :validation-schema="formSchema" v-slot="{ errors }">
          <div
            v-if="name != `CollectionRates` && name != `Classes`"
            class="flex flex-col text-slate-300"
          >
            <label for="name" class="mb-1 -mt-2.5 ml-1 flex items-center"
              >Name<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
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
            <ErrorMessage name="name" class="text-red-500 mt-1 ml-1 text-sm" />
          </div>

          <div
            v-if="name == 'grade'"
            class="flex flex-col text-slate-300 mt-5"
          >
            <label for="name" class="mb-1 -mt-2.5 ml-1 flex items-center"
              >Description<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                >*</span
              ></label
            >
            <Field
              v-model="item.description"
              class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
              name="description"
              type="text"
              placeholder=""
              :class="!item.description ? 'border-red-500' : 'border-slate-600'"
            />
            <ErrorMessage name="description" class="text-red-500 mt-1 ml-1 text-sm" />
          </div>

          <!-- Duty -->
          <div v-if="name == `Duty`" class="flex flex-col text-slate-300">
            <label for="description" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Description<span
                class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                >*</span
              ></label
            >
            <Field
              v-model="item.description"
              class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
              name="description"
              type="text"
              placeholder=""
              :class="!item.description ? 'border-red-500' : 'border-slate-600'"
            />
            <ErrorMessage
              name="description"
              class="text-red-500 mt-1 ml-1 text-sm"
            />
          </div>

          <!-- !Collection Rates -->
          <!-- school year -->
          <div
            v-if="name == `CollectionRates`"
            class="flex flex-col text-slate-300"
          >
            <label for="" class="mb-1 -mt-2.5 ml-1 flex items-center"
              >School year<span
                class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                >*</span
              ></label
            >
            <FSelect
              @update:modelValue="(value) => (item.schoolYear = value)"
              @update="(value) => (runGet = value)"
              :options="sYear"
              :modelValue="mSYear.name"
              :class="!item.schoolYear ? 'border-red-500' : 'border-slate-600'"
            />
            <span v-if="!item.schoolYear" class="text-red-500 mt-1 ml-1 text-sm"
              >Please select a value !</span
            >
          </div>
          <!-- grade -->
          <div
            v-if="name == `CollectionRates`"
            class="flex flex-col text-slate-300"
          >
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Grade<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
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
          <!-- tuition fees -->
          <div
            v-if="name == `CollectionRates`"
            class="flex flex-col text-slate-300"
          >
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Tuition fees<span
                class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                >*</span
              ></label
            >
            <FSelect
              @update:modelValue="(value) => (item.tuitionFees = value)"
              @update="(value) => (runGet = value)"
              :options="tFees"
              :modelValue="mTFees.name"
              :class="!item.tuitionFees ? 'border-red-500' : 'border-slate-600'"
            />
            <span
              v-if="!item.tuitionFees"
              class="text-red-500 mt-1 ml-1 text-sm"
              >Please select a value !</span
            >
          </div>
          <!-- money -->
          <div
            v-if="name == `CollectionRates`"
            class="flex flex-col text-slate-300"
          >
            <label for="money" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Money<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                >*</span
              ></label
            >
            <Field
              v-model="item.money"
              class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
              name="money"
              style="letter-spacing: 5px"
              type="text"
              placeholder=""
              @input="formatMoney(item.money)"
              :class="
                !item.money || errors.money
                  ? 'border-red-500'
                  : 'border-slate-600'
              "
              value="abc"
            />
            <ErrorMessage name="money" class="text-red-500 mt-1 ml-1 text-sm" />
          </div>
          <!-- !Classes -->
          <!-- Amount classes -->
          <div v-if="name == `Classes`" class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Amount classes<span
                class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                >*</span
              ></label
            >
            <Field
              v-model="item.amountClasses"
              class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
              name="amountClasses"
              style=""
              type="number"
              placeholder=""
              :class="
                !item.amountClasses || errors.amountClasses
                  ? 'border-red-500'
                  : 'border-slate-600'
              "
            />
            <ErrorMessage
              name="amountClasses"
              class="text-red-500 mt-1 ml-1 text-sm"
            />
          </div>
          <!-- school year -->
          <div v-if="name == `Classes`" class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >School year<span
                class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                >*</span
              ></label
            >
            <FSelect
              @update:modelValue="(value) => (item.schoolYear = value)"
              @update="(value) => (runGet = value)"
              :options="sYear"
              :modelValue="mSYear.name"
              :class="!item.schoolYear ? 'border-red-500' : 'border-slate-600'"
            />
            <span v-if="!item.schoolYear" class="text-red-500 mt-1 ml-1 text-sm"
              >Please select a value !</span
            >
          </div>
          <!-- grade -->
          <div v-if="name == `Classes`" class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Grade<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
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
          <!-- !Teacher -->
          <!-- gender -->
          <div v-if="name == `Teacher`" class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Gender<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
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
              >Phone<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
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
            <ErrorMessage name="phone" class="text-red-500 mt-1 ml-1 text-sm" />
          </div>
          <!-- email -->
          <div v-if="name == `Teacher`" class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >E-mail<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
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
            <ErrorMessage name="email" class="text-red-500 mt-1 ml-1 text-sm" />
          </div>
          <!-- address -->
          <div v-if="name == `Teacher`" class="flex flex-col text-slate-300">
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
          <!-- Position -->
          <div v-if="name == `Teacher`" class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Position<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
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
          <button
            @click="submit"
            class="text-slate-300 border border-solid border-green-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:bg-green-500 mt-5 hover:text-slate-100"
          >
            Add
          </button>
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
      name: yup.string().required("Name must have a value !"),
      description: yup.string().required("Description must have a value !"),
      money: yup.number().min(10000, "Minimum value is 10.000 vnd !"),
      amountClasses: yup.number().max(10, "Maximum value is 10 !"),
      phone: yup
        .string()
        .required("Phone number must have a value.")
        .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "Invalid phone number !"),
      email: yup
        .string()
        .required("Email must have a value !")
        .email("Incorrect e-mail !"),
      address: yup.string().required("Address must have a value !"),
    });
    return {
      formSchema,
      sYear: [],
      tFees: [],
      grade: [],
      mSYear: {},
      mTFees: {},
      mGrade: {},
      runGet: false,
      error: false,
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
