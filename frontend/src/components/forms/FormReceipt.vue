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
              class="border-slate-600"
            />
          </div>
          <!-- grade -->
          <div class="flex flex-col text-slate-300">
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
              :disabled="grade.length == 0 ? `true` : `false`"
              class="border-slate-600"
            />
          </div>
          <!-- dateStart -->
          <div class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >Start date<span
                class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                >*</span
              ></label
            >
            <input
              class="bg-inherit border border-solid border-slate-600 focus:border-slate-300 rounded-md py-1.5 px-2"
              type="date"
              name=""
              id=""
              v-model="item.dateStart"
            />
          </div>
          <!-- dateEnd -->
          <div class="flex flex-col text-slate-300">
            <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
              >End date<span
                class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
                >*</span
              ></label
            >
            <input
              class="bg-inherit border border-solid border-slate-600 focus:border-slate-300 rounded-md py-1.5 px-2"
              type="date"
              name=""
              id=""
              v-model="item.dateEnd"
            />
          </div>
          <!-- total -->
          <div v-if="this.item.total != 0" class="flex flex-col text-slate-300">
            <label for="" class="mb-3 mt-5 ml-1 flex items-center">Total</label>
            <input
              class="bg-inherit border border-solid border-slate-600 focus:border-slate-300 rounded-md py-1.5 px-2"
              type="text"
              name=""
              id=""
              v-model="item.total"
              disabled
            />
          </div>
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
    mSYear() {
      if (this.item.schoolYear.length != 0) {
        this.getAllGrade();
      }
    },
    mGrade() {
      if (this.item.grade.length != 0) {
        this.getAllClasses();
      }
    },
  },
  data() {
    return {
      sYear: [],
      tFees: [],
      grade: [],
      classes: [],
      teacher: [],
      children: [],
      duty: [],
      mSYear: {},
      mTFees: {},
      mGrade: {},
      mClasses: {},
      mDuty: {},
      mTeacher: {},
      mChild: {},
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
      if (
        !this.item.schoolYear ||
        !this.item.grade ||
        !this.item.dateStart ||
        !this.item.dateEnd
      ) {
      } else this.$emit("submit");
    },

    async getAllSYear() {
      try {
        this.sYear = await SYear.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    async getAllGrade() {
      try {
        if (this.item.schoolYear.length != 0) {
          this.grade = await Grade.getAll();
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getAllTeacher() {
      try {
        this.teacher = await Teacher.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    async getAllClasses() {
      try {
        this.classes = await Classes.getAll();
        this.classes = this.classes.filter((value, index) => {
          return (
            value.schoolYear._id == this.item.schoolYear &&
            value.grade._id == this.item.grade
          );
        });
      } catch (error) {
        console.log(error);
      }
    },

    async getSYear() {
      try {
        if (this.item.schoolYear.length != 0) {
          this.mSYear = await SYear.get(this.item.schoolYear);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getGrade() {
      try {
        if (this.item.grade.length != 0) {
          this.mGrade = await Grade.get(this.item.grade);
          if (this.item.total == 0) {
            for (let value of this.mGrade.collectionRates) {
              this.item.total += value.money;
            }
          } else if (this.item.total != 0) {
            this.item.total = 0;
            for (let value of this.mGrade.collectionRates) {
              this.item.total += value.money;
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getClasses() {
      try {
        if (this.item.classes.length != 0) {
          const temp = await Classes.get(this.item.classes);
          this.mClasses = temp[0];
          this.children = this.mClasses.children;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getChild() {
      try {
        this.mChild = await Children.get(this.item.child);
      } catch (error) {
        console.log(error);
      }
    },

    async getAll() {
      await this.getAllSYear();
    },

    async get() {
      await this.getSYear();
      await this.getGrade();
    },
  },
  async created() {
    await this.getAll();
    await this.get();
  },
};
</script>
