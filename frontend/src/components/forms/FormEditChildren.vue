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
        <div class="flex flex-col text-slate-300">
          <label for="name_c" class="mb-1 -mt-2.5 ml-1 flex items-center"
            >Name<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
              >*</span
            ></label
          >
          <Field
            v-model="item.name"
            class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
            name="name_c"
            type="text"
            placeholder=""
            :class="!item.name ? 'border-red-500' : 'border-slate-600'"
          />
        </div>
        <!-- gender -->
        <div class="flex flex-col text-slate-300">
          <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
            >Gender<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
              >*</span
            ></label
          >
          <FSelect
            class=""
            @update:modelValue="(value) => (item.gender = value)"
            :modelValue="`${item.gender ? 'Nam' : 'Nữ'}`"
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
          />
        </div>
        <!-- birthday -->
        <div class="flex flex-col text-slate-300">
          <label for="name_c" class="mb-1 mt-2.5 ml-1 flex items-center"
            >Birthday<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
              >*</span
            ></label
          >
          <Field
            v-model="item.birthday"
            class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
            name="birthday"
            type="date"
            placeholder=""
            :class="!item.birthday ? 'border-red-500' : 'border-slate-600'"
          />
        </div>
        <!-- address -->
        <div class="flex flex-col text-slate-300">
          <label for="" class="mb-1 mt-2.5 ml-1 flex items-center"
            >Address<span class="text-red-500 text-3xl mt-2.5 relative -ml-0.5"
              >*</span
            ></label
          >
          <Field
            v-model="item.address"
            class="bg-inherit rounded-md px-2 py-1.5 border border-solid focus:border-slate-300"
            name="address_c"
            id="address_c"
            style=""
            type="text"
            placeholder=""
            :class="!item.address ? 'border-red-500' : 'border-slate-600'"
          />
        </div>
        <div class="flex justify-center">
          <button
            @click="submit"
            class="text-slate-300 w-32 border border-solid border-yellow-500 px-3 py-1.5 flex items-center justify-center rounded-md hover:bg-yellow-500 mt-5 hover:text-slate-100"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  </div>
  {{ item }}
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
      this.runGet = false;
    },
  },
  data() {
    return {
      runGet: false,
      error: false,
    };
  },
  methods: {
    cancel() {
      this.$emit("cancel", false);
    },
    async submit() {
      if (
        !this.item.name ||
        !this.item.birthday ||
        !this.item.address
      ) {
        console.log('eror');
        console.log(item.gender);
      } else this.$emit("submit");
    },
  },
  async created() {},
};
</script>
