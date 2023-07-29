<template>
  <div
    class="fixed top-0 right-0 w-screen h-screen z-50 flex overflow-auto items-center justify-center"
  >
    <div class="bg-slate-800 h-screen opacity-70 flex-1 relative"></div>
    <div
      class="bg-slate-800 mx-5 w-4/12 absolute rounded-md shadow-xl border border-solid border-slate-300"
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
        <!-- <Form v-slot="{ errors }"> -->
        <div>
          <!-- school year -->
          <div class="flex flex-col text-slate-300">
            <label for="" class="mb-3 ml-1 flex items-center">Diploma</label>
            <FSelect
              @update:modelValue="(value) => (item.diploma = value)"
              @update="(value) => (runGet = value)"
              :options="diploma"
              class="border-slate-600"
            />
          </div>
          <!-- grade -->
          <div class="flex flex-col text-slate-300">
            <label for="" class="mb-3 mt-5 ml-1 flex items-center">Other</label>
            <input
              :disabled="item.diploma.length > 0"
              v-model="item.other"
              type="text"
              name=""
              id=""
              class="bg-inherit border border-solid border-slate-600 py-1.5 px-2 rounded-md"
            />
          </div>
          {{ item }}
          <button
            @click="submit"
            class="text-slate-300 border border-solid border-green-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:bg-green-500 mt-5 hover:text-slate-100"
          >
            Add
          </button>
        </div>
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
import Classes from "../../services/classes.service";
import TFees from "../../services/tuitionFees.service";
import Teacher from "../../services/teacher.service";
import Children from "../../services/children.service";
import Duty from "../../services/duty.service";
import Diploma from "../../services/diploma.service";
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
    return {
      runGet: false,
      error: false,
      diploma: [],
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
      this.$emit("cancel", false, null);
    },
    async submit() {
      if (this.item.diploma.length > 0 || this.item.other.length > 0) {
        this.$emit("submit");
      }
    },

    async getAllDiploma() {
      try {
        this.diploma = await Diploma.getAll();
        this.diploma = this.diploma.filter((value, index) => {
          var check = false;
          for (let value1 of value.teacher) {
            console.log(value1._id);
            console.log(this.item._id);
            if (value1._id == this.item._id) {
              check = true;
              break;
            }
          }
          return check == false;
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  async created() {
    this.getAllDiploma();
  },
};
</script>
